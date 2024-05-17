import { validateFileExtension } from '../../../src/functions/convertToPdf/handler';

jest.mock('../../../src/lib/services/daxtra.service');

describe('convertToPdf', () => {
    it('should not accept invalid file type', () => {
        expect(() => {
            validateFileExtension('abc');
        }).toThrow(Error);
        expect(() => {
            validateFileExtension('abc.png');
        }).toThrow(Error);
    });

    it('should not accept pdf file type', () => {
        expect(() => {
            validateFileExtension('abc.pdf');
        }).toThrow(Error);
    });

    it('should accept valid file extension', () => {
        expect(validateFileExtension('xyz.doc')).toBeTruthy();
        expect(validateFileExtension('xyz.docx')).toBeTruthy();
    });

    it('should accept valid file extension', () => {
        expect(validateFileExtension('xyz.doc')).toEqual('xyz.pdf');
        expect(validateFileExtension('cv.docx')).toEqual('cv.pdf');
    });
});
