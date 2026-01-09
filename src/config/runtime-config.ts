export interface RuntimeConfig {
  serverUrl: string;
}

let config: RuntimeConfig | null = null;
let configLoaded = false;

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  if (configLoaded) {
    return config!;
  }

  try {
    const response = await fetch('/config.json', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to load config.json: ${response.status}`);
    }

    const runtimeConfig = await response.json();
    config = {
      serverUrl: runtimeConfig.serverUrl,
    };

    if (!config.serverUrl) {
      throw new Error('serverUrl is required in config.json');
    }

    configLoaded = true;
    console.log('[Config] Runtime configuration loaded', config);
    return config;
  } catch (error) {
    console.warn('[Config] Could not load config.json. For Docker: ensure VITE_SERVER_URL is set as environment variable. For development: set value in .env file.', error);
    config = {
      serverUrl: import.meta.env.VITE_SERVER_URL || '',
    };
    configLoaded = true;
    if (!config.serverUrl) {
      console.error('[Config] Configuration incomplete: serverUrl is required');
    }
    return config;
  }
}

export function getRuntimeConfig(): RuntimeConfig {
  if (!configLoaded || !config) {
    throw new Error('Configuration not loaded. Call loadRuntimeConfig() first.');
  }
  return config;
}

export function getConfigValue(key: keyof RuntimeConfig): string {
  const cfg = getRuntimeConfig();
  return cfg[key] || '';
}

export function isRuntimeConfigLoaded(): boolean {
  return configLoaded;
}
