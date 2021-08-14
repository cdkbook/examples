import '@aws-cdk/assert/jest';
import { App } from 'aws-cdk-lib';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { CodeConfig } from 'aws-cdk-lib/lib/aws-lambda';
import { PubSubStack } from '../src/PubSubStack';

describe('mocking Code', () => {
  let fromAssetMock: jest.SpyInstance;

  beforeAll(() => {
    // mock the Code calls so tests run quicker
    fromAssetMock = jest.spyOn(Code, 'fromAsset').mockReturnValue({
      isInline: false,
      bind: (): CodeConfig => {
        return {
          s3Location: {
            bucketName: 'my-bucket',
            objectKey: 'my-key',
          },
        };
      },
      bindToResource: () => {
        return;
      },
    } as any);
  });
  afterAll(() => {
    // restore the Code from mock
    fromAssetMock?.mockRestore();
  });

  test('Check snapshot', () => {
    const app = new App();
    const stack = new PubSubStack(app, 'test');

    expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
  });
});
