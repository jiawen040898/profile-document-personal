import { envUtil } from '@pulsifi/fn';

export const DaxtraConfig = {
    url: envUtil.get('DAXTRA_API_URL'),
    account: envUtil.get('DAXTRA_ACCOUNT'),
    jwtSecret: envUtil.get('DAXTRA_JWT_SECRET', ''),
    timed_out: envUtil.getInt('DAXTRA_API_TIMEOUT', 50),
};
