import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { ResponseStatus, send } from '@matthewbonig/cfn-response';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';


const stateMachineArn = process.env.STATE_MACHINE_ARN;
export const handler = async (event: CloudFormationCustomResourceEvent, context: any) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const PhysicalResourceId = context.logStreamName;

  if (event.RequestType === 'Delete') {
    // let's do nothing.
    return send({ ...event, PhysicalResourceId: context.logStreamName, Status: ResponseStatus.SUCCESS, Data: {}, NoEcho: false, Reason: '' });
  }
  try {
    const client = new SFNClient({});
    const { StackId, RequestId, LogicalResourceId, ResponseURL } = event;
    const customResource = { PhysicalResourceId, StackId, RequestId, LogicalResourceId, ResponseURL };
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