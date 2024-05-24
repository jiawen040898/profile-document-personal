import { Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

import { FunctionGroupResources } from './resources/functions';
import { IAMRoleGroupResources } from './resources/iam/iam-roles';
import { LayerGroupResources } from './resources/layers';

export class MainStack extends Stack {
    /**
     * MainStack
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link StackProps}
     */
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        /* IAM */
        const iamRoleGroupResources = new IAMRoleGroupResources(
            this,
            'iam-role-group-resources',
        );

        /* LAYER */
        const layerGroupResources = new LayerGroupResources(
            this,
            'layer-group-resources',
        );

        /* LAMBDA */
        const functionGroupResources = new FunctionGroupResources(
            this,
            'lambda-group-resources',
            {
                iamRoleGroupResources: iamRoleGroupResources,
                layerGroupResources: layerGroupResources,
            },
        );

        functionGroupResources.node.addDependency(iamRoleGroupResources);
        functionGroupResources.node.addDependency(layerGroupResources);
    }
}
