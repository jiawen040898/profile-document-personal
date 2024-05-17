import { UploadOutput } from '@pulsifi/interfaces';
import { readFileSync } from 'fs';
import path from 'path';

import { getResumeDetails } from '../../../src/functions/fileUpload/getResumeDetails';

jest.mock('../../../src/lib/services/daxtra.service');

const content: Buffer = readFileSync(
    path.join(__dirname, '../../fixtures/sample-pdf.pdf'),
);

describe('getResumeDetails', () => {
    it('should able to run without error', async () => {
        const resumeOutput = await getResumeDetails(
            content,
            {} as UploadOutput,
        );

        expect(resumeOutput.fullDetails).toBeTruthy();
        expect(resumeOutput.partialDetails).toMatchSnapshot();
    });
});
