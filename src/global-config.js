import { paths } from '@/routes/paths';
import { getRuntimeConfig } from '@/config/runtime-config';
import packageJson from '../package.json';

const runtimeConfig = getRuntimeConfig();

export const CONFIG = {
  appName: 'HOMEXA Backoffice',
  appVersion: packageJson.version,
  serverUrl: runtimeConfig.serverUrl,
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  auth0: {
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ?? '',
    domain: import.meta.env.VITE_AUTH0_DOMAIN ?? '',
    callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL ?? '',
  },
};
