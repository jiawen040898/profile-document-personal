import { ErrorDetails } from '@pulsifi/fn';

import { ErrorMessage, ErrorType } from '../CustomError';

export class FailedToProcessCandidateResumeException extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(ErrorMessage.FAILED_TO_PROCESS_CANDIDATE_RESUME);
        this.name = ErrorType.FAILED_TO_PROCESS_CANDIDATE_RESUME;
        this.errorDetails = errorDetails;
    }
}
