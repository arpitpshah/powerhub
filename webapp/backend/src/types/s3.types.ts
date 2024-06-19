export interface S3UploadParams {
    Bucket: string;
    Key: string;
    Body: Buffer;
    ContentType: string;
}

export interface S3DownloadParams {
    Bucket: string;
    Key: string;
}

export interface Document {
    key: string;
    lastModified: Date;
    size: number;
}