import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

import type { CommonCDKEnvironmentVariables } from '../interfaces';
import { environment, region } from '../variables';

export const commonEnvironmentVariables = (
    scope: Construct,
): CommonCDKEnvironmentVariables => ({
    DOCUMENT_UPLOAD_BUCKET_NAME: StringParameter.valueForStringParameter(
        scope,
        '/configs/S3_DOCUMENT_UPLOAD_BUCKET',
    ),
    PULSIFI_ASSETS_BUCKET: StringParameter.valueForStringParameter(
        scope,
        '/configs/PULSIFI_ASSETS_BUCKET',
    ),
    PULSIFI_ASSETS_DOMAIN: StringParameter.valueForStringParameter(
        scope,
        '/configs/PULSIFI_ASSETS_DOMAIN',
    ),
    REGION: region,
    SENTRY_DSN:
        'https://b29c832e236344e6871fdb08212a94cd@o157451.ingest.sentry.io/5715257',

    DAXTRA_API_URL: StringParameter.valueForStringParameter(
        scope,
        '/configs/DAXTRA_API_URL',
    ),
    DAXTRA_ACCOUNT: StringParameter.valueForStringParameter(
        scope,
        '/configs/DAXTRA_ACCOUNT',
    ),
    DAXTRA_JWT_SECRET: StringParameter.valueForStringParameter(
        scope,
        '/configs/DAXTRA_JWT_SECRET',
    ),
    DAXTRA_API_TIMEOUT: '50',
    SERVERLESS_STAGE: environment,
    AWS_ALB_BASE_DNS: StringParameter.valueForStringParameter(
        scope,
        '/configs/AWS_ALB_BASE_DNS',
    ),
});
