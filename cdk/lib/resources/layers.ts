import { Code, type LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { BaseLayer } from '../base/base-layer';

export class LayerGroupResources extends Construct {
    public readonly profileDocumentLayer: LayerVersion;
    /**
     * LayerGroupResources
     *
     * @public profileDocumentLayer {@link LayerVersion}
     *
     * @param scope {@link Construct}
     * @param id
     */
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.profileDocumentLayer = new BaseLayer(
            scope,
            'profile-document-layer',
            {
                layerVersionName: 'profile-document-layer',
                description: 'Profile Document Layer',
                code: Code.fromAsset('layer'),
            },
        );
    }
}
