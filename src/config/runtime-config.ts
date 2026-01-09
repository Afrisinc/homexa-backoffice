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

    // Use runtime config if available, fall back to build-time env vars
    config = {
      serverUrl: runtimeConfig.serverUrl || import.meta.env.VITE_SERVER_URL || '',
    };

    if (!config.serverUrl) {
      console.error('[Config] serverUrl is required but not found');
    }

    configLoaded = true;
    // console.log('[Config] Runtime configuration loaded', config);
    return config;
  } catch (error) {
    console.warn('[Config] Could not load config.json, falling back to build-time variables', error);
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
