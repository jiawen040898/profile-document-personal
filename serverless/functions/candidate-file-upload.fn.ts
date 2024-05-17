/* eslint-disable @typescript-eslint/naming-convention */
import { AwsFunctionHandler } from 'serverless/aws';

import { importValue } from '../utils';
import { tags, version, WarmUpFunctionHandler } from './variables';

export const candidateFileUpload: AwsFunctionHandler & WarmUpFunctionHandler = {
    name: 'profile-document-candidate-file-upload-fn',
    description: `Handling attachment and resume upload, parsing resume data and save them into holding buckets. (v${version})`,
    warmup: {
        default: {
            enabled: true,
        },
    },
    handler: 'src/functions/fileUpload/handler.handler',
    environment: {
        SLS_FUNCTION_SERVICE_NAME: 'profile-document-upload-fn',
    },
    events: [
        {
            http: {
                method: 'POST',
                path: '/document/v1.0/file_upload',
                authorizer: {
                    type: 'CUSTOM',
                    authorizerId: importValue(
                        'apiGateway-standardAuthorizerResourceId',
                    ),
                } as SafeAny,
                cors: {
                    origins: '*',
                    headers: [
                        'Content-Type',
                        'X-Amz-Date',
                        'Authorization',
                        'X-Api-Key',
                        'X-Amz-Security-Token',
                        'X-Amz-User-Agent',
                        'Startlower',
                        'Text',
                        'Access-Control-Allow-Headers',
                        'Access-Control-Allow-Origin',
                    ],
                    allowCredentials: false,
                },
            },
        },
        {
            http: {
                method: 'POST',
                path: '/document/public/file_upload',
                cors: {
                    origins: '*',
                    headers: [
                        'Content-Type',
                        'X-Amz-Date',
                        'Authorization',
                        'X-Api-Key',
                        'X-Amz-Security-Token',
                        'X-Amz-User-Agent',
                        'Startlower',
                        'Text',
                        'Access-Control-Allow-Headers',
                        'Access-Control-Allow-Origin',
                    ],
                    allowCredentials: false,
                },
            },
        },
    ],
    tags,
};
