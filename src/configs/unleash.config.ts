import { envUtil } from '@pulsifi/fn';

export const UnleashConfig = () => ({
    apiKey: envUtil.get('UNLEASH_API_KEY'),
    apiUrl: envUtil.get('UNLEASH_API_URL'),
    environment: envUtil.get('UNLEASH_ENV'),
    projectId: envUtil.get('UNLEASH_PROJECT_ID'),
});
