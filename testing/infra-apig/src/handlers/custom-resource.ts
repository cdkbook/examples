import * as response from '@matthewbonig/cfn-response';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';

import * as axios from 'axios';

export const handler = async (event: CloudFormationCustomResourceEvent, context: any) => {
  console.log('event:', JSON.stringify(event, null, 2));
  const { url } = event.ResourceProperties;
  if (event.RequestType === 'Delete') {
    // let's do nothing.
    return response.send({
      ...event,
      PhysicalResourceId: context.logStreamName,
      Status: response.ResponseStatus.SUCCESS,
      Data: {},
      Reason: '',
      NoEcho: false,
    });
  }

  const responseData = {};
  try {
    await runTests(url);
    console.log('Tests passed!');
    await response.send({
      ...event,
      Status: response.ResponseStatus.SUCCESS,
      Data: responseData,
      PhysicalResourceId: context.logStreamName,
      Reason: '',
      NoEcho: false,
    });
  } catch (err) {
    await response.send({
      ...event,
      Status: response.ResponseStatus.FAILED,
      Data: { err },
      PhysicalResourceId: context.logStreamName,
      Reason: '',
      NoEcho: false,
    });
  }
};

async function runTests(url: string) {
  return await axios.post(url + '/test/', {});
}