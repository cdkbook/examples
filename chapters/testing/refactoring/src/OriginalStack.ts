import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

export class OriginalStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // The first time you run the unit test, have this bucket created here:
    new Bucket(this, 'Bucket', {});
  }
}