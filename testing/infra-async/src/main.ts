import { App } from 'aws-cdk-lib';
import { PubSubStack } from './PubSubStack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new PubSubStack(app, 'SimplePubSub', { env: devEnv });

app.synth();