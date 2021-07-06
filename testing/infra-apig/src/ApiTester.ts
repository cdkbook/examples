import * as path from 'path';
import { CustomResource, Duration } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class ApiTester extends Construct {
  constructor(scope: Construct, id: string, props: { api: LambdaRestApi }) {
    super(scope, id);
    const handler = new NodejsFunction(this, 'ApiTester', {
      entry: path.join(__dirname, 'handlers', 'custom-resource.ts'),
      timeout: Duration.minutes(3),
    });

    new CustomResource(this, 'TestingResource', {
      serviceToken: handler.functionArn,
      resourceType: 'Custom::Tests',
      properties: {
        url: props.api.latestDeployment?.api.deploymentStage.urlForPath()!,
        updateTime: new Date().toISOString(),
      },
    });
  }

}