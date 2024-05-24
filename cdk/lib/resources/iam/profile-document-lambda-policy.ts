import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { accountId } from '../../variables';

const sqsPermissions = new PolicyStatement({
    actions: [
        'sqs:DeleteMessage',
        'sqs:ReceiveMessage',
        'sqs:GetQueueAttributes',
    ],
    effect: Effect.ALLOW,
    resources: [`arn:aws:sqs:*:${accountId}:profile-document-queue.fifo`],
    sid: 'SQSPermissions',
});

const lambdaPermissions = new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:lambda:*:${accountId}:function:profile-document-candidate-file-upload-fn:*`,
        `arn:aws:lambda:*:${accountId}:function:profile-document-general-upload-fn:*`,
        `arn:aws:lambda:*:${accountId}:function:profile-document-convert-to-pdf-fn:*`,
        `arn:aws:lambda:*:${accountId}:function:profile-document-resume-parser-fn:*`,
    ],
    sid: 'LambdaPermissions',
});

const parameterStorePermissions = new PolicyStatement({
    actions: [
        'ssm:GetParameter',
        'ssm:GetParameters',
        'ssm:GetParametersByPath',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:ssm:*:${accountId}:parameter/configs/*`,
        `arn:aws:ssm:*:${accountId}:parameter/profile-document-fn/*`,
    ],
    sid: 'ParameterStorePermissions',
});

export const profileDocumentLambdaPolicy = [
    sqsPermissions,
    lambdaPermissions,
    parameterStorePermissions,
];
