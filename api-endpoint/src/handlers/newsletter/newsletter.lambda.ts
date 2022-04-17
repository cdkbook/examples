import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event: ', JSON.stringify(event, null, 2));
  return {
    body: 'This is your latest newsletter...',
    headers: {},
    isBase64Encoded: false,
    statusCode: 200,
  };
};