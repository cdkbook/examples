import { App } from 'aws-cdk-lib';
import { MyApiGatewayStack } from './MyApiGatewayStack';

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyApiGatewayStack(app, 'MyApi', {
  env: devEnv,
  certificateArn: 'arn:aws:acm:us-east-1:536309290949:certificate/92dbf914-21fc-4132-a915-4b67eb029d75',
  hostedZoneId: 'Z09129483SE6UWS2RDQ9Z',
});

app.synth();