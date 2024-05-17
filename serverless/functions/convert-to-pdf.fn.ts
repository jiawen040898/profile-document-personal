import { AwsFunctionHandler } from 'serverless/aws';

import { tags, version, WarmUpFunctionHandler } from './variables';

export const convertToPdf: AwsFunctionHandler & WarmUpFunctionHandler = {
    name: 'profile-document-convert-to-pdf-fn',
    description: `Listen to s3 Bucket Document create event, convert to PDF and save back to save bucket. (v${version})`,
    warmup: {
        default: {
            enabled: false,
        },
    },
    handler: 'src/functions/convertToPdf/handler.handler',
    environment: {
        SLS_FUNCTION_SERVICE_NAME: 'profile-document-convert-to-pdf-fn',
    },
    events: [
        {
            s3: {
                bucket: '${ssm:/profile-document-fn/S3_DOCUMENT_BUCKET}',
                event: 's3:ObjectCreated:*',
                rules: [
                    {
                        prefix: 'candidates',
                    },
                    {
                        suffix: 'resume.doc',
                    },
                ],
                existing: true,
            },
        },
        {
            s3: {
                bucket: '${ssm:/profile-document-fn/S3_DOCUMENT_BUCKET}',
                event: 's3:ObjectCreated:*',
                rules: [
                    {
                        prefix: 'candidates',
                    },
                    {
                        suffix: 'resume.docx',
                    },
                ],
                existing: true,
            },
        },
    ],
    tags,
};
