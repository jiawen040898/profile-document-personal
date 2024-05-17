import {
    DaxtraErrorCode,
    DaxtraStatus,
    FileScanErrorCode,
    TagKey,
} from '@pulsifi/enum';
import {
    CompanyIdNotProvidedException,
    FileNameNotProvidedException,
    IdempotenceKeyNotProvidedException,
    InvalidIdempotenceKeyException,
} from '@pulsifi/exceptions';
import { Callback, Context } from 'aws-lambda';
import { readFileSync } from 'fs';
import path from 'path';

import { resumeUploadHandler } from '../../../src/functions/resumeUpload/handler';
import { CustomError, ErrorMessage } from '../../../src/lib/CustomError';
import {
    getObjectTagSet,
    getResumeRawDataFromS3,
    updateObjectTagging,
    uploadPublicItem,
} from '../../../src/lib/services/s3.service';
import { testData } from '../../fixtures/data';

jest.mock('../../../src/lib/services/s3.service', () => ({
    getObjectTagSet: jest.fn(),
    uploadPublicItem: jest.fn(),
    updateObjectTagging: jest.fn(),
    getResumeRawDataFromS3: jest.fn(),
}));

jest.useFakeTimers().setSystemTime(new Date('2023-10-03T02:34:56.000Z'));

const imageFile: Buffer = readFileSync(
    path.join(__dirname, '../../fixtures/test-png.png'),
);

const pdfFile: Buffer = readFileSync(
    path.join(__dirname, '../../fixtures/sample-pdf.pdf'),
);

describe('resumeUploadHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 status code when idempotence key is not provided', async () => {
        // Arrange
        const event = {
            ...testData.mockResumeUploadEvent,
            body: {
                company_id: 5,
                file: {
                    filename: 'test/test.pdf',
                    mimeType: 'application/pdf',
                    content: pdfFile,
                },
            },
        };

        try {
            // Act
            await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );
        } catch (error) {
            // Assert
            expect(error).toBeInstanceOf(IdempotenceKeyNotProvidedException);
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe(
                ErrorMessage.IDEMPOTENCE_KEY_NOT_PROVIDED,
            );
            expect(error).toMatchSnapshot();
        }
    });

    it('should return 400 status code when company id is not provided', async () => {
        // Arrange
        const event = {
            ...testData.mockResumeUploadEvent,
            body: {
                file: {
                    filename: 'test/test.pdf',
                    mimeType: 'application/pdf',
                    content: pdfFile,
                },
            },
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
            },
        };

        try {
            // Act
            await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );
        } catch (error) {
            // Assert
            expect(error).toBeInstanceOf(CompanyIdNotProvidedException);
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe(ErrorMessage.COMPANY_ID_NOT_PROVIDED);
            expect(error).toMatchSnapshot();
        }
    });

    describe('when file is provided in payload', () => {
        it('should return 400 status code when resume file file type is invalid', async () => {
            // Arrange
            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.png',
                        mimeType: 'image/png',
                        content: imageFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            try {
                // Act
                await resumeUploadHandler(
                    event as SafeAny,
                    {} as Context,
                    {} as Callback,
                );
            } catch (error) {
                // Assert
                expect(error).toBeInstanceOf(CustomError);
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe(
                    ErrorMessage.INVALID_UPLOAD_FILE_EXTENSION,
                );
            }
        });

        it('should return 202 when resume uploaded for the first time', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : not_ready , daxtra_status : not_ready }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : not_ready , daxtra_status : success }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.SUCCESS },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : not_ready , daxtra_status : failed }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.FAILED },
                {
                    Key: TagKey.DAXTRA_ERROR_CODE,
                    Value: DaxtraErrorCode.TIMED_OUT,
                },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : success , daxtra_status : not_ready }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                { Key: TagKey.FILE_SCAN_RESULT, Value: 'no issues found' },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : success , daxtra_status : success }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                { Key: TagKey.FILE_SCAN_RESULT, Value: 'no issues found' },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.SUCCESS },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : success , daxtra_status : failed }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                { Key: TagKey.FILE_SCAN_RESULT, Value: 'no issues found' },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.FAILED },

                {
                    Key: TagKey.DAXTRA_ERROR_CODE,
                    Value: DaxtraErrorCode.TIMED_OUT,
                },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : malicious , daxtra_status : not_ready }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                {
                    Key: TagKey.FILE_SCAN_RESULT,
                    Value: FileScanErrorCode.MALICIOUS,
                },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : malicious , daxtra_status : success }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                {
                    Key: TagKey.FILE_SCAN_RESULT,
                    Value: FileScanErrorCode.MALICIOUS,
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.SUCCESS },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : malicious , daxtra_status : failed }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                {
                    Key: TagKey.FILE_SCAN_RESULT,
                    Value: FileScanErrorCode.MALICIOUS,
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.FAILED },

                {
                    Key: TagKey.DAXTRA_ERROR_CODE,
                    Value: DaxtraErrorCode.TIMED_OUT,
                },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    company_id: 5,
                    file: {
                        filename: 'test/test.pdf',
                        mimeType: 'application/pdf',
                        content: pdfFile,
                    },
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event as SafeAny,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });
    });

    describe('when file not provided in payload', () => {
        it('should return 400 status code when resume file is not provided and file name is invalid', async () => {
            // Arrange
            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: null,
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            try {
                // Act
                await resumeUploadHandler(event, {} as Context, {} as Callback);
            } catch (error) {
                // Assert
                expect(error).toBeInstanceOf(FileNameNotProvidedException);
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe(ErrorMessage.FILE_NAME_NOT_PROVIDED);
            }
        });

        it('should return 400 status code when resume file is not provided and no resume uploaded with idempotence key provided', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            mockGetObjectTagSet.mockResolvedValueOnce([]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            try {
                // Act
                await resumeUploadHandler(event, {} as Context, {} as Callback);
            } catch (error) {
                // Assert
                expect(error).toBeInstanceOf(InvalidIdempotenceKeyException);
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe(
                    ErrorMessage.INVALID_IDEMPOTENCE_KEY,
                );
            }
        });

        it('should return 200 when { scan_status : not_ready , daxtra_status : not_ready }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : not_ready , daxtra_status : success }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.SUCCESS },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : not_ready , daxtra_status : failed }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.FAILED },

                {
                    Key: TagKey.DAXTRA_ERROR_CODE,
                    Value: DaxtraErrorCode.FAILED_TO_PARSE_RESUME,
                },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : success , daxtra_status : not_ready }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                { Key: TagKey.FILE_SCAN_RESULT, Value: 'no issues found' },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : success , daxtra_status : success }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                { Key: TagKey.FILE_SCAN_RESULT, Value: 'no issues found' },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.SUCCESS },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : success , daxtra_status : failed }', async () => {
            // Arrange
            const mockGetResumeRawDataFromS3 = jest.mocked(
                getResumeRawDataFromS3,
            );
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);

            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                { Key: TagKey.FILE_SCAN_RESULT, Value: 'no issues found' },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.FAILED },

                {
                    Key: TagKey.DAXTRA_ERROR_CODE,
                    Value: DaxtraErrorCode.FAILED_TO_PARSE_RESUME,
                },
            ]);
            mockGetResumeRawDataFromS3.mockResolvedValueOnce(
                testData.exampleDataRetrieveFromDaxtraJsonS3,
            );

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : malicious , daxtra_status : not_ready }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                {
                    Key: TagKey.FILE_SCAN_RESULT,
                    Value: FileScanErrorCode.MALICIOUS,
                },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : malicious , daxtra_status : success }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                {
                    Key: TagKey.FILE_SCAN_RESULT,
                    Value: FileScanErrorCode.MALICIOUS,
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.SUCCESS },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });

        it('should return 200 when { scan_status : malicious , daxtra_status : failed }', async () => {
            // Arrange
            const mockGetObjectTagSet = jest.mocked(getObjectTagSet);
            const mockUploadPublicItem = jest.mocked(uploadPublicItem);
            const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
            mockGetObjectTagSet.mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
                { Key: TagKey.FILE_SCAN_STATUS, Value: 'true' },
                { Key: TagKey.FILE_SCAN_DETAIL, Value: '0' },
                {
                    Key: TagKey.FILE_SCAN_RESULT,
                    Value: FileScanErrorCode.MALICIOUS,
                },
                { Key: TagKey.DAXTRA_STATUS, Value: DaxtraStatus.FAILED },

                {
                    Key: TagKey.DAXTRA_ERROR_CODE,
                    Value: DaxtraErrorCode.TIMED_OUT,
                },
            ]);

            const event = {
                ...testData.mockResumeUploadEvent,
                body: {
                    file_name: 'resume.pdf',
                },
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'idempotence-key': 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2',
                },
            };

            // Act
            const actual = await resumeUploadHandler(
                event,
                {} as Context,
                {} as Callback,
            );

            // Assert
            expect(actual).toMatchSnapshot();
            expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
            expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
            expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
        });
    });
});
