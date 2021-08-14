const { AwsCdkTypeScriptApp } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '2.0.0-rc.16',
  defaultReleaseBranch: 'main',
  name: 'infra-async',
  deps: ['eslint', '@aws-sdk/client-sfn', '@aws-sdk/client-sqs'],
  devDeps: ['@types/aws-lambda'],
});
project.synth();