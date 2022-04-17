const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.4.0',
  defaultReleaseBranch: 'main',
  name: 'api-endpoint',
  deps: ['@types/aws-lambda'],
  gitignore: ['.idea/'],
});
project.synth();