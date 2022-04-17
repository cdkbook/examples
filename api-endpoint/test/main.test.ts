import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { MyApiGatewayStack } from "../src/MyApiGatewayStack";

test('Snapshot', () => {
  const app = new App();
  const stack = new MyApiGatewayStack(app, 'test');

  expect(stack).not.toHaveResource('AWS::S3::Bucket');
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});