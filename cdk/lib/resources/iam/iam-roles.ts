import {
    CompositePrincipal,
    type IRole,
    ManagedPolicy,
    ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { BaseIAM } from '../../base';
import { accountId } from '../../variables';
import { profileDocumentLambdaPolicy } from './profile-document-lambda-policy';

export class IAMRoleGroupResources extends Construct {
    public readonly profileDocumentLambdaRole: IRole;

    /**
     * IAMRoleGroupResources
     *
     * @public profileDocumentLambdaRole {@link IRole}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.profileDocumentLambdaRole = new BaseIAM(
            this,
            'profile-document-lambda-role',
            {
                resourceName: 'profile-document-lambda',
                assumedBy: new CompositePrincipal(
                    new ServicePrincipal('lambda.amazonaws.com'),
                ),
                customPolicies: [
                    {
                        policyName: 'profile-document-lambda',
                        statements: profileDocumentLambdaPolicy,
                    },
                ],
                managedPolicies: [
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'aws-lambda-basic-execution-role',
                        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                    ),
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'pulsifi-kms-policy',
                        `arn:aws:iam::${accountId}:policy/PulsifiKMSPolicy`,
                    ),
                    ManagedPolicy.fromManagedPolicyArn(
                        this,
                        'pulsifi-scanned-document-bucket-policy',
                        `arn:aws:iam::${accountId}:policy/PulsifiScannedDocumentBucketPolicy`,
                    ),
                ],
            },
        ).role;
    }
}
