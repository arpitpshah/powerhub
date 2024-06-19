import { DynamoDB } from 'aws-sdk';
import { ScheduledHandler } from 'aws-lambda';
import { DataSimulator } from 'powerdatautils';
import fetch from 'node-fetch';
import * as utils from './utils';

const documentClient = new DynamoDB.DocumentClient();
const tableName = 'energyConsumption';
const userInfoTable = 'userInfo'; // Replace with your userInfo table name

export const handler: ScheduledHandler = async (event) => {
  try {
    // Fetch user IDs from userInfo table
    const userIds = await fetchUserIds();
    if (event.source === "aws.events" && event['detail-type'] === "Scheduled Event") {
      // Always handle daily data
      await handleDailyData(userIds);

      // Additionally, on the first of the month, generate and send bill data
      if (isFouthDayOfMonth(new Date())) {
        await generateAndSendBillData(userIds);
      }
    } else {
      await handleThreeMonthsData(userIds);
    }
    } catch (error) {
      console.error('Error in handler:', error);
      throw error;
    }
};

async function fetchUserIds(): Promise<string[]> {
  const params = { TableName: userInfoTable };
  const data = await documentClient.scan(params).promise();
  return data.Items
    ?.filter(item => item.role !== 'admin') // Exclude users with the 'admin' role
    .map(item => item.userId) || [];
}

async function fetchUserName(userId: string): Promise<string> {
  const params = {
    TableName: userInfoTable,
    Key: { 'userId': userId }
  };

  try {
    const data = await documentClient.get(params).promise();

    return data.Item ? data.Item.firstName : 'Unknown User';
  } catch (error) {
    console.error(`Error fetching user name for userId ${userId}:`, error);
    return 'Unknown User';  // Fallback in case of an error
  }
}

async function batchInsertData(userId: string, electricityUnits: number[], startDate?: Date) {
  if(!startDate) return
  const startDateObj = new Date(startDate);
  const putRequests = electricityUnits.map((unit, index) => {
    // Calculate the timestamp for each data point based on the starting date and index
    const timeStamp = new Date(startDate.getTime() + index * 3600000);
    return {
      PutRequest: {
        Item: {
          userId,
          timeStamp: timeStamp.toISOString(),  // ISO 8601 format
          energyConsumption: unit
        }
      }
    };
  });

  // Split into chunks and insert
  for (let i = 0; i < putRequests.length; i += 25) {
    const chunk = putRequests.slice(i, i + 25);
    const params = { RequestItems: { [tableName]: chunk } };
    await documentClient.batchWrite(params).promise();
  }
}

async function handleDailyData(userIds:string[]) {
  const todayMidnight = new Date();
  todayMidnight.setDate(todayMidnight.getDate() - 1); // Set to midnight of the previous day
  todayMidnight.setHours(0, 0, 0, 0); // Set to midnight
  for (const userId of userIds) {
    const electricityUnits = DataSimulator.generateElectricityUnits(24, { start: 17, end: 21 }, { peak: 10, offPeak: 3 });
    await batchInsertData(userId, electricityUnits,todayMidnight);
  }
}

async function handleThreeMonthsData(userIds:string[]) {

  const currentDate = new Date();
  // Create a new Date instance to avoid mutating the original currentDate
  const threeMonthsAgo = new Date(currentDate.valueOf());

  // Subtract 3 months from the current date
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  // Ensure that the date doesn't roll over to an unexpected month by setting the day to the last of the month
  // if the current day is greater than the last day of the new month
  if (currentDate.getDate() > threeMonthsAgo.getDate()) {
    threeMonthsAgo.setDate(0); // 0 sets the date to the last day of the previous month
  }

  // Now, threeMonthsAgo is set to approximately three months before the current date

  for (const userId of userIds) {
    const electricityUnits = generateThreeMonthsData(threeMonthsAgo, currentDate,{ start: 17, end: 21 }, { peak: 10, offPeak: 3 });
    await batchInsertData(userId, electricityUnits,threeMonthsAgo);
  }
}

function generateThreeMonthsData(startDate: Date, endDate: Date,hourRange: any, rates: any): number[] {
  let units: number[] = [];
  for (let date = new Date(startDate); date <= endDate; date.setHours(date.getHours() + 1)) {
    let unitArray: number[] = DataSimulator.generateElectricityUnits(1, hourRange, rates);
    units.push(unitArray[0]);
  }
  return units;
}

  async function generateAndSendBillData(userIds: string[]) {
    for (const userId of userIds) {
      const { name, units, cost, dateFrom, dateTo } = await calculateMonthlyData(userId);
      const monthYear = new Date(dateFrom).toLocaleString('default', { month: 'long', year: 'numeric' });
      const documentId = monthYear.replace(" ", "_");
      const formattedDateFrom = utils.formatDateForDisplay(dateFrom);
      const formattedDateTo = utils.formatDateForDisplay(dateTo);
      await sendBillDataToS3({ 
        userId, 
        name, 
        dateFrom:formattedDateFrom, 
        dateTo:formattedDateTo, 
        units, 
        cost, 
        documentId 
      });
    }
  }

async function calculateMonthlyData(userId: string): Promise<{ name: string, units: number, cost: number, dateFrom: string, dateTo: string }> {
  const { firstDayOfPreviousMonth, lastDayOfPreviousMonth } = utils.getPreviousMonthDateRange();
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'userId = :userId AND #ts BETWEEN :start AND :end',
    ExpressionAttributeNames: {
      '#ts': 'timeStamp'  // Replace 'timeStamp' with a placeholder
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':start': firstDayOfPreviousMonth.toISOString(),
      ':end': lastDayOfPreviousMonth.toISOString()
    }
  };

  const data = await documentClient.query(params).promise();
  let totalUnits = 0;
  let totalCost = 0;

  data.Items?.forEach(item => {
    totalUnits += item.energyConsumption;
    const hour = new Date(item.timeStamp).getHours();
    totalCost += utils.calculateCost(item.energyConsumption, hour);
  });

  const userName = await fetchUserName(userId); // Fetches user's name from userInfo table

  return { 
    name: userName, 
    units: totalUnits, 
    cost: totalCost, 
    dateFrom: firstDayOfPreviousMonth.toISOString(), 
    dateTo: lastDayOfPreviousMonth.toISOString()
  };
}



async function sendBillDataToS3(billData: any): Promise<void> {
  const apiUrl = 'http://powerhubbackend.us-east-1.elasticbeanstalk.com/api/bill/generate-bill';
  try {

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billData),
    });
    if (!response.ok) {
      // Handle non-2xx responses
      console.error(`Failed to send data to API. Status: ${response.status}, Body: ${await response.text()}`);
      throw new Error(`API responded with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending bill data to S3:', error);
    throw error;
  }
}

function isFouthDayOfMonth(date: Date): boolean {
  return date.getDate() === 4;
}

