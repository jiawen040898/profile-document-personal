import {
    GetObjectTaggingCommand,
    GetObjectTaggingCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { logger } from '@pulsifi/fn';

import { CustomError, ErrorType } from '../CustomError';

const delay = () => new Promise((resolve) => setTimeout(resolve, 3000));

/**
 * Retry 4 times of s3 getObjectTagging action by delaying 3 seconds per attempt, up to 12 seconds
 * Sample Object Tags
 *  TagSet: [
 { Key: 'fss-scan-detail-code', Value: '0' },
 { Key: 'fss-scan-date', Value: '2021/11/29 10:13:12' },
 { Key: 'fss-scan-result', Value: 'no issues found' }, ** Possible value: no issues found, malicious
 { Key: 'fss-scan-detail-message', Value: '' },
 { Key: 'fss-scanned', Value: 'true' }
 ]
 https://cloudone.trendmicro.com/docs/file-storage-security/scan-tag-overview/
 * @param s3
 * @param bucket
 * @param key
 * @param retryCount
 * @returns
 */
export async function checkFileScannedResult(
    s3: S3Client,
    bucket: string,
    key: string,
    retryCount = 0,
): Promise<{ hasPassScanned: boolean; errorMessage: string } | undefined> {
    if (retryCount > 4) {
        logger.error('Failed to get file scanner tag from s3 objects', {
            data: { bucket, key },
        });
        throw CustomError.get(ErrorType.TIMED_OUT);
    }

    try {
        await delay();
        const command = new GetObjectTaggingCommand({
            Bucket: bucket,
            Key: key,
        });

        const result: GetObjectTaggingCommandOutput = await s3.send(command);

        const scannedResult = result.TagSet?.find(
            (i) => i.Key === 'fss-scanned',
        );

        if (!scannedResult) {
            throw new Error('No fss-scanned tag was found, try again');
        }

        logger.info('S3 Object Tagging', {
            data: {
                bucket,
                key,
                result,
            },
        });

        if (scannedResult && scannedResult.Value === 'true') {
            const isMaliciousFile =
                result.TagSet?.find((i) => i.Key === 'fss-scan-result')!
                    .Value === 'malicious';
            if (isMaliciousFile) {
                const failedResult = result.TagSet?.find(
                    (i) => i.Key === 'fss-scan-result',
                )?.Value;
                const failedDetailMessage = result.TagSet?.find(
                    (i) => i.Key === 'fss-scan-detail-message',
                )?.Value;

                logger.error(
                    'Fail in file scanned result due to malicious file detected.',
                    {
                        context: 'S3-getObjectTagging',
                        bucket,
                        key,
                        isMaliciousFile,
                        errorMessage: `${failedResult} - ${failedDetailMessage}`,
                    },
                );
                throw CustomError.get(ErrorType.MALICIOUS_FILE_DETECTED);
            } else {
                return {
                    hasPassScanned: true,
                    errorMessage: '',
                };
            }
        }
    } catch (e) {
        if (e instanceof CustomError) {
            throw e;
        }
        return checkFileScannedResult(s3, bucket, key, retryCount + 1);
    }
}
