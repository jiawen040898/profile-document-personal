import {
    AuthorizationType,
    type IAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import type { Function as AwsLambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { BaseFunction } from '../base';
import { apiGatewayConfig } from '../constants';
import { ProfileDocumentResumeParserFnConfig } from '../interfaces';
import { version } from '../variables';
import type { IAMRoleGroupResources } from './iam/iam-roles';
import type { LayerGroupResources } from './layers';

/**
 * FunctionGroupResourcesProps
 *
 * @param iamRoleGroupResources {@link IAMRoleGroupResources}
 * @param layerGroupResources {@link LayerGroupResources}
 */
type FunctionGroupResourcesProps = {
    iamRoleGroupResources: IAMRoleGroupResources;
    layerGroupResources: LayerGroupResources;
};

export class FunctionGroupResources extends Construct {
    public readonly profileDocumentCandidateFileUploadFn: AwsLambdaFunction;
    public readonly profileDocumentConvertToPdfFn: AwsLambdaFunction;
    public readonly profileDocumentGeneralUploadFn: AwsLambdaFunction;
    public readonly profileDocumentResumeParserFn: AwsLambdaFunction;
    public readonly profileDocumentResumeUploadFn: AwsLambdaFunction;

    /**
     * FunctionGroupResources
     *
     * @public profileDocumentCandidateFileUploadFn {@link AwsLambdaFunction}
     * @public profileDocumentConvertToPdfFn {@link AwsLambdaFunction}
     * @public profileDocumentGeneralUploadFn {@link AwsLambdaFunction}
     * @public profileDocumentResumeParserFn {@link AwsLambdaFunction}
     * @public profileDocumentResumeUploadFn {@link AwsLambdaFunction}
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link FunctionGroupResourcesProps}
     */
    constructor(
        scope: Construct,
        id: string,
        props: FunctionGroupResourcesProps,
    ) {
        super(scope, id);

        const commonAuthorizer: IAuthorizer = {
            authorizationType: AuthorizationType.CUSTOM,
            authorizerId: StringParameter.valueFromLookup(
                scope,
                '/configs/API_GATEWAY/STANDARD_AUTHORIZER_ID',
            ),
        };

        this.profileDocumentCandidateFileUploadFn = new BaseFunction(
            this,
            'profile-document-candidate-file-upload-fn',
            {
                functionName: 'profile-document-candidate-file-upload-fn',
                description: `Handling attachment and resume upload, parsing resume data and save them into holding buckets. (v${version})`,
                entry: 'src/functions/fileUpload/handler.ts',
                isLogGroupExists: true,
                hasWarmUp: true,
                iamRole: props.iamRoleGroupResources.profileDocumentLambdaRole,
                layers: [props.layerGroupResources.profileDocumentLayer],
                apiEventSources: [
                    {
                        restApiId: StringParameter.valueFromLookup(
                            scope,
                            '/configs/API_GATEWAY/REST_API_ID',
                        ),
                        rootResourceId: StringParameter.valueFromLookup(
                            scope,
                            '/configs/API_GATEWAY/ROOT_RESOURCE_ID',
                        ),
                        http: [
                            {
                                method: 'POST',
                                parentPath: {
                                    resourceId: StringParameter.valueFromLookup(
                                        scope,
                                        '/configs/API_GATEWAY/DOCUMENT_V1_RESOURCE_ID',
                                    ),
                                    resourcePath: '/document/v1.0',
                                },
                                path: 'file_upload',
                                authorizer: commonAuthorizer,
                                cors: apiGatewayConfig.fileUploadCors,
                                methodOptions:
                                    apiGatewayConfig.fileUploadMethodOptions,
                                lambdaIntegrationOptions:
                                    apiGatewayConfig.fileUploadLambdaIntegrationOptions,
                            },
                            {
                                method: 'POST',
                                parentPath: {
                                    resourceId: StringParameter.valueFromLookup(
                                        scope,
                                        '/configs/API_GATEWAY/DOCUMENT_PARENT_RESOURCE_ID',
                                    ),
                                    resourcePath: '/document',
                                },
                                path: 'public/file_upload',
                                cors: apiGatewayConfig.fileUploadCors,
                                methodOptions:
                                    apiGatewayConfig.fileUploadMethodOptions,
                                lambdaIntegrationOptions:
                                    apiGatewayConfig.fileUploadLambdaIntegrationOptions,
                            },
                        ],
                    },
                ],
            },
        ).lambda;

        this.profileDocumentConvertToPdfFn = new BaseFunction(
            this,
            'profile-document-convert-to-pdf-fn',
            {
                functionName: 'profile-document-convert-to-pdf-fn',
                description: `Listen to s3 Bucket Document create event, convert to PDF and save back to save bucket. (v${version})`,
                entry: 'src/functions/convertToPdf/handler.ts',
                isLogGroupExists: true,
                iamRole: props.iamRoleGroupResources.profileDocumentLambdaRole,
                layers: [props.layerGroupResources.profileDocumentLayer],
                s3EventSources: [
                    {
                        s3BucketName: StringParameter.valueForStringParameter(
                            scope,
                            '/configs/S3_DOCUMENT_BUCKET',
                        ),
                        s3EventType: EventType.OBJECT_CREATED,
                        s3EventSourceProps: [
                            {
                                prefix: 'candidates',
                            },
                            {
                                suffix: 'resume.doc',
                            },
                        ],
                    },
                    {
                        s3BucketName: StringParameter.valueForStringParameter(
                            scope,
                            '/configs/S3_DOCUMENT_BUCKET',
                        ),
                        s3EventType: EventType.OBJECT_CREATED,
                        s3EventSourceProps: [
                            {
                                prefix: 'candidates',
                            },
                            {
                                suffix: 'resume.docx',
                            },
                        ],
                    },
                ],
            },
        ).lambda;

        this.profileDocumentGeneralUploadFn = new BaseFunction(
            this,
            'profile-document-general-upload-fn',
            {
                functionName: 'profile-document-general-upload-fn',
                description: `provide file upload for console/talent app for handling misc file upload such as image, resume, attachment, parsing resume data and save them into holding buckets. (v${version})`,
                entry: 'src/functions/documentUpload/handler.ts',
                isLogGroupExists: true,
                hasWarmUp: true,
                iamRole: props.iamRoleGroupResources.profileDocumentLambdaRole,
                layers: [props.layerGroupResources.profileDocumentLayer],
                apiEventSources: [
                    {
                        restApiId: StringParameter.valueFromLookup(
                            scope,
                            '/configs/API_GATEWAY/REST_API_ID',
                        ),
                        rootResourceId: StringParameter.valueFromLookup(
                            scope,
                            '/configs/API_GATEWAY/ROOT_RESOURCE_ID',
                        ),
                        http: [
                            {
                                method: 'POST',
                                parentPath: {
                                    resourceId: StringParameter.valueFromLookup(
                                        scope,
                                        '/configs/API_GATEWAY/DOCUMENT_V1_FILES_RESOURCE_ID',
                                    ),
                                    resourcePath: '/document/v1.0/files',
                                },
                                path: 'upload',
                                authorizer: commonAuthorizer,
                                cors: apiGatewayConfig.fileUploadCors,
                                methodOptions:
                                    apiGatewayConfig.fileUploadMethodOptions,
                                lambdaIntegrationOptions:
                                    apiGatewayConfig.fileUploadLambdaIntegrationOptions,
                            },
                        ],
                    },
                ],
            },
        ).lambda;

        this.profileDocumentResumeParserFn =
            new BaseFunction<ProfileDocumentResumeParserFnConfig>(
                this,
                'profile-document-resume-parser-fn',
                {
                    functionName: 'profile-document-resume-parser-fn',
                    description: `Listen to s3 object tagging event, send to daxtra for parsing, save daxtra result into holding buckets. (v${version})`,
                    entry: 'src/functions/resumeParser/handler.ts',
                    isLogGroupExists: true,
                    iamRole:
                        props.iamRoleGroupResources.profileDocumentLambdaRole,
                    layers: [props.layerGroupResources.profileDocumentLayer],
                    lambdaSpecificEnvironmentVariables: {
                        UNLEASH_API_KEY:
                            StringParameter.valueForStringParameter(
                                scope,
                                '/configs/UNLEASH_API_KEY',
                            ),
                        UNLEASH_API_URL:
                            StringParameter.valueForStringParameter(
                                scope,
                                '/configs/UNLEASH_API_URL',
                            ),
                        UNLEASH_ENV: StringParameter.valueForStringParameter(
                            scope,
                            '/configs/UNLEASH_ENV',
                        ),
                        UNLEASH_PROJECT_ID:
                            StringParameter.valueForStringParameter(
                                scope,
                                '/configs/UNLEASH_PROJECT_ID',
                            ),
                    },
                    s3EventSources: [
                        {
                            s3BucketName:
                                StringParameter.valueForStringParameter(
                                    scope,
                                    '/configs/S3_DOCUMENT_UPLOAD_BUCKET',
                                ),
                            s3EventType: EventType.OBJECT_TAGGING,
                            s3EventSourceProps: [
                                {
                                    prefix: 'candidate',
                                },
                                {
                                    suffix: 'resume.doc',
                                },
                            ],
                        },
                        {
                            s3BucketName:
                                StringParameter.valueForStringParameter(
                                    scope,
                                    '/configs/S3_DOCUMENT_UPLOAD_BUCKET',
                                ),
                            s3EventType: EventType.OBJECT_TAGGING,
                            s3EventSourceProps: [
                                {
                                    prefix: 'candidate',
                                },
                                {
                                    suffix: 'resume.docx',
                                },
                            ],
                        },
                        {
                            s3BucketName:
                                StringParameter.valueForStringParameter(
                                    scope,
                                    '/profile-document-fn/S3_DOCUMENT_UPLOAD_BUCKET',
                                ),
                            s3EventType: EventType.OBJECT_TAGGING,
                            s3EventSourceProps: [
                                {
                                    prefix: 'candidate',
                                },
                                {
                                    suffix: 'resume.pdf',
                                },
                            ],
                        },
                    ],
                },
            ).lambda;

        this.profileDocumentResumeUploadFn = new BaseFunction(
            this,
            'profile-document-resume-upload-fn',
            {
                functionName: 'profile-document-resume-upload-fn',
                description: `Handling resume upload and save them into holding buckets. (v${version})`,
                entry: 'src/functions/resumeUpload/handler.ts',
                isLogGroupExists: true,
                hasWarmUp: true,
                iamRole: props.iamRoleGroupResources.profileDocumentLambdaRole,
                layers: [props.layerGroupResources.profileDocumentLayer],
                apiEventSources: [
                    {
                        restApiId: StringParameter.valueFromLookup(
                            scope,
                            '/configs/API_GATEWAY/REST_API_ID',
                        ),
                        rootResourceId: StringParameter.valueFromLookup(
                            scope,
                            '/configs/API_GATEWAY/ROOT_RESOURCE_ID',
                        ),
                        http: [
                            {
                                method: 'POST',
                                parentPath: {
                                    resourceId: StringParameter.valueFromLookup(
                                        scope,
                                        '/configs/API_GATEWAY/DOCUMENT_V1_RESOURCE_ID',
                                    ),
                                    resourcePath: '/document/v1.0',
                                },
                                path: 'resume_upload',
                                authorizer: commonAuthorizer,
                                cors: {
                                    ...apiGatewayConfig.commonCors,
                                    allowHeaders: [
                                        ...(apiGatewayConfig.commonCors
                                            ?.allowHeaders ?? []),
                                        'idempotence-key',
                                    ],
                                    responseTemplates:
                                        apiGatewayConfig.resumeUploadIntegrationResponseTemplate,
                                },
                            },
                            {
                                method: 'POST',
                                parentPath: {
                                    resourceId: StringParameter.valueFromLookup(
                                        scope,
                                        '/configs/API_GATEWAY/DOCUMENT_PARENT_RESOURCE_ID',
                                    ),
                                    resourcePath: '/document',
                                },
                                path: 'public/resume_upload',
                                cors: {
                                    ...apiGatewayConfig.commonCors,
                                    allowHeaders: [
                                        ...(apiGatewayConfig.commonCors
                                            ?.allowHeaders ?? []),
                                        'idempotence-key',
                                    ],
                                    responseTemplates:
                                        apiGatewayConfig.resumeUploadIntegrationResponseTemplate,
                                },
                            },
                        ],
                    },
                ],
            },
        ).lambda;
    }
}
