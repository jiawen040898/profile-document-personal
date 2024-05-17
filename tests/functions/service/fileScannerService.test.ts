import { GetObjectTaggingCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';

import { checkFileScannedResult } from '../../../src/lib/services/fileScanner.service';

const s3ClientMock = mockClient(S3Client);

describe('FileScannerService', () => {
    let s3: S3Client;

    beforeAll(() => {
        s3 = new S3Client({});
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should pass file scanner', async () => {
        // Arrange
        s3ClientMock.on(GetObjectTaggingCommand).resolves({
            TagSet: [
                { Key: 'fss-scanned', Value: 'true' },
                { Key: 'fss-scan-detail-code', Value: '0' },
                { Key: 'fss-scan-result', Value: 'no issues found' },
            ],
        });

        // Act
        const result = await checkFileScannedResult(s3, 'bucketA', 'keyA');

        // Assert
        expect(result?.hasPassScanned).toEqual(true);
    }, 10000);

    it('should fail file scanner', async () => {
        // Arrange
        s3ClientMock.on(GetObjectTaggingCommand).resolves({
            TagSet: [
                { Key: 'fss-scanned', Value: 'true' },
                { Key: 'fss-scan-detail-code', Value: '0' },
                { Key: 'fss-scan-result', Value: 'malicious' },
            ],
        });

        // Act
        const action = async () => {
            await checkFileScannedResult(s3, 'bucketA', 'keyA');
        };

        // Assert
        await expect(action()).rejects.toThrow(Error);
    }, 10000);
});
