import { SNSHelper } from "./SNSHelper";
import { SQSHelper } from "./SQSHelper";

export const handler = async (event: any) => {
    const snsHelper = new SNSHelper();
    const sqsHelper = new SQSHelper();
  
    for (const record of event.Records) {
      const parsedBody = JSON.parse(record.body);
      const { snsTopicArn, userEmail, complaint, Type } = parsedBody;
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/837919273423/powerHubSNSSQS'
      // Check if the message is an SNS Notification
      if (Type !== 'Notification') {
        // Process Complaint messages
        if (!complaint || !complaint.complaintId) {
          console.error('Complaint information is missing or incorrectly formatted:', record.body);
          continue; // Skip this record and continue with the next
        }
  
        const isConfirmed = await snsHelper.isUserConfirmed(snsTopicArn, userEmail);
        if (isConfirmed) {
          await snsHelper.sendSNSNotification(snsTopicArn, complaint);
          await sqsHelper.deleteMessageFromQueue(queueUrl, record.receiptHandle);
        } else {
          console.log(`Subscription not confirmed for ${userEmail}`);
          throw new Error(`Subscription not confirmed for ${userEmail}`);
        }
      }
    }
  };
  