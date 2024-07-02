import Redis, { type RedisOptions } from 'ioredis';
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from './constants';
import type { RedisModuleOptions } from './interface';

export function getRedisOptionsToken(connection?: string): string {
  return `${connection || REDIS_MODULE_CONNECTION}_${REDIS_MODULE_OPTIONS_TOKEN}`;
}

export function getRedisConnectionToken(connection?: string): string {
  return `${connection || REDIS_MODULE_CONNECTION}_${REDIS_MODULE_CONNECTION_TOKEN}`;
}

export function createRedisConnection(options: RedisModuleOptions){
  const { type, options: commonOptions = {} } = options;

  switch (type) {
    case 'cluster':
      return new Redis.Cluster(options.nodes, commonOptions);
    case 'single': {
      const { url, options: { port, host } = {} } = options;
      const connectionOptions: RedisOptions = { ...commonOptions, port, host };

      return url
        ? new Redis(url, connectionOptions)
        : new Redis(connectionOptions);
    }
    default:
      throw new Error('Invalid configuration');
  }
}
