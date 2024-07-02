import { Inject } from '@nestjs/common';
import { getRedisConnectionToken } from './utils';

export const InjectRedis = (connection?: string) => {
  return Inject(getRedisConnectionToken(connection));
};
