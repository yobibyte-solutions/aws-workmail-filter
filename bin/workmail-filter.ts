#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WorkmailFilterStack } from '../lib/workmail-filter-stack';

const app = new cdk.App();
new WorkmailFilterStack(app, 'workmail-filter-pipeline-stack', {
  env: {
    region: "eu-west-1",
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  },
});