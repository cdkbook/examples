import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

const queueName = process.env.DLQ_NAME;
const client = new SQSClient({ region: 'us-east-1' });
export const handler = async (event: any) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  console.log('Going to read queue ', queueName);
  const { Messages: messages } = await client.send(new ReceiveMessageCommand({
    QueueUrl: queueName,
    MaxNumberOfMessages: 10,
  }));
  console.log(`Found ${messages?.length} messages`);
  return { dlqMessageFound: !!messages ? messages!.length > 0 : false };
};