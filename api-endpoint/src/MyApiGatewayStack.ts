import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { NewsletterFunction } from './handlers/newsletter/newsletter-function';
import { ReviewsHandlerFunction } from './handlers/reviews/reviews-handler-function';

export interface MyApiGatewayStackProps extends StackProps {
  /**
   * The ARN of the ACM certificate to use for the endpoint.
   */
  readonly certificateArn: string;

  /**
   * The Hosted Zone ID of the domain being used.
   */
  readonly hostedZoneId: string;
}

export class MyApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: MyApiGatewayStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'Api', {
      description: 'A simple API example for The CDK Book',
      restApiName: 'TheCDKBookApi',
      deploy: true, // let's make this easier by always redeploying,
      deployOptions: {
        stageName: 'v1',
        throttlingRateLimit: 10,
      },
      domainName: {
        domainName: 'api.thecdkbook.com',
        certificate: Certificate.fromCertificateArn(this, 'ApiCertificate', props.certificateArn),
      },
    });
    this.createNewsletterResource(api);
    this.createReviewsResource(api);
    this.addDns(api, props);
  }

  private addDns(api: RestApi, props: MyApiGatewayStackProps) {

    const aRecord = new ARecord(this, 'ApiDNS', {
      recordName: 'api',
      zone: HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
        hostedZoneId: props.hostedZoneId,
        zoneName: 'thecdkbook.com',
      }),
      target: RecordTarget.fromAlias(new ApiGateway(api)),
    });

    new CfnOutput(this, 'ApiGatewayEndpoint', {
      value: aRecord.domainName,
    });
  }

  private createNewsletterResource(api: RestApi) {
    const newsletterHandler = new NewsletterFunction(this, 'NewsletterHandler');
    const lambdaIntegration = new LambdaIntegration(newsletterHandler);
    const newsletterResource = api.root.addResource('newsletter', {
      defaultCorsPreflightOptions: {
        allowCredentials: true,
        allowHeaders: ['*'],
        allowMethods: ['*'],
        allowOrigins: ['www.thecdkbook.com', 'thecdkbook.com'],
      },
      defaultIntegration: lambdaIntegration,
    });
    newsletterResource.addMethod('GET', lambdaIntegration, {});
  }

  private createReviewsResource(api: RestApi) {
    const reviewsHandler = new ReviewsHandlerFunction(this, 'ReviewsHandler');
    const lambdaIntegration = new LambdaIntegration(reviewsHandler);
    const reviewsResource = api.root.addResource('reviews', {
      defaultCorsPreflightOptions: {
        allowCredentials: true,
        allowHeaders: ['*'],
        allowMethods: ['*'],
        allowOrigins: ['www.thecdkbook.com', 'thecdkbook.com'],
      },
      defaultIntegration: lambdaIntegration,
    });
    reviewsResource.addMethod('GET', lambdaIntegration, {});
  }
}