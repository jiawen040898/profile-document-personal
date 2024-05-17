import { envUtil } from '@pulsifi/fn';

export const PulsifiConfig = {
    alb_url:
        envUtil.get('AWS_ALB_BASE_DNS') ??
        'http://sandbox-api-alb-1374135733.ap-southeast-1.elb.amazonaws.com',
    // domain: envUtil.get('AWS_APIG_BASE_DNS') ?? 'https://sandbox.api.pulsifi.me',
    has_file_scanner_enable:
        envUtil.get('FILE_SCANNER_ENABLED') === 'false'
            ? false
            : Boolean(envUtil.get('FILE_SCANNER_ENABLED')),
    pulsifi_assets_domain:
        envUtil.get('PULSIFI_ASSETS_DOMAIN') ??
        'https://sandbox-assets.pulsifi.me',
};
