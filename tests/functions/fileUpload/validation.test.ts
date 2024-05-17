import { FilePurpose } from '@pulsifi/enum';
import { readFileSync } from 'fs';
import path from 'path';

import { validateFile } from '../../../src/functions/fileUpload/validation';

const imageBuffer = readFileSync(
    path.join(__dirname, '../../fixtures/test-png.png'),
);
const pdfBuffer = readFileSync(
    path.join(__dirname, '../../fixtures/sample-pdf.pdf'),
);

describe('validateFile', () => {
    it('should not accept invalid file type', () => {
        expect(() => {
            validateFile(FilePurpose.ATTACHMENT, {
                filename: 'test/test.abc',
                mimeType: 'image/png',
                content: imageBuffer,
            });
        }).toThrow(Error);
    });

    it('should not accept image for resume', () => {
        expect(() => {
            validateFile(FilePurpose.RESUME, {
                filename: 'test/test.png',
                mimeType: 'image/png',
                content: imageBuffer,
            });
        }).toThrow(Error);
    });

    it('should accept image file for attachment', () => {
        expect(
            validateFile(FilePurpose.ATTACHMENT, {
                filename: 'test/test.png',
                mimeType: 'image/png',
                content: imageBuffer,
            }),
        ).toBeUndefined();
    });

    it('should accept document file for resume', () => {
        expect(
            validateFile(FilePurpose.RESUME, {
                filename: 'test/test.pdf',
                mimeType: 'application/pdf',
                content: pdfBuffer,
            }),
        ).toBeUndefined();
    });
});
