import { Bucket } from '@aws-cdk/aws-s3';
import { App, Aspects, Construct, Stack, StackProps } from '@aws-cdk/core';
import { IdMap, LogicalIdMapper } from './LogicalIdMapper';

interface MyStackProps extends StackProps {
  idMap?: IdMap;
}

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);
    new SomeConstruct(this, 'Thingy');

    // if an idMap was provided, add the aspect.
    if (props.idMap) {
      Aspects.of(this).add(new LogicalIdMapper(props.idMap));
    }
  }
}

class SomeConstruct extends Construct {
  // @ts-ignore
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new Bucket(this, 'Bucket', {});
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'my-stack-dev', { env: devEnv, idMap: { ThingyBucket292460C0: 'Bucket83908E77' } });

app.synth();