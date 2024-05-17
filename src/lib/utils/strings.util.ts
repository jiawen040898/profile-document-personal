export function sanitizeByteString(input?: string | null): string | null {
    return input?.replace(/\x00/g, '') || null;
}
