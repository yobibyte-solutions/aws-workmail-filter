import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { ReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
import { Lambda, LambdaInvocationType } from 'aws-cdk-lib/aws-ses-actions';


export class ApplicationStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new ApplicationStack(this, id);
    }
}

class ApplicationStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const filterFunction = new Function(this, 'filter-function', {
            code: Code.fromAsset('lib/filter-function'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_18_X
        });

        
        const sesReceiptRuleSet = ReceiptRuleSet.fromReceiptRuleSetName(this, 'existing-ruleset', 'INBOUND_MAIL');
            
        sesReceiptRuleSet.addRule('fitler-rule', {
            recipients: ['yobibyte-solutions.co.uk'],
            receiptRuleName: 'filter-rule',
            enabled: true,
            actions: [
                new Lambda({
                    function: filterFunction,
                    invocationType: LambdaInvocationType.REQUEST_RESPONSE
                })
            ]
        });
    }
}
