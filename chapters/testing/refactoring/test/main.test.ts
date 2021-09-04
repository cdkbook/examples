import { Template } from '@aws-cdk/assertions';
import { App } from '@aws-cdk/core';
import { MyStack } from '../src/main';

test('Snapshot', () => {
  /**
   * This is a simple snapshot test using Jest. If you run this test before your refactoring, it'll take a snapshot
   * of the LogicalId.
   * Refactor your code and then re-run this test. It will fail as the LogicalIds have changed.
   *
   * Then, uncomment out the idMap property and verify the correct values are provided. The failed test will show
   * you the new LogicalId (what it received) and the original LogicalId (the snapshot).
   * In the example code, the new LogicalId of 'ThingyBucket7D8CBF87' will be rewritten to the value it
   * was before the refactor, 'Bucket83908E77', satisfying the test and ensuring your resource won't be recreated.
   */

  const app = new App();
  const stack = new MyStack(app, 'test', { idMap: { ThingyBucket7D8CBF87: 'Bucket83908E77' } });
  expect(Template.fromStack(stack)).toMatchSnapshot();
});