import { Tag } from '@aws-sdk/client-s3';
import { Event as MiddyBodyParserEvent } from '@middy/http-json-body-parser';
import { PulsifiConfig, S3Config } from '@pulsifi/configs';
import {
    DaxtraStatus,
    FilePurpose,
    FileScanErrorCode,
    FileScanStatus,
    TagKey,
} from '@pulsifi/enum';
import {
    CompanyIdNotProvidedException,
    FileNameNotProvidedException,
    IdempotenceKeyNotProvidedException,
    InvalidIdempotenceKeyException,
} from '@pulsifi/exceptions';
import { logger } from '@pulsifi/fn';
import {
    ResumeUpload,
    ResumeUploadRequest,
    ResumeUploadStatusMeta,
} from '@pulsifi/interfaces';
import { resumeMapper } from '@pulsifi/mappers';
import {
    getObjectTagSet,
    getResumeRawDataFromS3,
    updateObjectTagging,
    uploadPublicItem,
} from '@pulsifi/services';
import { FileUtil, s3TagUtil } from '@pulsifi/utils';
import { Handler } from 'aws-lambda';
import { isEmpty } from 'lodash';

import { httpMiddleware } from '../../lib/commonMiddleware';
import { ErrorCode } from '../../lib/CustomError';
import { validateFile } from '../fileUpload/validation';

const s3ObjectBaseUrl = `https://${S3Config.bucket_name}.s3-${S3Config.aws_region}.amazonaws.com`;

export const resumeUploadHandler: Handler<MiddyBodyParserEvent> = async (
    event,
) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { company_id, file, file_name } = event.body as ResumeUploadRequest;

    const idempotenceKey = event.headers['idempotence-key'];
    if (isEmpty(idempotenceKey)) {
        throw new IdempotenceKeyNotProvidedException({
            error_codes: [ErrorCode.IDEMPOTENCE_KEY_NOT_PROVIDED],
        });
    }

    let s3KeyPath;
    let s3ObjectFullUrl;

    if (!file) {
        if (isEmpty(file_name)) {
            throw new FileNameNotProvidedException({
                error_codes: [ErrorCode.INVALID_FILE_NAME],
            });
        }

        s3KeyPath = `candidate/${idempotenceKey}/${file_name}`;
        s3ObjectFullUrl = new URL(s3KeyPath, s3ObjectBaseUrl).toString();

        const s3ObjectTagSet = await getObjectTaggingByKeyPath(s3KeyPath);

        const isIdempotenceKeyFoundInTag =
            !isEmpty(s3ObjectTagSet) &&
            s3TagUtil.getTagKeyValue(s3ObjectTagSet, TagKey.IDEMPOTENCE_KEY) ===
                `${idempotenceKey}`;

        if (!isIdempotenceKeyFoundInTag) {
            throw new InvalidIdempotenceKeyException({
                error_codes: [ErrorCode.INVALID_IDEMPOTENCE_KEY],
            });
        }

        return await sendPollResponseToClient(
            s3ObjectTagSet,
            s3KeyPath,
            idempotenceKey!,
            file_name!,
            s3ObjectFullUrl,
        );
    }

    if (!company_id) {
        throw new CompanyIdNotProvidedException({
            error_codes: [ErrorCode.COMPANY_ID_NOT_PROVIDED],
        });
    }

    validateFile(FilePurpose.RESUME, file);

    const fileExtension = file.filename.split('.').pop();
    const fileName = `resume.${fileExtension}`;
    s3KeyPath = `candidate/${idempotenceKey}/${fileName}`;
    s3ObjectFullUrl = new URL(s3KeyPath, s3ObjectBaseUrl).toString();

    const s3ObjectTagSet = await getObjectTaggingByKeyPath(s3KeyPath);

    const isIdempotenceKeyFoundInTag =
        !isEmpty(s3ObjectTagSet) &&
        s3TagUtil.getTagKeyValue(s3ObjectTagSet, TagKey.IDEMPOTENCE_KEY) ===
            `${idempotenceKey}`;

    if (isIdempotenceKeyFoundInTag) {
        return await sendPollResponseToClient(
            s3ObjectTagSet,
            s3KeyPath,
            idempotenceKey!,
            fileName,
            s3ObjectFullUrl,
        );
    }

    // NOTE: This will trigger the file scan
    await uploadPublicItem(
        S3Config.bucket_name,
        s3KeyPath,
        file.content,
        FileUtil.getMimeType(file),
        false,
    );

    // NOTE: This will trigger the resume parser fn
    const tag = s3TagUtil.buildTagSet({
        [TagKey.IDEMPOTENCE_KEY]: `${idempotenceKey}`,
        [TagKey.COMPANY_ID]: `${company_id}`,
    });
    await updateObjectTagging(S3Config.bucket_name, s3KeyPath, tag);

    const resumeUpload = <ResumeUpload>{
        id: idempotenceKey,
        file_name: fileName,
        file_path: s3ObjectFullUrl,
        status_meta: {
            daxtra_status: DaxtraStatus.NOT_READY,
            file_scan_status: FileScanStatus.NOT_READY,
        },
        resume: null,
    };

    return {
        statusCode: 202,
        body: JSON.stringify({ data: resumeUpload }, null, 2),
    };
};

const getFileScanStatus = (
    s3ObjectTagSet: Tag[],
    bucket: string,
    key: string,
): ResumeUploadStatusMeta => {
    if (!PulsifiConfig.has_file_scanner_enable) {
        return <ResumeUploadStatusMeta>{
            file_scan_status: FileScanStatus.SUCCESS,
        };
    }

    const isScannedFinished =
        s3TagUtil.getTagKeyValue(s3ObjectTagSet, TagKey.FILE_SCAN_STATUS) ===
        'true';

    if (!isScannedFinished) {
        return <ResumeUploadStatusMeta>{
            file_scan_status: FileScanStatus.NOT_READY,
        };
    }

    const scanResult = s3TagUtil.getTagKeyValue(
        s3ObjectTagSet,
        TagKey.FILE_SCAN_RESULT,
    );

    if (scanResult === FileScanErrorCode.MALICIOUS) {
        const failedMessage =
            s3TagUtil.getTagKeyValue(s3ObjectTagSet, TagKey.FILE_SCAN_DETAIL) ??
            '';

        logger.error(
            'Fail in file scanned result due to malicious file detected.',
            {
                bucket,
                key,
                errorMessage: `${scanResult} - ${failedMessage}`,
            },
        );

        return <ResumeUploadStatusMeta>{
            file_scan_status: FileScanStatus.FAILED,
            file_scan_failed_reason: scanResult,
        };
    }

    return <ResumeUploadStatusMeta>{
        file_scan_status: FileScanStatus.SUCCESS,
    };
};

const getParsingStatusMeta = (
    s3ObjectTagSet: Tag[],
): ResumeUploadStatusMeta => {
    const daxtraStatus = s3TagUtil.getTagKeyValue(
        s3ObjectTagSet,
        TagKey.DAXTRA_STATUS,
    );

    if (!isEmpty(daxtraStatus)) {
        if (daxtraStatus === DaxtraStatus.FAILED) {
            const failedCode =
                s3TagUtil.getTagKeyValue(
                    s3ObjectTagSet,
                    TagKey.DAXTRA_ERROR_CODE,
                ) ?? null;

            return <ResumeUploadStatusMeta>{
                daxtra_status: daxtraStatus,
                daxtra_failed_reason: failedCode,
            };
        }

        return <ResumeUploadStatusMeta>{
            daxtra_status: daxtraStatus,
        };
    }

    return <ResumeUploadStatusMeta>{
        daxtra_status: DaxtraStatus.NOT_READY,
    };
};

const sendPollResponseToClient = async (
    s3ObjectTagSet: Tag[],
    s3KeyPath: string,
    idempotenceKey: string,
    fileName: string,
    s3ObjectFullUrl: string,
) => {
    const fileScanMeta = getFileScanStatus(
        s3ObjectTagSet,
        S3Config.bucket_name,
        s3KeyPath,
    );
    const daxtraStatusMeta = getParsingStatusMeta(s3ObjectTagSet);

    const resumeUploadResponse = <ResumeUpload>{
        id: idempotenceKey,
        file_name: fileName,
        file_path: s3ObjectFullUrl,
        status_meta: { ...fileScanMeta, ...daxtraStatusMeta },
        resume: null,
    };

    if (daxtraStatusMeta.daxtra_status === DaxtraStatus.SUCCESS) {
        const s3DaxtraJsonKey = `candidate/${idempotenceKey}/daxtra.json`;
        const s3DaxtraFullUrl = new URL(
            s3DaxtraJsonKey,
            s3ObjectBaseUrl,
        ).toString();

        const sourceDaxtraJsonFile = await getResumeRawDataFromS3(
            S3Config.bucket_name,
            s3DaxtraJsonKey,
        );

        resumeUploadResponse.resume = resumeMapper.toResumeDetails(
            sourceDaxtraJsonFile,
            s3DaxtraFullUrl,
        );
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ data: resumeUploadResponse }, null, 2),
    };
};

const getObjectTaggingByKeyPath = async (s3KeyPath: string): Promise<Tag[]> => {
    const s3ObjectTagSet = await getObjectTagSet(
        S3Config.bucket_name,
        s3KeyPath,
    );

    logger.info(`s3ObjectTagSet`, { data: s3ObjectTagSet });

    return s3ObjectTagSet;
};

export const handler = httpMiddleware(resumeUploadHandler);
