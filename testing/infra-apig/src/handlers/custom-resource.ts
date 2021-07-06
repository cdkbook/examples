import * as axios from 'axios';

import * as response from './cfn-response';

export const handler = async (event: any, context: any) => {
  console.log('event:', JSON.stringify(event, null, 2));
  const { url } = event.ResourceProperties;
  if (event.RequestType === 'Delete') {
    // let's do nothing.
    return response.send(event, context, response.SUCCESS, {});
  }

  const responseData = {};
  try {
    await runTests(url);
    console.log('Tests passed!');
    await response.send(event, context, response.SUCCESS, responseData);
  } catch (err) {
    await response.send(event, context, response.FAILED, { err });
  }
};

const createTimeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests(url: string) {
  await createTimeout(30 * 1000);
  return await axios.post(url, {}, { headers: { 'X-Test': '' } });
}