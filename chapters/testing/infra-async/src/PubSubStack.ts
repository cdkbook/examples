import * as path from 'path';
import { CustomResource, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Effect, IGrantable, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import {
  IntegrationPattern,
  JsonPath,
  StateMachine,
  StateMachineType,
  TaskInput,
} from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke, SnsPublish } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export class PubSubStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const topic = new Topic(this, 'IntakeTopic', {});

    const queue = new Queue(this, 'ProcessingQueue', {});

    topic.addSubscription(new SqsSubscription(queue, {}));
    const handler = new NodejsFunction(this, 'QueueHandler', {});
    handler.addEventSource(new SqsEventSource(queue, {}));

    new PubSubTest(this, 'Tests', { topic }).grant(handler);

  }
}

interface PubSubTestProps {
  topic: ITopic;
}

export class PubSubTest extends Construct {
  private readonly stateMachine: StateMachine;

  constructor(scope: Construct, id: string, props: PubSubTestProps) {
    super(scope, id);


    const testBasicEndToEnd = new SnsPublish(this, 'TestBasicEndToEnd', {
      comment: 'Sends a test message to the SNS topic',
      topic: props.topic,
      message: TaskInput.fromObject({
        timestamp: new Date().toISOString(),
        taskToken: JsonPath.stringAt('$$.Task.Token'),
      }),
      integrationPattern: IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      resultPath: JsonPath.DISCARD,
      timeout: Duration.seconds(30),
    });


    const sendCfnResponseHandler = new NodejsFunction(this, 'CfnResponseHandler', {
      entry: path.join(__dirname, 'test-handlers', 'SendCfnResponse.handler.ts'),
    });
    let sendResponse = new LambdaInvoke(this, 'SendCustomResourceResponse', {
      comment: 'Sends a response to the Custom Resource letting it know the test passed',
      lambdaFunction: sendCfnResponseHandler,
    });
    testBasicEndToEnd.next(sendResponse);

    testBasicEndToEnd.addCatch(sendResponse, { resultPath: JsonPath.stringAt('$.taskresult') });

    this.stateMachine = new StateMachine(this, 'Tests', {
      stateMachineType: StateMachineType.STANDARD,
      definition: testBasicEndToEnd,
    });

    const startTestHandler = new NodejsFunction(this, 'StartTestsHandler', {
      entry: path.join(__dirname, 'test-handlers', 'StartTests.handler.ts'),
      environment: {
        STATE_MACHINE_ARN: this.stateMachine.stateMachineArn,
      },
    });
    this.stateMachine.grantStartExecution(startTestHandler);

    new CustomResource(this, 'StartTestsCustomResource', {
      serviceToken: startTestHandler.functionArn,
      properties: {
        timestamp: new Date().toISOString(), // so we always run the test
      },
    }).node.addDependency(this.stateMachine);
  }

  public grant(grantable: IGrantable) {
    grantable.grantPrincipal.addToPrincipalPolicy(new PolicyStatement({
      resources: [this.stateMachine.stateMachineArn],
      actions: ['states:SendTaskSuccess'],
      effect: Effect.ALLOW,
    }));
  }
}