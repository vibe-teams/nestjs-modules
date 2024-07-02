import { Injectable } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { InjectRedis } from './redis.decorator';
import { RedisModule } from './redis.module';
import { getRedisConnectionToken } from './utils';

const IP = '127.0.0.1';

describe('RedisModule', () => {
  it('Instance Redis', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          type: 'single',
          options: {
            host: IP,
            port: 6379,
          },
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    await app.init();
    const redisModule = module.get(RedisModule);
    expect(redisModule).toBeInstanceOf(RedisModule);

    await app.close();
  });

  it('Instance Redis client provider', async () => {
    const defaultConnection: string = 'default';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          type: 'single',
          options: {
            host: IP,
            port: 6379,
          },
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    await app.init();
    const redisClient = module.get(getRedisConnectionToken(defaultConnection));
    const redisClientTest = module.get(
      getRedisConnectionToken(defaultConnection),
    );

    expect(redisClient).toBeInstanceOf(Redis);
    expect(redisClientTest).toBeInstanceOf(Redis);

    await app.close();
  });

  it('inject redis connection', async () => {
    @Injectable()
    class TestProvider {
      constructor(@InjectRedis() private readonly redis: Redis) {}

      getClient() {
        return this.redis;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          type: 'single',
          options: {
            host: IP,
            port: 6379,
          },
        }),
      ],
      providers: [TestProvider],
    }).compile();

    const app = module.createNestApplication();
    await app.init();
    const provider = module.get(TestProvider);
    const client = provider.getClient();
    client.set('test_key', 'test_value');
    const result = await client.get('test_key');
    expect(result).toBe('test_value');
    expect(provider.getClient()).toBeInstanceOf(Redis);

    await app.close();
  });
});
