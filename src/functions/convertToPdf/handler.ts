import { FileContentType } from '@pulsifi/enum';
import { logger } from '@pulsifi/fn';
import {
    getItemInStream,
    parseToPdf,
    uploadFromStream,
} from '@pulsifi/services';
import { Context, S3Event } from 'aws-lambda';

import { eventMiddleware } from '../../lib/commonMiddleware';
import { CustomError, ErrorType } from '../../lib/CustomError';

const convertToPdfExtension = (filePath: string) =>
    filePath.split('.').slice(0, -1).join('.') + '.pdf';

/**
 *
 * @param {string} filePath file path with .doc,.docx extension
 * @returns {string} file path with pdf extension
 */
export const validateFileExtension = (filePath: string): string => {
    const fileExtension = filePath.split('.').pop()!;

    if (fileExtension.toLowerCase() === 'pdf') {
        throw CustomError.get(ErrorType.PDF_FILE_FOUND);
    }

    if (
        !(
            fileExtension.toLowerCase() === 'docx' ||
            fileExtension.toLowerCase() === 'doc'
        )
    ) {
        throw CustomError.get(ErrorType.INVALID_CONVERT_FILE_EXTENSION);
    }

    return convertToPdfExtension(filePath);
};

const convertToPdfHandler = async (event: S3Event, context: Context) => {
    const { s3 } = event.Records[0];

    context.callbackWaitsForEmptyEventLoop = true;
    let sourceFile = null;

    const sourceBucket = s3?.bucket?.name;
    const sourceKey = s3?.object?.key;

    if (!(sourceBucket && sourceKey)) {
        throw CustomError.get(ErrorType.INVALID_CONVERT_FILE_INPUT);
    }

    const destinationKey = validateFileExtension(sourceKey);

    try {
        sourceFile = await getItemInStream(sourceBucket, sourceKey);
    } catch (error) {
        throw CustomError.get(ErrorType.INTERNAL_SERVER_ERROR, error);
    }

    const responseStream = await parseToPdf(sourceFile, {
        sourceBucket,
        sourceKey,
    });

    const { passThrough, promise } = uploadFromStream(
        responseStream,
        destinationKey,
        sourceBucket,
        FileContentType.PDF,
    );

    responseStream.data.pipe(passThrough);

    return promise
        .then((result) => {
            logger.info('Successful convert file to PDF', {
                data: {
                    sourceBucket,
                    destinationKey,
                },
            });
            return result.Location;
        })
        .catch((error) => {
            throw CustomError.get(ErrorType.INTERNAL_SERVER_ERROR, error);
        });
};

export const handler = eventMiddleware(convertToPdfHandler);
