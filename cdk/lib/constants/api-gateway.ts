/* eslint-disable @typescript-eslint/naming-convention */
import {
    type LambdaIntegrationOptions,
    type MethodOptions,
    Model,
} from 'aws-cdk-lib/aws-apigateway';

import type { CustomCorsOptions } from '../base';

const commonCors: CustomCorsOptions = {
    allowOrigins: ['*'],
    allowHeaders: [
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
    allowMethods: ['OPTIONS', 'POST'],
    statusCode: 200,
    allowCredentials: false,
};

const fileUploadCors: CustomCorsOptions = {
    ...commonCors,
    allowHeaders: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
        'X-Pulsifi-Token',
        'X-Locale',
    ],
    responseModels: {
        'application/json': Model.EMPTY_MODEL,
    },
};

const fileUploadMethodOptions: MethodOptions = {
    requestParameters: {
        'method.request.path.proxy': true,
        'method.request.header.Accept-Encoding': true,
        'method.request.header.Content-Type': true,
        'method.request.header.X-Pulsifi-Token': false,
    },
    methodResponses: [
        {
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Origin': true,
            },
        },
    ],
};

const fileUploadLambdaIntegrationOptions: LambdaIntegrationOptions = {
    requestParameters: {
        'integration.request.header.Accept-Encoding': "'identity'",
        'integration.request.header.Content-Type':
            'method.request.header.Content-Type',
        'integration.request.header.requestId': 'context.requestId',
    },
};

const resumeUploadIntegrationResponseTemplate: {
    [contentType: string]: string;
} = {
    'application/json': `#set($origin = $input.params("Origin"))\n#if($origin == "") #set($origin = $input.params("origin")) #end\n#if($origin.matches(".+")) #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin) #end`,
};

export const apiGatewayConfig = {
    commonCors,
    fileUploadCors,
    fileUploadMethodOptions,
    fileUploadLambdaIntegrationOptions,
    resumeUploadIntegrationResponseTemplate,
};
