import { ResponseStatus, send } from '@matthewbonig/cfn-response';

export const handler = async (event: any) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  if (event.taskresult && event.taskresult.Error === 'States.Timeout') {
    return send({ ...event.customResource, Status: ResponseStatus.FAILED, Data: {} });
  }
  try {
    return await send({ ...event.customResource, Status: ResponseStatus.SUCCESS, Data: {} });
  } catch (err) {
    console.error('Error occurred while responding to Custom Resource:', err);
  }
};