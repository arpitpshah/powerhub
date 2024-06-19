import { SQS } from 'aws-sdk';
import { SNSHelper } from './SNSHelper'; 
export interface UserComplaint {
  userId: string;
  complaintId: string;
  timeStamp: string;
  title: string;
  description: string;
  status: string;
}

export class SQSHelper {
  private sqs: SQS;
  private snsHelper: SNSHelper; 

  constructor() {
    this.sqs = new SQS();
    this.snsHelper = new SNSHelper(); 
  }

  public async deleteMessageFromQueue(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      };

      await this.sqs.deleteMessage(params).promise();
    } catch (error) {
      console.error('Error deleting message from SQS:', error);
    }
  }

}
