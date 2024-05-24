import type { Construct } from 'constructs';

import type { CDKEnvironmentVariables } from '../interfaces';
import { commonEnvironmentVariables } from './common.config';

export const config = (scope: Construct): CDKEnvironmentVariables => ({
    ...commonEnvironmentVariables(scope),
    FILE_SCANNER_ENABLED: 'false',
});
