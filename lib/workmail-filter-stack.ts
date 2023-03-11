import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { ApplicationStage } from './application-stage';

export class WorkmailFilterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const synth = new ShellStep('Synth', {
      input: CodePipelineSource.gitHub('yobibyte-solutions/aws-workmail-filter', 'main'),
      installCommands: ['npm i -g npm@latest'],
      commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      primaryOutputDirectory: 'cdk.out',
    });

    const pipeline = new CodePipeline(this, 'workmail-filter-pipeline', {
      pipelineName: "workmail-filter-pipeline",
      synth: synth,
    });

    pipeline.addStage(new ApplicationStage(this, 'workmail-filter-function-stage'));
  }
}
