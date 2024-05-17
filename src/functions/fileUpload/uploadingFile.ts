import { PulsifiConfig, S3Config } from '@pulsifi/configs';
import { logger } from '@pulsifi/fn';
import { File, UploadingFileResponseDto } from '@pulsifi/interfaces';
import { copyFile, uploadPublicItem } from '@pulsifi/services';
import { FileUtil } from '@pulsifi/utils';
import { NIL as NIL_UUID } from 'uuid';

import { CustomError, ErrorType } from '../../lib/CustomError';

const DocumentUploadBucketName = S3Config.bucket_name;
const PulsifiAssetsBucketName = S3Config.assets_bucket_name;
const ClientAssetBasedPath = 'client';

export async function uploadingFile(
    file: File,
    shouldCheckFileScannedResult: boolean,
    uuid: string = NIL_UUID,
    intendedFileName = 'document',
    basePath = 'candidate',
): Promise<UploadingFileResponseDto> {
    const fileExtension = FileUtil.getFileExtension(file.filename);
    const fileName = `${intendedFileName}.${fileExtension}`;
    const fileNameWithDirectory = `${basePath}/${uuid}/${fileName}`;

    try {
        await uploadPublicItem(
            DocumentUploadBucketName,
            fileNameWithDirectory,
            file.content,
            FileUtil.getMimeType(file),
            shouldCheckFileScannedResult,
        );
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }

        logger.error('Failed to upload file to s3.', {
            context: 'S3',
            bucket: DocumentUploadBucketName,
            key: fileNameWithDirectory,
        });

        throw CustomError.get(ErrorType.INTERNAL_SERVER_ERROR, error);
    }

    return {
        file_path: `https://${DocumentUploadBucketName}.s3-${S3Config.aws_region}.amazonaws.com/${fileNameWithDirectory}`,
        file_name: fileName,
        bucket_name: DocumentUploadBucketName,
        key: fileNameWithDirectory,
        file_extension: fileExtension,
    };
}

export async function copyFileToCompanyAssetFolder(
    uploadedFile: UploadingFileResponseDto,
    companyIdPath: number | string,
    uuid: string,
): Promise<UploadingFileResponseDto> {
    const fileExtension = uploadedFile.file_extension;
    const sourceBucket = uploadedFile.bucket_name;
    const sourceKey = uploadedFile.key;
    const fileName = `${uuid}.${fileExtension}`;
    const fileNameWithDirectory = `${ClientAssetBasedPath}/${companyIdPath}/${fileName}`;

    await copyFile(
        sourceBucket,
        sourceKey,
        PulsifiAssetsBucketName,
        fileNameWithDirectory,
    );

    return {
        file_path: `${PulsifiConfig.pulsifi_assets_domain}/${fileNameWithDirectory}`,
        file_name: fileName,
        bucket_name: PulsifiAssetsBucketName,
        key: fileNameWithDirectory,
        file_extension: fileExtension,
    };
}
