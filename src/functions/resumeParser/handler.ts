import { Tag } from '@aws-sdk/client-s3';
import { UnleashConfig } from '@pulsifi/configs';
import { DaxtraStatus, FeatureToggleName, TagKey } from '@pulsifi/enum';
import { FailedToProcessCandidateResumeException } from '@pulsifi/exceptions';
import { logger } from '@pulsifi/fn';
import { File } from '@pulsifi/interfaces';
import {
    FeatureToggleService,
    getFileAsBufferFromS3,
    getObjectTagSet,
    getResumeParsedData,
    updateObjectTagging,
    uploadPublicItem,
} from '@pulsifi/services';
import { s3TagUtil } from '@pulsifi/utils';
import { S3Event, S3EventRecord } from 'aws-lambda';
import { isEmpty } from 'lodash';
import { Context } from 'unleash-client';

import { eventMiddleware } from '../../lib/commonMiddleware';
import { ErrorCode } from '../../lib/CustomError';

export const resumeParserHandler = async (event: S3Event): Promise<void> => {
    for (const record of event.Records) {
        try {
            await processS3Record(record);
        } catch (error) {
            logger.error('resumeParserHandler failed', error);

            throw new FailedToProcessCandidateResumeException({
                error_codes: [ErrorCode.FAILED_TO_PROCESS_CANDIDATE_RESUME],
                error,
                data: record,
            });
        }
    }
};

async function processS3Record(record: S3EventRecord): Promise<void> {
    const { s3 } = record;
    const bucket = s3?.bucket?.name;
    const key = s3?.object?.key;

    logger.info('Receive new object tagging event', s3);

    let s3ObjectTagSet = await getObjectTagSet(bucket, key);
    const { idempotenceKey, daxtraRequestDate, companyId } =
        getTagKeyValues(s3ObjectTagSet);

    logger.info('Tags before Daxtra parsing', { data: s3ObjectTagSet });

    if (
        isEmpty(idempotenceKey) ||
        isEmpty(companyId) ||
        !isEmpty(daxtraRequestDate)
    ) {
        logger.info('Skipping process', s3);
        return;
    }

    const isDaxtraDisabled = await isCompanyDaxtraDisabled(companyId);
    if (isDaxtraDisabled) {
        logger.info('Daxtra disabled');

        const tags = s3TagUtil.buildTagSet({
            [TagKey.DAXTRA_STATUS]: DaxtraStatus.DISABLED,
            [TagKey.DAXTRA_REQUEST_DATE]: `${new Date().toISOString()}`,
        });

        tags.push(...s3ObjectTagSet);
        return await updateObjectTagging(bucket, key, tags);
    }

    const file = await getFileAsBufferFromS3(bucket, key);
    const b64File: string = file.toString('base64');

    const initialTags = s3TagUtil.buildTagSet({
        [TagKey.DAXTRA_REQUEST_DATE]: `${new Date().toISOString()}`,
    });
    initialTags.push(...s3ObjectTagSet);
    await updateObjectTagging(bucket, key, initialTags); // NOTE: stamp daxtra request datetime to skip processing

    const { resume, tags } = await getResumeParsedData(b64File);
    if (resume) {
        const resumeDetailsJson = JSON.stringify(resume);

        const resumeDetailsJsonFile: File = {
            content: Buffer.from(resumeDetailsJson, 'utf-8'),
            filename: 'daxtra.json',
            mimeType: 'application/json',
        };

        const newKeyPath = `candidate/${idempotenceKey}/${resumeDetailsJsonFile.filename}`;

        await uploadPublicItem(
            bucket,
            newKeyPath,
            resumeDetailsJsonFile.content,
            resumeDetailsJsonFile.mimeType as string,
            false,
        );
    }

    s3ObjectTagSet = await getObjectTagSet(bucket, key);
    logger.info('Tags after Daxtra parsing', { data: s3ObjectTagSet });

    tags.push(...s3ObjectTagSet);
    await updateObjectTagging(bucket, key, tags);
}

const isCompanyDaxtraDisabled = (companyId: string): Promise<boolean> => {
    const unleashContext: Context = {
        environment: UnleashConfig().environment,
        companyId: companyId,
    };

    return FeatureToggleService.isUnleashFlagEnabled(
        FeatureToggleName.DAXTRA_CV_PARSER,
        unleashContext,
    );
};

const getTagKeyValues = (
    s3ObjectTagSet: Tag[],
): {
    idempotenceKey: string;
    daxtraRequestDate: string;
    companyId: string;
} => {
    const idempotenceKey = s3TagUtil.getTagKeyValue(
        s3ObjectTagSet,
        TagKey.IDEMPOTENCE_KEY,
    );

    const daxtraRequestDate = s3TagUtil.getTagKeyValue(
        s3ObjectTagSet,
        TagKey.DAXTRA_REQUEST_DATE,
    );

    const companyId = s3TagUtil.getTagKeyValue(
        s3ObjectTagSet,
        TagKey.COMPANY_ID,
    );

    return { idempotenceKey, daxtraRequestDate, companyId };
};

export const handler = eventMiddleware(resumeParserHandler);
