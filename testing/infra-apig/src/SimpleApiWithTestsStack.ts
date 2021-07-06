import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class SimpleApiWithTestsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
  }
}