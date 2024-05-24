export type CommonCDKEnvironmentVariables = {
    DOCUMENT_UPLOAD_BUCKET_NAME: string;
    PULSIFI_ASSETS_BUCKET: string;
    PULSIFI_ASSETS_DOMAIN: string;
    REGION: string;
    SENTRY_DSN: string;
    DAXTRA_API_URL: string;
    DAXTRA_ACCOUNT: string;
    DAXTRA_JWT_SECRET: string;
    DAXTRA_API_TIMEOUT: string;
    SERVERLESS_STAGE: string;
    AWS_ALB_BASE_DNS: string;
};

export type CDKEnvironmentVariables = {
    FILE_SCANNER_ENABLED: string;
};

export type ProfileDocumentResumeParserFnConfig = {
    UNLEASH_API_KEY: string;
    UNLEASH_API_URL: string;
    UNLEASH_ENV: string;
    UNLEASH_PROJECT_ID: string;
};
