import Constants from 'expo-constants';

const FALLBACK_HOST = '192.168.0.151';
const API_PORT = 8000;

function resolveHost() {
  try {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      if (host) return host;
    }
  } catch (error) {
    // ignore
  }
  return FALLBACK_HOST;
}

export const API_URL = `http://${resolveHost()}:${API_PORT}/api`;
export const API_TIMEOUT = 10000;
