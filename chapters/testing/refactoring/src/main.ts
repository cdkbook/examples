import { Bucket } from '@aws-cdk/aws-s3';
import { App, Construct, StackProps } from '@aws-cdk/core';
import { IdMap } from './LogicalIdMapper';
import { OriginalStack } from './OriginalStack';


export class SomeConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // this is the code, copy and pasted from its original usage directly in the stack above
    new Bucket(this, 'Bucket', {});
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

// When creating a new stack, you'll pass an idMap in (optionally) that will change new LogicalIds to old LogicalIds.
// This keeps you from having to recreate any existing resources after refactoring your code.
new OriginalStack(app, 'my-stack-dev', { env: devEnv, idMap: { ThingyBucket292460C0: 'Bucket83908E77' } });

app.synth();