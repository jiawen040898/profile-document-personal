/* eslint-disable @typescript-eslint/naming-convention */
import { custom } from './custom';
import { functions } from './functions';
import { plugins } from './plugins';
import { importValue } from './utils';
import { nodejsVersion } from './variables';

export const main = {
    service: 'profile-document-fn',
    frameworkVersion: '3',
    useDotenv: true,
    configValidationMode: 'warn',
    package: {
        individually: true,
    },
    provider: {
        name: 'aws',
        runtime: nodejsVersion,
        versionFunctions: true,
        stackName: 'profile-document-fn-${opt:stage}-stack',
        region: '${opt:region}',
        memorySize: 256,
        timeout: 60,
        apiGateway: {
            restApiId: importValue('apiGateway-restApiId'),
            restApiRootResourceId: importValue('apiGateway-rootResourceId'),
            restApiResources: {
                '/document': importValue('apiGateway-documentParentResourceId'),
                '/document/v1.0': importValue(
                    'apiGateway-documentV1ResourceId',
                ),
                '/document/v1.0/files': importValue(
                    'apiGateway-documentV1FilesResourceId',
                ),
            },
            binaryMediaTypes: ['multipart/form-data'],
        },
        environment: {
            DOCUMENT_UPLOAD_BUCKET_NAME:
                '${ssm:/profile-document-fn/S3_DOCUMENT_UPLOAD_BUCKET}',
            PULSIFI_ASSETS_BUCKET: '${ssm:/configs/PULSIFI_ASSETS_BUCKET}',
            PULSIFI_ASSETS_DOMAIN: '${ssm:/configs/PULSIFI_ASSETS_DOMAIN}',
            REGION: '${opt:region}',
            SENTRY_DSN:
                'https://b29c832e236344e6871fdb08212a94cd@o157451.ingest.sentry.io/5715257',
            DAXTRA_API_URL: '${ssm:/configs/DAXTRA_API_URL}',
            DAXTRA_ACCOUNT: '${ssm:/configs/DAXTRA_ACCOUNT}',
            DAXTRA_JWT_SECRET: '${ssm:/configs/DAXTRA_JWT_SECRET}',
            DAXTRA_API_TIMEOUT: '50',
            SERVERLESS_STAGE: '${opt:stage}',
            AWS_ALB_BASE_DNS: '${ssm:/profile-document-fn/ALB_URL}',
            FILE_SCANNER_ENABLED:
                '${ssm:/profile-document-fn/FILE_SCANNER_ENABLED}',
        },
        logRetentionInDays: '${ssm:/configs/LOG_RETENTION_IN_DAYS}',
        iam: {
            role: 'arn:aws:iam::${aws:accountId}:role/profile-document-lambda-role',
        },
        stackTags: {
            Environment: '${opt:stage}',
            Owner: 'dev-team@pulsifi.me',
            Version: '${env:TAG_VERSION}',
        },
        deploymentBucket: {
            blockPublicAccess: true,
            name: 'profile-document-fn-${opt:stage}-${opt:region}-stack-bucket-1',
            maxPreviousDeploymentArtifacts: 5,
            serverSideEncryption: 'AES256',
        },
    },
    resources: {
        extensions: {
            CandidateFileUploadLogGroup: {
                DeletionPolicy: 'Retain',
            },
            DocumentUploadLogGroup: {
                DeletionPolicy: 'Retain',
            },
            ConvertToPdfLogGroup: {
                DeletionPolicy: 'Retain',
            },
            ResumeUploadLogGroup: {
                DeletionPolicy: 'Retain',
            },
            ResumeParserLogGroup: {
                DeletionPolicy: 'Retain',
            },
        },
    },
    plugins,
    custom,
    functions,
};

export default main;
