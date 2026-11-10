import path from 'node:path';

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  publicOrigin: string;
  uploadRoot: string;
  trustProxy: number;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    connectionLimit: number;
  };
}

export class ConfigurationError extends Error {
  constructor(public readonly variable: string, message?: string) {
    super(message ?? `Missing or invalid environment variable: ${variable}`);
    this.name = 'ConfigurationError';
  }
}

const requireValue = (env: NodeJS.ProcessEnv, name: string): string => {
  const value = env[name]?.trim();
  if (!value) throw new ConfigurationError(name);
  return value;
};

const parsePort = (value: string, name: string): number => {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new ConfigurationError(name);
  }
  return port;
};

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => {
  const nodeEnvValue = env.NODE_ENV?.trim() || 'development';
  if (!['development', 'test', 'production'].includes(nodeEnvValue)) {
    throw new ConfigurationError('NODE_ENV');
  }

  const publicOrigin = requireValue(env, 'PUBLIC_ORIGIN');
  let origin: URL;
  try {
    origin = new URL(publicOrigin);
  } catch {
    throw new ConfigurationError('PUBLIC_ORIGIN');
  }
  if (!['http:', 'https:'].includes(origin.protocol) || origin.origin !== publicOrigin.replace(/\/$/, '')) {
    throw new ConfigurationError('PUBLIC_ORIGIN');
  }

  const uploadRoot = requireValue(env, 'UPLOAD_ROOT');
  if (!path.isAbsolute(uploadRoot)) throw new ConfigurationError('UPLOAD_ROOT');
  const forbiddenUploadParents = new Set(['public_html', 'hbuilds', 'versions', 'last-source']);
  if (path.resolve(uploadRoot).split(/[\\/]+/).some((segment) => forbiddenUploadParents.has(segment.toLowerCase()))) {
    throw new ConfigurationError('UPLOAD_ROOT');
  }

  return {
    nodeEnv: nodeEnvValue as AppConfig['nodeEnv'],
    port: parsePort(env.PORT?.trim() || '3000', 'PORT'),
    publicOrigin: origin.origin,
    uploadRoot,
    trustProxy: parsePort(env.TRUST_PROXY?.trim() || '1', 'TRUST_PROXY'),
    db: {
      host: requireValue(env, 'DB_HOST'),
      port: parsePort(env.DB_PORT?.trim() || '3306', 'DB_PORT'),
      name: requireValue(env, 'DB_NAME'),
      user: requireValue(env, 'DB_USER'),
      password: requireValue(env, 'DB_PASSWORD'),
      connectionLimit: 10,
    },
  };
};
