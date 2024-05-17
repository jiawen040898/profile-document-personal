import { Tags } from 'serverless/aws';

export type WarmUpFunctionHandler = {
    warmup: {
        default: {
            enabled: boolean;
        };
    };
};

export const tags: Tags = {
    Type: 'AWS::Lambda::Function',
};

export const version = '${env:TAG_VERSION}';
