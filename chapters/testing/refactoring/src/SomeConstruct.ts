import { Bucket } from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';

export class SomeConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // this is the code, copy and pasted from its original usage directly in the stack above
    new Bucket(this, 'Bucket', {});
  }
}