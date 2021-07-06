import { runTest } from './runTest';

function addTester(handler: Function) {
  return async (event: any, context: any) => {
    if (event.httpMethod === 'POST' && event.headers['X-Test'] !== undefined) {
      try {
        await runTest();
      } catch (err) {
        return { statusCode: 500, body: err.toString() };
      }
      return { statusCode: 200, body: 'Test Ran!' };
    }
    return handler(event, context);
  };
}

// function logger(handler: Function) {
//   return async function (...args: any[]) {
//     console.log('event: ', args);
//     const returnValue = await handler(...args);
//     console.log('Return value:', returnValue);
//     return returnValue;
//   };
// }

let originalApplicationHandler = (event: any) => {
  console.log('event: ', JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    body: '',
  };
};
export const handler = addTester(originalApplicationHandler);