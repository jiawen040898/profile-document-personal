import { TypeScriptCode } from '@mrgrain/cdk-esbuild';
import {
    CustomLambdaErrorAlarmConstruct,
    CustomLambdaLogGroupConstruct,
    CustomResourceTagConstruct,
    PulsifiTeam,
} from '@pulsifi/custom-aws-cdk-lib';
import {
    type Code,
    Duration,
    RemovalPolicy,
    type Size,
    Tags,
} from 'aws-cdk-lib';
import {
    ContentHandling,
    type CorsOptions,
    type IAuthorizer,
    IModel,
    IResource,
    type IRestApi,
    LambdaIntegration,
    type LambdaIntegrationOptions,
    MethodOptions,
    MockIntegration,
    PassthroughBehavior,
    Resource,
    RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import {
    Rule,
    type RuleProps,
    RuleTargetInput,
    Schedule,
} from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import type { IRole } from 'aws-cdk-lib/aws-iam';
import {
    Function as AwsFunctionLambda,
    type FunctionProps,
    type LayerVersion,
    Runtime,
    type Version,
} from 'aws-cdk-lib/aws-lambda';
import { type ILogGroup, LogGroup } from 'aws-cdk-lib/aws-logs';
import {
    Bucket,
    type EventType,
    IBucket,
    type NotificationKeyFilter,
} from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';

import { ResourceTag } from '../constants';
import { BuildScriptProvider, configUtil } from '../utils';
import { environment, version } from '../variables';

/**
 * BundlingAssets
 *
 * @param from
 * @param to
 */
type BundlingAssets = {
    from: string[];
    to: string[];
};

/**
 * CustomCorsOptions
 */
export type CustomCorsOptions = Omit<
    CorsOptions,
    'disableCache' | 'exposeHeaders' | 'maxAge'
> & {
    responseTemplates?: { [contentType: string]: string };
    passthroughBehavior?: PassthroughBehavior;
    contentHandling?: ContentHandling;
    responseModels?: { [contentType: string]: IModel };
};

/**
 * ApiEventSource
 */
type ApiEventSource = {
    restApiId: string;
    rootResourceId: string;
    http: {
        method: string;
        parentPath: {
            resourceId: string;
            resourcePath: string;
        };
        path?: string;
        cors?: CustomCorsOptions;
        authorizer?: IAuthorizer;
        methodOptions?: MethodOptions;
        lambdaIntegrationOptions?: LambdaIntegrationOptions;
    }[];
};

/**
 * LambdaSpecificEnvironmentVariables
 */
type LambdaSpecificEnvironmentVariables = Record<string, string>;

/**
 * CustomFunctionProps
 *
 * @param functionName
 * @param description
 * @param entry
 * @param iamRole
 * @param layers
 * @optional isLogGroupExists
 * @optional handler
 * @optional runtime
 * @optional code
 * @optional bundlingAssets {@link BundlingAssets}
 * @optional timeout
 * @optional ephemeralStorageSize
 * @optional memorySize
 * @optional reservedConcurrentExecutions
 * @optional s3EventSources
 * @optional eventRules
 * @optional apiEventSources
 * @optional lambdaEnvironment
 * @optional warmupLambda
 */
type CustomFunctionProps<T extends LambdaSpecificEnvironmentVariables> = {
    functionName: string;
    description: string;
    entry: string;
    iamRole: IRole;
    layers: LayerVersion[];
    lambdaSpecificEnvironmentVariables?: T;
    isLogGroupExists?: boolean;
    handler?: string;
    runtime?: Runtime;
    code?: Code;
    bundlingAssets?: BundlingAssets[];
    timeout?: Duration;
    ephemeralStorageSize?: Size;
    memorySize?: number;
    reservedConcurrentExecutions?: number;
    s3EventSources?: {
        s3BucketName: string;
        s3EventType: EventType;
        s3EventSourceProps?: NotificationKeyFilter[];
    }[];
    eventRules?: RuleProps[];
    apiEventSources?: ApiEventSource[];
    hasWarmUp?: boolean;
};

export class BaseFunction<
    T extends LambdaSpecificEnvironmentVariables,
> extends Construct {
    public readonly lambda: AwsFunctionLambda;
    public readonly lambdaVersion: Version;
    private static apiResourceMap = new Map<string, IResource>();
    private apiGatewayCount = 1;
    private s3Buckets: IBucket | null = null;

    /**
     * BaseFunction
     *
     * @public lambda
     * @public lambdaVersion
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomFunctionProps}
     */
    constructor(scope: Construct, id: string, props: CustomFunctionProps<T>) {
        super(scope, id);

        const {
            iamRole,
            apiEventSources,
            s3EventSources,
            lambdaSpecificEnvironmentVariables,
            hasWarmUp,
            ...lambdaProps
        } = props;

        /* log group */
        let logGroup: ILogGroup;
        if (props.isLogGroupExists) {
            logGroup = LogGroup.fromLogGroupName(
                scope,
                `${id}-log-group`,
                `/aws/lambda/${props.functionName}`,
            );
        } else {
            const logGroupConstruct = new CustomLambdaLogGroupConstruct(
                scope,
                `${id}-log-group`,
                {
                    awsEnvironment: environment,
                    resourceOwner: PulsifiTeam.ENGINEERING,
                    lambdaName: `${props.functionName}`,
                },
            );

            logGroup = logGroupConstruct.logGroup;
        }

        /* default lambda configuration */
        const defaultLambdaConfiguration: FunctionProps = {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_18_X,
            memorySize: 256,
            timeout: Duration.seconds(60),
            environment: {
                ...configUtil.getEnvironmentVariables(scope, environment),
                ...lambdaSpecificEnvironmentVariables,
            },
            role: iamRole,
            currentVersionOptions: {
                removalPolicy: RemovalPolicy.RETAIN,
            },
            ...lambdaProps,
            code: new TypeScriptCode(props.entry, {
                buildProvider: new BuildScriptProvider(
                    'cdk/lib/utils/esbuild/build.mjs',
                    {
                        /* specifies additional external modules to exclude from bundling */
                        externalModules: ['layer/nodejs/package.json'],
                    },
                ),
                buildOptions: {
                    outfile: 'index.js',
                },
            }),
            logGroup: logGroup,
        };

        /* lambda version */
        this.lambda = new AwsFunctionLambda(
            this,
            'Lambda',
            defaultLambdaConfiguration,
        );

        this.lambdaVersion = this.lambda.currentVersion;

        /* tags */
        new CustomResourceTagConstruct(this, `${id}-tagging`, {
            construct: this,
            awsEnvironment: environment,
            resourceOwner: PulsifiTeam.ENGINEERING,
            resourceName: props.functionName,
        });

        Tags.of(scope).add('Type', ResourceTag.LAMBDA);
        Tags.of(scope).add('Version', version);

        /* lambda error alarm */
        new CustomLambdaErrorAlarmConstruct(this, `${id}-error-alarm`, {
            awsEnvironment: environment,
            resourceOwner: PulsifiTeam.ENGINEERING,
            lambda: this.lambda,
        });

        /* lambda triggers */
        if (s3EventSources) {
            for (const eventSource of s3EventSources) {
                this.addS3EventSource(
                    eventSource.s3BucketName,
                    eventSource.s3EventType,
                    eventSource.s3EventSourceProps,
                );
            }
        }

        if (apiEventSources) {
            for (const eventSource of apiEventSources) {
                this.addApiEventSource(eventSource);
            }
        }

        if (hasWarmUp) {
            this.createWarmupLambdaRule();
        }
    }

    private createWarmupLambdaRule() {
        const eventRule = new Rule(this, 'lambda-warm-up-rule', {
            ruleName: `${this.lambda.functionName}-warm-up-rule`,
            schedule: Schedule.rate(Duration.seconds(300)),
        });

        eventRule.addTarget(
            new LambdaFunction(this.lambda, {
                event: RuleTargetInput.fromObject({
                    source: 'serverless-plugin-warmup',
                }),
            }),
        );
    }

    private createMockIntegrationAndMethods(cors: CustomCorsOptions): {
        mockIntegration: MockIntegration;
        methodOptions: MethodOptions;
    } {
        const quoteString = (s: string[]): string => `'${s.join(',')}'`;

        const statusCode = cors.statusCode?.toString() ?? '204';
        const defaultAllowMethods = [
            'OPTIONS',
            'GET',
            'PUT',
            'POST',
            'DELETE',
            'PATCH',
            'HEAD',
        ];
        const defaultAllowHeaders = [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
            'X-Amz-Security-Token',
            'X-Amz-User-Agent',
        ];

        const responseParameters = {
            ...(cors.allowCredentials && {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'method.response.header.Access-Control-Allow-Credentials':
                    "'true'",
            }),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'method.response.header.Access-Control-Allow-Headers': quoteString(
                cors.allowHeaders ?? defaultAllowHeaders,
            ),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'method.response.header.Access-Control-Allow-Methods': quoteString(
                cors.allowMethods ?? defaultAllowMethods,
            ),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'method.response.header.Access-Control-Allow-Origin': quoteString(
                cors.allowOrigins,
            ),
        };

        const mockIntegration = new MockIntegration({
            integrationResponses: [
                {
                    statusCode,
                    responseParameters,
                    responseTemplates: cors.responseTemplates,
                    contentHandling: cors.contentHandling,
                },
            ],
            passthroughBehavior: cors.passthroughBehavior,
            requestTemplates: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'application/json': '{"statusCode": 200}',
            },
        });

        const methodOptions: MethodOptions = {
            methodResponses: [
                {
                    responseModels: cors.responseModels,
                    statusCode,
                    responseParameters: Object.keys(responseParameters).reduce(
                        (allowHeaders, responseParameter) => ({
                            ...allowHeaders,
                            [responseParameter]: true,
                        }),
                        {},
                    ),
                },
            ],
        };

        return { mockIntegration, methodOptions };
    }

    private importApiGatewayRootResource(
        restApiId: string,
        rootResourceId: string,
    ) {
        return RestApi.fromRestApiAttributes(
            this,
            `${rootResourceId}-imported-api-gateway`,
            {
                restApiId,
                rootResourceId,
            },
        );
    }

    private importedApiGatewayParentResource(
        importApiGatewayRootResource: IRestApi,
        resourceId: string,
        path: string,
    ) {
        const importedApiGatewayParentResource =
            Resource.fromResourceAttributes(
                this,
                `${resourceId}-imported-api-gateway-path-${this.apiGatewayCount}`,
                {
                    restApi: importApiGatewayRootResource,
                    resourceId,
                    path,
                },
            );

        this.apiGatewayCount++;

        return importedApiGatewayParentResource;
    }

    private createResourcePath(
        importedApiGatewayPath: IResource,
        path?: string,
    ) {
        if (!path) {
            return importedApiGatewayPath;
        }

        const pathToBeCreated = path.split('/');

        let next = importedApiGatewayPath;
        pathToBeCreated.forEach((pathSegment) => {
            const savedResource = BaseFunction.apiResourceMap.get(
                next.path + '/' + pathSegment,
            );
            if (savedResource) {
                next = savedResource;
            } else {
                next = next.resourceForPath(pathSegment);
                BaseFunction.apiResourceMap.set(next.path, next);
            }
        });

        return next;
    }

    private addApiEventSource(eventSource: ApiEventSource) {
        const { restApiId, rootResourceId, http } = eventSource;

        const importedApiGatewayRootResource =
            this.importApiGatewayRootResource(restApiId, rootResourceId);

        for (const route of http) {
            const {
                parentPath,
                path,
                cors,
                method,
                authorizer,
                lambdaIntegrationOptions,
                methodOptions,
            } = route;

            const importedApiGatewayParentResource =
                this.importedApiGatewayParentResource(
                    importedApiGatewayRootResource,
                    parentPath.resourceId,
                    parentPath.resourcePath,
                );

            const apiGatewayPath = this.createResourcePath(
                importedApiGatewayParentResource,
                path,
            );

            if (cors) {
                const { mockIntegration, methodOptions: optionsMethodOptions } =
                    this.createMockIntegrationAndMethods(cors);
                apiGatewayPath.addMethod(
                    'OPTIONS',
                    mockIntegration,
                    optionsMethodOptions,
                );
            }

            apiGatewayPath.addMethod(
                method,
                new LambdaIntegration(this.lambda, {
                    allowTestInvoke: false,
                    ...lambdaIntegrationOptions,
                }),
                {
                    authorizer,
                    ...methodOptions,
                },
            );
        }
    }

    private addS3EventSource(
        s3BucketName: string,
        eventType: EventType,
        s3EventSourceProps?: NotificationKeyFilter[],
    ) {
        if (!this.s3Buckets) {
            this.s3Buckets = Bucket.fromBucketArn(
                this,
                `s3-bucket-name`,
                `arn:aws:s3:::${s3BucketName}`,
            );
        }

        this.s3Buckets.addEventNotification(
            eventType,
            new LambdaDestination(this.lambda),
            ...(s3EventSourceProps ?? []),
        );

        return this;
    }
}
