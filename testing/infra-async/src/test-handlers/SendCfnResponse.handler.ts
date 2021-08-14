import { FAILED, send, SUCCESS } from './cfn-response';

export const handler = async (event: any) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  if (event.taskresult && event.taskresult.Error === 'States.Timeout') {
    return send(event.customResource, FAILED, {});
  }
  try {
    return await send(event.customResource, SUCCESS, {});
  } catch (err) {
    console.error('Error occurred while responding to Custom Resource:', err);
  }
};