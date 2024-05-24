/* eslint-disable @typescript-eslint/naming-convention */
import { Custom } from 'serverless/aws';

import { nodejsVersion } from './variables';

const packager = 'yarn';

export const custom: Custom = {
    esbuild: {
        packager,
    },
    'serverless-layers': {
        packageManager: packager,
        customInstallationCommand:
            'yarn install --pure-lockfile --prod --ignore-optional',
        layersDeploymentBucket:
            'pulsifi-${opt:stage}-${opt:region}-layers-deployment-bucket-1',
        compatibleRuntimes: [nodejsVersion],
        retainVersions: 5,
        dependenciesPath: './layer/nodejs/package.json',
    },
    prune: {
        automatic: true,
        number: 3,
    },
    warmup: {
        default: {
            enabled: false,
        },
    },
};
