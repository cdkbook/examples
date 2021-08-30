import { App } from 'aws-cdk-lib';
import { SimpleApiWithTestsStack } from './SimpleApiWithTestsStack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new SimpleApiWithTestsStack(app, 'SimpleApiWithTests', { env: devEnv });

app.synth();