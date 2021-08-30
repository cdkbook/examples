import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

export async function runTest() {
  // now we're going to do some special test work here.
  console.log('Running test!');
  const tableName = process.env.TABLE_NAME!;
  const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
  let itemWritten: boolean = false;
  const testItem = createNewTestItem();
  let key = { PK: testItem.PK };
  try {
    // let's write a record to dynamodb
    const putItemCommand = new PutItemCommand({
      Item: testItem,
      TableName: tableName,
    });

    const response = await client.send(putItemCommand);
    itemWritten = true;
    console.log('Response from write: ', response);

    // then read that record and compare
    const readResponse = await client.send(new GetItemCommand({
      Key: key,
      TableName: tableName,
    }));
    console.log('Response from read: ', readResponse);

    let areEqual = compare(readResponse.Item, testItem);
    console.log('Comparing...', areEqual);
    if (!areEqual) {
      let s = JSON.stringify(readResponse.Item, null, 2);
      let s1 = JSON.stringify(testItem, null, 2);
      throw new Error(`Tests failed, items not equal: \n${s}\n${s1}`);
    }
  } finally {
    // then delete that record
    if (itemWritten) {
      await client.send(new DeleteItemCommand({
        Key: key, TableName: tableName,
      }));
    }
  }
}

function compare(one: any, two: any) {
  return JSON.stringify(one) === JSON.stringify(two);
}

function createNewTestItem() {
  return {
    PK: { S: 'test#' + new Date().toISOString() },
  };
}