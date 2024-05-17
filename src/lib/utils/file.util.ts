import { FileContentType, mapFileExtensionToContentType } from '@pulsifi/enum';
import { File } from '@pulsifi/interfaces';

const getMimeType = (file: File): string => {
    /*
     * Determine the MIME type of file:
     * - If the file's MIME type is 'application/octet-stream' or undefined, it means the file type is unknown.
     * - In this case, we try to determine the MIME type from the file name.
     * - If the file's MIME type is known, we simply return it.
     */

    return file.mimeType &&
        file.mimeType !== FileContentType.APPLICATION_OCTET_STREAM
        ? file.mimeType
        : getMimeTypeFromFileName(file.filename);
};

const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop() ?? '';
};

const getMimeTypeFromFileName = (fileName: string): string => {
    const fileExtension = `.${getFileExtension(fileName)}`;

    return (
        mapFileExtensionToContentType[fileExtension] ??
        FileContentType.APPLICATION_OCTET_STREAM
    );
};

export const FileUtil = {
    getMimeType,
    getFileExtension,
    getMimeTypeFromFileName,
};
