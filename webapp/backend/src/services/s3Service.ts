import AWS from 'aws-sdk';
import { S3DownloadParams, S3UploadParams, Document } from '../types/s3.types';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();
const bucketName = `powerhubbucket`; // Define bucket name as a constant

/**
 * Uploads a PDF to S3.
 * @param userId - The user ID.
 * @param pdfBuffer - The PDF file as a buffer.
 * @param filename - The filename for the PDF.
 * @returns The result of the S3 upload operation.
 */
export async function uploadToS3(userId: string, pdfBuffer: Buffer, filename: string): Promise<AWS.S3.ManagedUpload.SendData> {
  const params: S3UploadParams = {
    Bucket: bucketName,
    Key: `${userId}/${filename}`,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
  };

  try {
    // Check and create bucket if it doesn't exist
    if (!(await doesBucketExist(bucketName))) {
      await createBucket(bucketName);
    }

    // Upload the file to S3
    return await s3.upload(params).promise();
  } catch (error) {
    console.error('Error uploading to S3:', error);
    logToCloudWatch('Error uploading to S3', error);
    throw error;
  }
}

async function doesBucketExist(bucketName: string): Promise<boolean> {
  try {
    await s3.headBucket({ Bucket: bucketName }).promise();
    return true;
  } catch (error: any) {
    if (error.statusCode === 404) {
      return false;
    }
    throw error;
  }
}

async function createBucket(bucketName: string): Promise<void> {
  await s3.createBucket({ Bucket: bucketName }).promise();
  console.log(`Bucket "${bucketName}" created successfully.`);
}

/**
 * Downloads a PDF from S3.
 * @param userId - The user ID.
 * @param documentId - The document ID.
 * @returns The downloaded PDF as a Buffer.
 */
export async function downloadPDFFromS3(userId: string, documentId: string): Promise<Buffer> {
  const params: S3DownloadParams = {
    Bucket: bucketName,
    Key: `${userId}/${documentId}.pdf`,
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body as Buffer;
  } catch (error) {
    console.error('Error downloading from S3:', error);
    logToCloudWatch('Error downloading from S3', error);
    throw error;
  }
}

/**
 * Lists the documents for a user in S3.
 * @param userId - The user ID.
 * @returns An array of documents.
 */
export async function listUserDocuments(userId: string): Promise<Document[]> {
  const params = {
    Bucket: bucketName,
    Prefix: `${userId}/`,
  };

  try {
    const s3Response = await s3.listObjectsV2(params).promise();
    return (s3Response.Contents ?? [])
      .filter((file) => !!file.Key && !file.Key.endsWith('/'))
      .map((file) => ({
        key: file.Key!,
        lastModified: file.LastModified!,
        size: file.Size!,
      }));
  } catch (error) {
    console.error('Error listing documents from S3:', error);
    logToCloudWatch('Error listing documents from S3', error);
    throw error;
  }
}
