import { SendTaskSuccessCommand, SFNClient } from '@aws-sdk/client-sfn';
import { SQSEvent, SQSRecord } from 'aws-lambda';

let config = { region: 'us-east-1' };
const sfn = new SFNClient(config);

function addTester(handler: Function) {
  return async (event: SQSEvent, context: any) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    // look for a test message:
    const testMessage = event.Records.find((message: SQSRecord) => !!(JSON.parse(JSON.parse(message.body).Message).taskToken));

    if (!!testMessage) {
      try {
        const { timestamp, taskToken } = JSON.parse(JSON.parse(testMessage.body).Message);
        console.log({ timestamp, taskToken });
        await sfn.send(new SendTaskSuccessCommand({
          taskToken,
          output: '{"success":"The tests passed"}',
        }));
        console.log('Activity sent success');

      } catch (err) {
        console.error('Error when trying to send task success: ', err);
        throw err;
      }
    }
    return handler(event, context);
  };

}

export const originalHandler = async (event: any) => {
  console.log('Event:', JSON.stringify(event, null, 2));
};

export const handler = addTester(originalHandler);