import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event: ', JSON.stringify(event, null, 2));
  return {
    body: JSON.stringify([{
      author: 'Matthew Bonig',
      stars: 4,
      comment: 'Yeah, it\'s a pretty good book.',
    }]),
    headers: {},
    isBase64Encoded: false,
    statusCode: 200,
  };
};