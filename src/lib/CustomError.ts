import { ErrorDetails } from '@pulsifi/fn';

export enum ErrorType {
    INTERNAL_SERVER_ERROR = 'InternalServerError',
    INVALID_CONVERT_FILE_EXTENSION = 'InvalidConvertFileExtension',
    INVALID_UPLOAD_FILE_EXTENSION = 'InvalidUploadFileExtension',
    INVALID_UPLOAD_RESUME_EXTENSION = 'InvalidUploadResumeExtension',
    INVALID_CONVERT_FILE_INPUT = 'INVALID_CONVERT_FILE_INPUT',
    INVALID_UPLOAD_INPUT = 'InvalidUploadFileInput',
    PDF_FILE_FOUND = 'PdfFileWasFound',
    INVALID_RESUME = 'InvalidResume',
    MALICIOUS_FILE_DETECTED = 'MaliciousFileDetected',
    TIMED_OUT = 'TimedOut',
    INVALID_FILE_PURPOSE = 'InvalidFilePurpose',
    IDEMPOTENCE_KEY_NOT_PROVIDED = 'IdempotenceKeyNotProvided',
    COMPANY_ID_NOT_PROVIDED = 'CompanyIdNotProvided',
    INVALID_IDEMPOTENCE_KEY = 'InvalidIdempotenceKey',
    INVALID_FILE_NAME = 'InvalidFileName',
    FAILED_TO_PROCESS_CANDIDATE_RESUME = 'FailedToProcessCandidateResume',
}

export enum ErrorMessage {
    INTERNAL_SERVER_ERROR = 'Something went wrong, please contact support.',
    INVALID_CONVERT_FILE_EXTENSION = 'File type to be convert must be either .doc and docx only',
    INVALID_UPLOAD_FILE_EXTENSION = 'File type upload is not supported by the system',
    INVALID_UPLOAD_RESUME_EXTENSION = 'File type of resume must be either .doc, .docx or .pdf',
    INVALID_CONVERT_FILE_INPUT = 'S3 Bucket name and Object Key must have value',
    INVALID_UPLOAD_INPUT = 'File purpose must be either resume or attachment together with valid file content',
    PDF_FILE_FOUND = 'Pdf document was found. Nothing to convert',
    INVALID_RESUME = `We couldn't process your resume due to invalid content. Please submit another resume or a different file format.`,
    MALICIOUS_FILE_DETECTED = 'Malicious file detected. Please submit another file',
    TIMED_OUT = 'Request took longer than expected.',
    INVALID_FILE_PURPOSE = 'This endpoint does not support current FilePurpose',
    IDEMPOTENCE_KEY_NOT_PROVIDED = 'Please provide a unique idempotence key for this resume upload.',
    COMPANY_ID_NOT_PROVIDED = 'Please provide company id for this upload.',
    INVALID_IDEMPOTENCE_KEY = 'No resume uploaded with this idempotence key.',
    FILE_NAME_NOT_PROVIDED = 'Please provide the uploaded file name to check status of this upload.',
    FAILED_TO_PROCESS_CANDIDATE_RESUME = 'Failed to process candidate resume',
}

export enum ErrorCode {
    IDEMPOTENCE_KEY_NOT_PROVIDED = 'idempotence_key_not_provided',
    COMPANY_ID_NOT_PROVIDED = 'company_id_not_provided',
    INVALID_IDEMPOTENCE_KEY = 'invalid_idempotence_key',
    INVALID_FILE_NAME = 'invalid_file_name',
    FAILED_TO_PROCESS_CANDIDATE_RESUME = 'failed_to_process_candidate_resume',
}

export const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_REQUEST_TIMEOUT = 408;
const HTTP_STATUS_INTERNAL_ERROR = 500;
export class CustomError extends Error {
    name: string;
    statusCode: number;
    errorDetails?: ErrorDetails;

    constructor(
        message: string | SafeAny,
        name = 'Unknown Error',
        error?: Error,
        statusCode = 400,
    ) {
        if (typeof message === 'object') {
            message = JSON.stringify(message, null, 2);
        }
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.stack = error?.stack;
    }

    static get(errorType: ErrorType, error?: Error): CustomError {
        let httpStatusCode = HTTP_STATUS_BAD_REQUEST;
        let errorMessage = ErrorMessage.INTERNAL_SERVER_ERROR;
        switch (errorType) {
            case ErrorType.INVALID_CONVERT_FILE_EXTENSION:
                errorMessage = ErrorMessage.INVALID_CONVERT_FILE_EXTENSION;
                break;
            case ErrorType.PDF_FILE_FOUND:
                errorMessage = ErrorMessage.PDF_FILE_FOUND;
                break;
            case ErrorType.INVALID_RESUME:
                errorMessage = ErrorMessage.INVALID_RESUME;
                break;
            case ErrorType.INVALID_UPLOAD_FILE_EXTENSION:
                errorMessage = ErrorMessage.INVALID_UPLOAD_FILE_EXTENSION;
                break;
            case ErrorType.INVALID_UPLOAD_RESUME_EXTENSION:
                errorMessage = ErrorMessage.INVALID_UPLOAD_RESUME_EXTENSION;
                break;
            case ErrorType.INVALID_UPLOAD_INPUT:
                errorMessage = ErrorMessage.INVALID_UPLOAD_INPUT;
                break;
            case ErrorType.INVALID_CONVERT_FILE_INPUT:
                errorMessage = ErrorMessage.INVALID_CONVERT_FILE_INPUT;
                break;
            case ErrorType.MALICIOUS_FILE_DETECTED:
                errorMessage = ErrorMessage.MALICIOUS_FILE_DETECTED;
                break;
            case ErrorType.INVALID_FILE_PURPOSE:
                errorMessage = ErrorMessage.INVALID_FILE_PURPOSE;
                break;
            case ErrorType.INTERNAL_SERVER_ERROR:
                errorMessage = ErrorMessage.INTERNAL_SERVER_ERROR;
                httpStatusCode = HTTP_STATUS_INTERNAL_ERROR;
                break;
            case ErrorType.TIMED_OUT:
                errorMessage = ErrorMessage.TIMED_OUT;
                httpStatusCode = HTTP_STATUS_REQUEST_TIMEOUT;
                break;
        }

        return new CustomError(errorMessage, errorType, error, httpStatusCode);
    }
}
