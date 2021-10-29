import { App } from '@aws-cdk/core';
import { OriginalStack } from './OriginalStack';


// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new OriginalStack(app, 'my-stack-dev', { env: devEnv });
// new RefactoredStack(app, 'my-stack-dev', { env: devEnv, idMap: { ThingyBucket292460C0: 'Bucket83908E77' } });

app.synth();