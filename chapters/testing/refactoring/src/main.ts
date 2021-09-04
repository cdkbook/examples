import { Bucket } from '@aws-cdk/aws-s3';
import { App, Aspects, Construct, Stack, StackProps } from '@aws-cdk/core';
import { IdMap, LogicalIdMapper } from './LogicalIdMapper';

interface MyStackProps extends StackProps {
  idMap?: IdMap;
}

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    // The first time you run the unit test, have this bucket created here:
    new Bucket(this, 'Bucket', {});
    // Then you refactor, by commenting this ^^ line of code out and restoring
    // out the SomeConstruct:

    // new SomeConstruct(this, 'Thingy');

    // the SomeConstruct is the Bucket, refactored.

    // if an idMap was provided, add the aspect.
    if (props.idMap) {
      Aspects.of(this).add(new LogicalIdMapper(props.idMap));
    }
  }
}

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
new MyStack(app, 'my-stack-dev', { env: devEnv, idMap: { ThingyBucket292460C0: 'Bucket83908E77' } });

app.synth();