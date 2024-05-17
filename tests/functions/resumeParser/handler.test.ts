import { TagKey } from '@pulsifi/enum';
import { FeatureToggleService } from '@pulsifi/services';
import axios from 'axios';
import { readFileSync } from 'fs';
import path from 'path';

import { resumeParserHandler } from '../../../src/functions/resumeParser/handler';
import {
    getObjectTagSet,
    updateObjectTagging,
    uploadPublicItem,
} from '../../../src/lib/services/s3.service';
import { testData } from '../../fixtures/data';

const pdfFile: Buffer = readFileSync(
    path.join(__dirname, '../../fixtures/sample-pdf.pdf'),
);
const mockFeatureToggleService = jest.fn();
const featureToggleService = FeatureToggleService;
featureToggleService.isUnleashFlagEnabled = mockFeatureToggleService;

jest.mock('axios');
jest.mock('../../../src/lib/services/s3.service', () => ({
    getObjectTagSet: jest.fn(),
    updateObjectTagging: jest.fn(),
    uploadPublicItem: jest.fn(),
    getFileAsBufferFromS3: jest.fn().mockImplementation(() => pdfFile),
}));
jest.useFakeTimers().setSystemTime(new Date('2023-10-03T02:34:56.000Z'));

describe('resumeParserHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not process if object set is empty', async () => {
        // Arrange
        mockFeatureToggleService.mockResolvedValue(false);
        const mockUploadPublicItem = jest.mocked(uploadPublicItem);
        const mockGetObjectTagSet = jest
            .mocked(getObjectTagSet)
            .mockResolvedValueOnce([]);

        // Act
        await resumeParserHandler(testData.mockResumeUploadS3Event);

        // Assert
        expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
    });

    it('should not process if object doesnt have company id', async () => {
        // Arrange
        mockFeatureToggleService.mockResolvedValue(false);
        const mockUploadPublicItem = jest.mocked(uploadPublicItem);
        const mockGetObjectTagSet = jest
            .mocked(getObjectTagSet)
            .mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2_3592404140',
                },
            ]);

        // Act
        await resumeParserHandler(testData.mockResumeUploadS3Event);

        // Assert
        expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
    });

    it('should not process if daxtra is disabled for the company', async () => {
        // Arrange
        mockFeatureToggleService.mockResolvedValue(true);
        const mockUploadPublicItem = jest.mocked(uploadPublicItem);
        const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
        const mockGetObjectTagSet = jest
            .mocked(getObjectTagSet)
            .mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-48bc-a352-1a3999ccd4e2_3592404140',
                },
                {
                    Key: TagKey.COMPANY_ID,
                    Value: '5',
                },
            ]);

        // Act
        await resumeParserHandler(testData.mockResumeUploadS3Event);

        // Assert
        expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
        expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
    });

    it('should not process if object has daxtra request datetime value', async () => {
        // Arrange
        mockFeatureToggleService.mockResolvedValue(false);
        const mockUploadPublicItem = jest.mocked(uploadPublicItem);
        const mockGetObjectTagSet = jest
            .mocked(getObjectTagSet)
            .mockResolvedValueOnce([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2_3592404140',
                },
                {
                    Key: TagKey.DAXTRA_REQUEST_DATE,
                    Value: `${new Date().toISOString()}`,
                },
                {
                    Key: TagKey.COMPANY_ID,
                    Value: '5',
                },
            ]);

        // Act
        await resumeParserHandler(testData.mockResumeUploadS3Event);

        // Assert
        expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
    });

    it('should return resume raw data and success tag if daxtra endpoint response OK', async () => {
        // Arrange
        mockFeatureToggleService.mockResolvedValue(false);
        const mockUploadPublicItem = jest.mocked(uploadPublicItem);
        const mockGetObjectTagSet = jest
            .mocked(getObjectTagSet)
            .mockResolvedValue([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2_3592404140',
                },
                {
                    Key: TagKey.COMPANY_ID,
                    Value: '5',
                },
            ]);
        const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
        jest.mocked(axios.post).mockResolvedValueOnce(
            testData.daxtraAxiosResponse,
        );

        // Act
        await resumeParserHandler(testData.mockResumeUploadS3Event);

        // Assert
        expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
        expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
    });

    it('should return resume as null and failed tag if daxtra endpoint throw timed out error', async () => {
        // Arrange
        mockFeatureToggleService.mockResolvedValue(false);
        const mockUploadPublicItem = jest.mocked(uploadPublicItem);
        const mockGetObjectTagSet = jest
            .mocked(getObjectTagSet)
            .mockResolvedValue([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2_3592404140',
                },
                {
                    Key: TagKey.COMPANY_ID,
                    Value: '5',
                },
            ]);
        const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
        jest.mocked(axios.post).mockRejectedValueOnce({ code: 'ECONNABORTED' });

        // Act
        await resumeParserHandler(testData.mockResumeUploadS3Event);

        // Assert
        expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
        expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
    });

    it('should return resume as null and failed tag if daxtra endpoint throw error', async () => {
        // Arrange
        mockFeatureToggleService.mockResolvedValue(false);
        const mockUploadPublicItem = jest.mocked(uploadPublicItem);
        const mockGetObjectTagSet = jest
            .mocked(getObjectTagSet)
            .mockResolvedValue([
                {
                    Key: TagKey.IDEMPOTENCE_KEY,
                    Value: 'bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2_3592404140',
                },
                {
                    Key: TagKey.COMPANY_ID,
                    Value: '5',
                },
            ]);
        const mockUpdateObjectTagging = jest.mocked(updateObjectTagging);
        jest.mocked(axios.post).mockRejectedValueOnce({
            response: {
                data: 'Error message',
            },
        });

        // Act
        await resumeParserHandler(testData.mockResumeUploadS3Event);

        // Assert
        expect(mockGetObjectTagSet.mock.calls).toMatchSnapshot();
        expect(mockUploadPublicItem.mock.calls).toMatchSnapshot();
        expect(mockUpdateObjectTagging.mock.calls).toMatchSnapshot();
    });
});
