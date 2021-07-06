import * as path from 'path';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AttributeType, Table } from 'aws-cdk-lib/lib/aws-dynamodb';
import { Construct } from 'constructs';
import { ApiTester } from './ApiTester';

export class SimpleApiWithTestsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const construct = new Construct(this, 'Api');

    const table = new Table(construct, 'SomeTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const backend = new NodejsFunction(construct, 'Backend', {
      entry: path.join(__dirname, 'handlers', 'proxy.ts'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    //table.grantReadWriteData(backend);

    // @ts-ignore
    const api = new LambdaRestApi(construct, 'SomeApi', {
      handler: backend,
    });

    new ApiTester(this, 'Tests', { api }).node.addDependency(construct);
  }
}