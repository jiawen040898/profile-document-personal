import { sanitizeByteString } from '@pulsifi/utils';

describe('sanitizeByteString', () => {
    it('removes null bytes from input string', () => {
        // Arrange
        const input =
            '● I have 10 years of exp\u0000erience in personal finance management, and I have assisted 45 rep\u0000eat clients in increasing their capital by an ave\u0000rage of 15% every year.\n● I have 10 years of experience in personal finance management, and I have assisted 45 repeat clients in increasing their ca\u0000pital by an average of 15% every year.\n';

        // Assert
        expect(sanitizeByteString(input)).toMatchSnapshot();
    });

    it('returns null if input is null', () => {
        // Assert
        expect(sanitizeByteString(null)).toBe(null);
    });

    it('returns null if input is undefined', () => {
        // Assert
        expect(sanitizeByteString(undefined)).toBe(null);
    });

    it('returns empty string if input is an empty string', () => {
        // Assert
        expect(sanitizeByteString('')).toBe(null);
    });

    it('returns input string if there are no null bytes', () => {
        // Assert
        expect(sanitizeByteString('hello')).toBe('hello');
    });
});
