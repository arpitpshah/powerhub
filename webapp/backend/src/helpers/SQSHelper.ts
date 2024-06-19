import { SQS } from 'aws-sdk';
import { UserComplaint } from '../types/userComplaint.types';

/**
 * Helper class for AWS SQS operations.
 */
export class SQSHelper {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS();
  }

  /**
   * Creates an SQS queue.
   * @param queueName - The name of the queue to create.
   * @returns The URL of the created queue, or null if creation fails.
   */
  public async createQueue(queueName: string): Promise<string | null> {
    try {
      const queueParams = {
        QueueName: queueName,
      };

      const queueUrlResponse = await this.sqs.createQueue(queueParams).promise();
      return queueUrlResponse.QueueUrl || null;
    } catch (error) {
      console.error('Error creating SQS queue:', error);
      return null;
    }
  }

  /**
   * Sends a confirmation message to an SQS queue.
   * @param queueUrl - The URL of the queue where the message will be sent.
   * @param snsTopicArn - The ARN of the SNS topic.
   * @param userEmail - The email address of the user.
   * @param complaint - The complaint object.
   */
  public async sendConfirmationMessageToQueue(queueUrl: string, snsTopicArn: string, userEmail: string, complaint: UserComplaint): Promise<void> {
    try {
      const message = JSON.stringify({ userEmail, snsTopicArn, complaint, queueUrl });
      const params = {
        MessageBody: message,
        QueueUrl: queueUrl,
      };

      await this.sqs.sendMessage(params).promise();
    } catch (error) {
      console.error('Error sending confirmation message to SQS:', error);
    }
  }
}
