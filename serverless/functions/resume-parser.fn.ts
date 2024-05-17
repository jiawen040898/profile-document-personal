/* eslint-disable @typescript-eslint/naming-convention */
import { AwsFunctionHandler } from 'serverless/aws';

import { tags, version, WarmUpFunctionHandler } from './variables';

export const resumeParser: AwsFunctionHandler & WarmUpFunctionHandler = {
    name: 'profile-document-resume-parser-fn',
    description: `Listen to s3 object tagging event, send to daxtra for parsing, save daxtra result into holding buckets. (v${version})`,
    warmup: {
        default: {
            enabled: false,
        },
    },
    handler: 'src/functions/resumeParser/handler.handler',
    environment: {
        SLS_FUNCTION_SERVICE_NAME: 'profile-document-upload-fn',
        UNLEASH_API_KEY: '${ssm:/configs/UNLEASH_API_KEY}',
        UNLEASH_API_URL: '${ssm:/configs/UNLEASH_API_URL}',
        UNLEASH_ENV: '${ssm:/configs/UNLEASH_ENV}',
        UNLEASH_PROJECT_ID: '${ssm:/configs/UNLEASH_PROJECT_ID}',
    },
    events: [
        {
            s3: {
                bucket: '${ssm:/profile-document-fn/S3_DOCUMENT_UPLOAD_BUCKET}',
                event: 's3:ObjectTagging:*',
                rules: [
                    {
                        prefix: 'candidate',
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
                bucket: '${ssm:/profile-document-fn/S3_DOCUMENT_UPLOAD_BUCKET}',
                event: 's3:ObjectTagging:*',
                rules: [
                    {
                        prefix: 'candidate',
                    },
                    {
                        suffix: 'resume.docx',
                    },
                ],
                existing: true,
            },
        },
        {
            s3: {
                bucket: '${ssm:/profile-document-fn/S3_DOCUMENT_UPLOAD_BUCKET}',
                event: 's3:ObjectTagging:*',
                rules: [
                    {
                        prefix: 'candidate',
                    },
                    {
                        suffix: 'resume.pdf',
                    },
                ],
                existing: true,
            },
        },
    ],
    tags,
};
