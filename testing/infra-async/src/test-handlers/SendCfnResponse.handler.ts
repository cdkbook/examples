// eslint-disable-next-line @typescript-eslint/no-require-imports
const response = require('./cfn-response');
export const handler = async (event: any) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  if (event.taskresult && event.taskresult.Error === 'States.Timeout') {
    return response.send(event.customResource, {
      ...event.customResource,
      done: () => ({}),
      logStreamName: event.customResource.physicalResourceId,
    }, response.FAILED, {});
  }


  try {
    return response.send(event.customResource, {
      ...event.customResource,
      done: () => ({}),
      logStreamName: event.customResource.physicalResourceId,
    }, response.SUCCESS, {});
  } catch (err) {
    console.error('Error occurred while responding to Custom Resource:', err);
  }
};