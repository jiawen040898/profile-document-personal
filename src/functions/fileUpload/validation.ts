import {
    FileExtension,
    FilePurpose,
    ResumeFileExtensions,
} from '@pulsifi/enum';
import { logger } from '@pulsifi/fn';
import { File } from '@pulsifi/interfaces';

import { CustomError, ErrorType } from '../../lib/CustomError';

export function validateFile(filePurpose: FilePurpose, file: File): void {
    const matches = /(?:\.([^.]+))?$/.exec(file.filename);
    const fileExtension = `.${matches![1]}`.toLowerCase();

    logger.info('file extension: ', {
        matches,
        file_purpose: filePurpose,
        filename: file.filename,
        fileExtension,
    });

    if (
        !file ||
        !Object.values(FilePurpose).includes(filePurpose) ||
        !file.content
    ) {
        throw CustomError.get(ErrorType.INVALID_UPLOAD_INPUT);
    }

    if (
        filePurpose === FilePurpose.RESUME &&
        !Object.values(ResumeFileExtensions).includes(fileExtension)
    ) {
        throw CustomError.get(ErrorType.INVALID_UPLOAD_FILE_EXTENSION);
    }

    if (
        filePurpose === FilePurpose.ATTACHMENT &&
        !Object.values(FileExtension).includes(fileExtension as FileExtension)
    ) {
        throw CustomError.get(ErrorType.INVALID_UPLOAD_FILE_EXTENSION);
    }
}
