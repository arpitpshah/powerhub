import { SNS } from 'aws-sdk';

export interface UserComplaint {
  userId: string;
  complaintId: string;
  timeStamp: string;
  title: string;
  description: string;
  status: string;
}

export class SNSHelper {
  private sns: SNS;

  constructor() {
    this.sns = new SNS();
  }

  public async isUserConfirmed(topicArn: string, userEmail: string): Promise<boolean> {
    try {
      const subscriptions = await this.sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();
      const subscription = subscriptions.Subscriptions?.find(
        (sub) => sub.Protocol === 'email' && sub.Endpoint === userEmail
      ) as any;
      if (subscription?.SubscriptionArn !== 'PendingConfirmation') {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking user confirmation status:', error);
      return false;
    }
  }

  public async sendSNSNotification(snsTopicArn: string, complaint: UserComplaint): Promise<void> {
    try {
      const message = `Complaint ID: ${complaint.complaintId}\nComplaint Registered: ${complaint.title}\nComplaint Description: ${complaint.description}\nThank you for your patience. Your complaint will be addressed shortly.`;
      const subject = 'Complaint Registration Confirmation';

      await this.sns.publish({
        Message: message,
        Subject: subject,
        TopicArn: snsTopicArn,
      }).promise();
    } catch (error) {
      console.error('Error sending SNS notification:', error);
    }
  }

}
