/**
 * S3 Object tagging have limit of 10 keys per object
 * https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-tagging.html
 */

export enum TagKey {
    COMPANY_ID = 'company-id',
    IDEMPOTENCE_KEY = 'idempotence-key',
    FILE_SCAN_STATUS = 'fss-scanned',
    FILE_SCAN_RESULT = 'fss-scan-result',
    FILE_SCAN_DETAIL = 'fss-scan-detail-message',
    FILE_SCAN_DETAIL_CODE = 'fss-scan-detail-code',
    FILE_SCAN_DATE = 'fss-scan-date',
    DAXTRA_STATUS = 'daxtra-status',
    DAXTRA_ERROR_CODE = 'daxtra-error-code',
    DAXTRA_REQUEST_DATE = 'daxtra-request-date',
}
