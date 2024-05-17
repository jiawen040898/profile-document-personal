export interface File {
    filename: string;
    mimeType?: string;
    encoding?: string;
    truncated?: boolean;
    content: Buffer;
}

export interface ConvertPdfPayload {
    sourceBucket: string;
    sourceKey: string;
}

export interface UploadingFileResponseDto {
    file_path: string;
    file_name: string;
    bucket_name: string;
    key: string;
    file_extension?: string;
}
