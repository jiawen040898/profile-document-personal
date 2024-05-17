const global = () => {
    process.env.TZ = 'UTC';
    process.env.REGION = 'ap-southeast-1';
    process.env.SENTRY_DSN = 'https://test.pulsifi.me/sentry';
    process.env.SERVERLESS_STAGE = 'test';
    process.env.AWS_SESSION_TOKEN = 'the-token';

    process.env.DAXTRA_API_URL = 'https://cvxdemo.daxtra.com/cvx/rest/api/v1';
    process.env.DAXTRA_ACCOUNT = 'API_TEST';
    process.env.DAXTRA_JWT_SECRET = '';
    process.env.DAXTRA_API_TIMEOUT = '50';

    process.env.AWS_ALB_BASE_DNS = 'https://fake.url.com';
    process.env.FILE_SCANNER_ENABLED = 'true';
    process.env.PULSIFI_ASSETS_DOMAIN = 'https://sandbox-assets.pulsifi.me';

    process.env.DOCUMENT_UPLOAD_BUCKET_NAME = 'pulsifi-sandbox-document-upload';
    process.env.PULSIFI_ASSETS_BUCKET = 'pulsifi-sandbox-assets';
    process.env.AWS_REGION = 'ap-southeast-1';

    process.env.UNLEASH_API_KEY =
        'default:development.58a58ec16b64df5c7a2a62fc7e063fb548d2476a6cb452cff85f5d03';
    process.env.UNLEASH_API_URL =
        'https://us.app.unleash-hosted.com/usab1009/api/';
    process.env.UNLEASH_ENV = 'sandbox';
    process.env.UNLEASH_PROJECT_ID = 'default';
};

export default global;
