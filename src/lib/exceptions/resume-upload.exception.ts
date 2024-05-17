import { ErrorDetails } from '@pulsifi/fn';

import { ErrorMessage, ErrorType } from '../CustomError';

export class IdempotenceKeyNotProvidedException extends Error {
    errorDetails: ErrorDetails;
    statusCode: number;

    constructor(errorDetails: ErrorDetails) {
        super(ErrorMessage.IDEMPOTENCE_KEY_NOT_PROVIDED);
        this.name = ErrorType.IDEMPOTENCE_KEY_NOT_PROVIDED;
        this.errorDetails = errorDetails;
        this.statusCode = 400;
    }
}

export class CompanyIdNotProvidedException extends Error {
    errorDetails: ErrorDetails;
    statusCode: number;

    constructor(errorDetails: ErrorDetails) {
        super(ErrorMessage.COMPANY_ID_NOT_PROVIDED);
        this.name = ErrorType.COMPANY_ID_NOT_PROVIDED;
        this.errorDetails = errorDetails;
        this.statusCode = 400;
    }
}

export class FileNameNotProvidedException extends Error {
    errorDetails: ErrorDetails;
    statusCode: number;

    constructor(errorDetails: ErrorDetails) {
        super(ErrorMessage.FILE_NAME_NOT_PROVIDED);
        this.name = ErrorType.INVALID_FILE_NAME;
        this.errorDetails = errorDetails;
        this.statusCode = 400;
    }
}

export class InvalidIdempotenceKeyException extends Error {
    errorDetails: ErrorDetails;
    statusCode: number;

    constructor(errorDetails: ErrorDetails) {
        super(ErrorMessage.INVALID_IDEMPOTENCE_KEY);
        this.name = ErrorType.INVALID_IDEMPOTENCE_KEY;
        this.errorDetails = errorDetails;
        this.statusCode = 400;
    }
}
