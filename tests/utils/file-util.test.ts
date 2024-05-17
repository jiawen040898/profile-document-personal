import { FileUtil } from '@pulsifi/utils';

describe('FileUtil', () => {
    describe('getMimeType', () => {
        it("should return 'image/svg+xml' when file extension is 'svg' and mimeType is 'octet-stream'", () => {
            // Arrange
            const file = {
                filename: 'file.svg',
                mimeType: 'application/octet-stream',
                content: Buffer.alloc(0),
            };

            // Act
            const result = FileUtil.getMimeType(file);

            // Assert
            expect(result).toBe('image/svg+xml');
        });

        it("should return 'application/pdf' when file extension is 'pdf'", () => {
            // Arrange
            const file = {
                filename: 'file.pdf',
                mimeType: 'application/pdf',
                content: Buffer.alloc(0),
            };

            // Act
            const result = FileUtil.getMimeType(file);

            // Assert
            expect(result).toBe('application/pdf');
        });

        it("should return 'application/pdf' when file extension is 'pdf' and the mimeType is 'octet-stream'", () => {
            // Arrange
            const file = {
                filename: 'file.pdf',
                mimeType: 'application/octet-stream',
                content: Buffer.alloc(0),
            };

            // Act
            const result = FileUtil.getMimeType(file);

            // Assert
            expect(result).toBe('application/pdf');
        });

        it('should return the mimeType when the mimeType is not octet-stream', () => {
            // Arrange
            const file = {
                filename: 'file.ttl',
                mimeType: 'text/plain',
                content: Buffer.alloc(0),
            };

            // Act
            const result = FileUtil.getMimeType(file);

            // Assert
            expect(result).toBe('text/plain');
        });

        it("should return 'image/svg+xml' when file extension is 'svg' and mimeType is undefined", () => {
            // Arrange
            const file = {
                filename: 'file.svg',
                content: Buffer.alloc(0),
            };

            // Act
            const result = FileUtil.getMimeType(file);

            // Assert
            expect(result).toBe('image/svg+xml');
        });
    });

    describe('getFileExtension', () => {
        it.each([
            { fileName: 'file.svg', expected: 'svg' },
            { fileName: 'file.pdf', expected: 'pdf' },
        ])(
            "should return '$expected' when file name is '$fileName'",
            ({ fileName, expected }) => {
                // Act
                const result = FileUtil.getFileExtension(fileName);

                // Assert
                expect(result).toBe(expected);
            },
        );
    });

    describe('getMimeTypeFromFileName', () => {
        it.each([
            { fileName: 'file.svg', expected: 'image/svg+xml' },
            { fileName: 'file.pdf', expected: 'application/pdf' },
            { fileName: 'file.bin', expected: 'application/octet-stream' },
            { fileName: 'file.8z', expected: 'application/octet-stream' },
        ])(
            "should return '$expected' when file name is '$fileName'",
            ({ fileName, expected }) => {
                // Act
                const result = FileUtil.getMimeTypeFromFileName(fileName);

                // Assert
                expect(result).toBe(expected);
            },
        );
    });
});
