import {
    CompleteMultipartUploadCommandOutput,
    CopyObjectCommand,
    CopyObjectCommandInput,
    GetObjectCommand,
    GetObjectCommandOutput,
    GetObjectTaggingCommand,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectTaggingCommand,
    S3Client,
    Tag,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PulsifiConfig, S3Config } from '@pulsifi/configs';
import { logger } from '@pulsifi/fn';
import { Resume } from '@pulsifi/interfaces';
import { AxiosResponse } from 'axios';
import { PassThrough, Readable } from 'stream';

import { checkFileScannedResult } from '.';

const s3 = new S3Client({ region: S3Config.aws_region });

export async function uploadPublicItem(
    bucket: string,
    key: string,
    body: Buffer,
    mimeType: string,
    shouldCheckFileScannedResult: boolean,
): Promise<void> {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
        ACL: 'public-read',
    });

    await s3.send(command);

    if (PulsifiConfig.has_file_scanner_enable && shouldCheckFileScannedResult) {
        await checkFileScannedResult(s3, bucket, key);
    }
}

export async function uploadPublicItemWithTag(
    bucket: string,
    key: string,
    body: Buffer,
    mimeType: string,
    tag: string,
): Promise<void> {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
        ACL: 'public-read',
        Tagging: tag,
    });

    await s3.send(command);
}

export async function updateObjectTagging(
    bucket: string,
    key: string,
    tags: Tag[],
): Promise<void> {
    const command = new PutObjectTaggingCommand({
        Bucket: bucket,
        Key: key,
        Tagging: {
            TagSet: tags,
        },
    });

    await s3.send(command);
}

export async function getObjectTagSet(
    bucket: string,
    key: string,
): Promise<Tag[]> {
    const command = new GetObjectTaggingCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const data = await s3.send(command);

        return data.TagSet ?? [];
    } catch (error) {
        logger.error('Unable to get object tag set', { data: error });
        return [];
    }
}

export async function getItemInStream(
    bucket: string,
    key: string,
): Promise<Readable> {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const data: GetObjectCommandOutput = await s3.send(command);

    return data.Body as Readable;
}

export async function getResumeRawDataFromS3(
    bucket: string,
    key: string,
): Promise<Resume> {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const response = await s3.send(command);
        const fileResult = await streamToString(response.Body);

        return JSON.parse(fileResult);
    } catch (error) {
        logger.error('Unable to get resume raw data', { data: error });
        throw error;
    }
}

export async function getFileAsBufferFromS3(
    bucket: string,
    key: string,
): Promise<Buffer> {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const response = await s3.send(command);
        return await streamToBuffer(response.Body);
    } catch (error) {
        logger.error('Unable to get file as buffer', { data: error });
        throw error;
    }
}

/**
 * Upload File Stream
 * Reference: https://github.com/vikasgarghb/file-stream-lambda/blob/master/src/handlers/copyFileHandler.ts
 * @param {AxiosResponse} fileResponse
 * @param {string} fileName
 * @param {string} bucket
 * @param {string} contentType
 */
export function uploadFromStream(
    fileResponse: AxiosResponse,
    fileName: string,
    bucket: string,
    contentType: string,
): {
    passThrough: PassThrough;
    promise: Promise<CompleteMultipartUploadCommandOutput>;
} {
    const passThrough = new PassThrough();

    const target: PutObjectCommandInput = {
        Bucket: bucket,
        Key: fileName,
        Body: passThrough,
        ContentType: contentType,
    };

    const upload = new Upload({
        client: s3,
        params: target,
    });

    const promise = upload.done();

    return { passThrough, promise };
}

export async function copyFile(
    sourceBucket: string,
    sourceKey: string,
    destinationBucket: string,
    destinationKey: string,
): Promise<void> {
    const params: CopyObjectCommandInput = {
        Bucket: destinationBucket,
        CopySource: encodeURIComponent(`/${sourceBucket}/${sourceKey}`),
        Key: destinationKey,
    };

    try {
        const command = new CopyObjectCommand(params);
        await s3.send(command);

        logger.info('File copied successfully', { data: params });
    } catch (error) {
        logger.error('Fail to copied file', { data: params, error });
        throw error;
    }
}

const streamToString = (stream: SafeAny): Promise<string> =>
    new Promise((resolve, reject) => {
        const chunks: SafeAny = [];
        stream.on('data', (chunk: SafeAny) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });

const streamToBuffer = (stream: SafeAny): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const chunks: SafeAny = [];
        stream.on('data', (chunk: SafeAny) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
