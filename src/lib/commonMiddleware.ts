import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import s3KeyNormalizer from '@middy/s3-key-normalizer';
import warmup from '@middy/warmup';
import { envUtil, initSentryMiddleware, loggerMiddleware } from '@pulsifi/fn';
import * as Sentry from '@sentry/serverless';
import { APIGatewayProxyEvent, Handler, S3NotificationEvent } from 'aws-lambda';

import { version } from '../../package.json';
import { CustomError, HTTP_STATUS_BAD_REQUEST } from './CustomError';

if (envUtil.get('SERVERLESS_STAGE') !== 'test') {
    initSentryMiddleware(version);
}

const handlingHttpErrorMiddleware = (): middy.MiddlewareObj<
    APIGatewayProxyEvent | S3NotificationEvent
> => ({
    onError: async (handler) => {
        const error = handler.error as CustomError;

        handler.response = {
            statusCode: error.statusCode ?? HTTP_STATUS_BAD_REQUEST,
            body: JSON.stringify(
                {
                    data: null,
                    meta: {
                        type: error.name,
                        message: error.message,
                        error_details: error.errorDetails ?? {},
                    },
                },
                null,
                2,
            ),
        };
    },
});

export const httpMiddleware = (handler: Handler) =>
    Sentry.AWSLambda.wrapHandler(
        middy(handler).use([
            warmup(),
            httpHeaderNormalizer(),
            httpMultipartBodyParser(),
            httpJsonBodyParser(),
            httpEventNormalizer(),
            cors(),
            loggerMiddleware(),
            handlingHttpErrorMiddleware(),
        ]),
    );

export const eventMiddleware = (handler: Handler) =>
    Sentry.AWSLambda.wrapHandler(
        middy(handler).use([s3KeyNormalizer(), loggerMiddleware()]),
    );
