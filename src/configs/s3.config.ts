import { envUtil } from '@pulsifi/fn';

export const S3Config = {
    bucket_name:
        envUtil.get('DOCUMENT_UPLOAD_BUCKET_NAME') ??
        'pulsifi-sandbox-document-upload',
    assets_bucket_name:
        envUtil.get('PULSIFI_ASSETS_BUCKET') ?? 'pulsifi-sandbox-assets',
    aws_region: envUtil.get('AWS_REGION') ?? 'ap-southeast-1',
};
