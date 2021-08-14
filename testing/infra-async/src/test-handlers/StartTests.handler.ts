import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';

const response = require('./cfn-response');

const stateMachineArn = process.env.STATE_MACHINE_ARN;
export const handler = async (event: CloudFormationCustomResourceEvent, context: any) => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  if (event.RequestType === 'Delete') {
    // let's do nothing.
    return response.send(event, context, response.SUCCESS, {});
  }
  try {

    const client = new SFNClient({});
    const physicalResourceId = context.logStreamName;
    const { StackId, RequestId, LogicalResourceId, ResponseURL } = event;
    const customResource = { physicalResourceId, StackId, RequestId, LogicalResourceId, ResponseURL };
    console.log('Staring test suite with input: ', customResource);
    await client.send(new StartExecutionCommand({
      stateMachineArn,
      input: JSON.stringify({ customResource }),
    }));
    console.log('Test suite started...');
  } catch (err) {
    console.error('Error: ', err);
  }
};