import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { IdMap } from './LogicalIdMapper';


interface MyStackProps extends StackProps {
  idMap?: IdMap;
}

export class OriginalStack extends Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    // The first time you run the unit test, have this bucket created here:
    new Bucket(this, 'Bucket', {});
  }
}