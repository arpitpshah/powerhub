// SNSHelper.ts
import { SNS } from 'aws-sdk';
import { UserComplaint } from '../types/userComplaint.types';

export class SNSHelper {
  private sns: SNS;

  constructor() {
    this.sns = new SNS();
  }

  public async createTopic(topicName: string): Promise<string | null> {
    try {
      const snsTopicArnResponse = await this.sns.createTopic({ Name: topicName }).promise();

      if (!snsTopicArnResponse.TopicArn) {
        console.error('Failed to create SNS topic');
        return null;
      }

      return snsTopicArnResponse.TopicArn;
    } catch (error) {
      console.error('Error creating SNS topic:', error);
      return null;
    }
  }

  public async subscribeUser(protocolName: string, topicArn: string, userEmail: string): Promise<void> {
    try {
      const subscribeParams = {
        Protocol: protocolName,
        TopicArn: topicArn,
        Endpoint: userEmail,
      };

      await this.sns.subscribe(subscribeParams).promise();
    } catch (error) {
      console.error('Error subscribing user to SNS:', error);
    }
  }

  public async isUserSubscribed(topicArn: string, userEmail: string): Promise<boolean> {
    try {
      const subscriptions = await this.sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();
      const isSubscribed = subscriptions.Subscriptions?.some(
        (subscription) => subscription.Protocol === 'email' && subscription.Endpoint === userEmail
      );
      return !!isSubscribed;
    } catch (error) {
      console.error('Error checking user subscription:', error);
      return false;
    }
  }
}
