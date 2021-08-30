import { SendTaskSuccessCommand, SFNClient } from '@aws-sdk/client-sfn';
import { SQSEvent, SQSRecord } from 'aws-lambda';

let config = { region: 'us-east-1' };
const sfn = new SFNClient(config);

function addTester(handler: Function) {
  return async (event: SQSEvent, context: any) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    // look for a test message:
    // this would change depending on how the test message was published
    // in this case, just look to see if any records have a taskToken on them
    // again, demo code. You'd likely want to test differently here.
    const testMessages = event.Records.filter((message: SQSRecord) => {
      try {
        return !!(JSON.parse(JSON.parse(message.body).Message).taskToken);
      } catch (err) {
        // ok, we couldn't parse which means we didn't have the write structure.
        // I'd love a tryParse or something on JSON but we don't have it,
        // so this makes the most sense
        return false;
      }
    });

    if (!!testMessages && testMessages.length > 0) {
      for (const testMessage of testMessages) {
        try {
          const { taskToken } = JSON.parse(JSON.parse(testMessage.body).Message);

          // we got the test message, great!
          // let's let the task know that
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
    }

    // let's go ahead and remove the test messages from what the normal handler now needs to process
    const testRemove = new Set(testMessages);
    event.Records = event.Records.filter(x => !testRemove.has(x));

    // time to do the normal thing
    return handler(event, context);
  };
}

export const originalHandler = async (event: any) => {
  console.log('Event:', JSON.stringify(event, null, 2));
};

export const handler = addTester(originalHandler);