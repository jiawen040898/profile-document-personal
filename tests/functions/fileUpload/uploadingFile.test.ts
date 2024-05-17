import { readFileSync } from 'fs';
import path from 'path';
import * as UUID from 'uuid';

import {
    copyFileToCompanyAssetFolder,
    uploadingFile,
} from '../../../src/functions/fileUpload/uploadingFile';
import { CustomError } from '../../../src/lib/CustomError';
import * as S3Service from '../../../src/lib/services/s3.service';
import { testData } from '../../fixtures/data';

process.env.DOCUMENT_UPLOAD_BUCKET_NAME = 'Test_Bucket_Name_Placeholder';

const mockUploadPublicItem = jest
    .spyOn(S3Service, 'uploadPublicItem')
    .mockImplementation(
        async (
            bucket: string,
            key: string,
            body: Buffer,
            mimeType: string,
        ): Promise<void> => {
            if (bucket && key && body && mimeType) {
                return;
            }
            throw new CustomError('Value Missing');
        },
    );

const mockCopyFile = jest
    .spyOn(S3Service, 'copyFile')
    .mockImplementation(jest.fn());

jest.mock('uuid');
jest.spyOn(UUID, 'v4').mockReturnValue('1cba0aac-0b97-4aaa-a8dd-030913154f04');

const content: Buffer = readFileSync(
    path.join(__dirname, '../../fixtures/test-png.png'),
);

describe('uploadingFile', () => {
    afterEach(() => {
        mockUploadPublicItem.mockClear();
    });

    it('should be able to output and object contain file_path', async () => {
        // Act
        const result = await uploadingFile(
            {
                filename: 'test/test.png',
                mimeType: 'image/png',
                content: content,
            },
            true,
            'file_b',
        );

        // Assert
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();

        expect(result).toMatchSnapshot();
    });
});

describe('copyFileToCompanyAssetFolder', () => {
    afterEach(() => {
        mockCopyFile.mockClear();
    });

    it('should be able to output and object contain file_path', async () => {
        // Act
        const result = await copyFileToCompanyAssetFolder(
            testData.fileUploadOutput,
            10,
            '1cba0aac-0b97-4aaa-a8dd-030913154f04',
        );

        // Assert
        expect(mockCopyFile).toHaveBeenCalledTimes(1);
        expect(mockCopyFile).toBeCalledWith(
            'pulsifi-sandbox-document-upload',
            'candidate/file_b/document.png',
            'pulsifi-sandbox-assets',
            'client/10/1cba0aac-0b97-4aaa-a8dd-030913154f04.png',
        );
        expect(result).toMatchSnapshot();
    });
});
