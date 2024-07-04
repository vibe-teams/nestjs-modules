import {
  type DynamicModule,
  Global,
  Module,
  type Provider,
} from '@nestjs/common';
import { NACOS_CONFIG_OPTION } from './constants';
import type { ClientOptions } from './interface';
import { NacosConfigService } from './nacos-config.service';
@Global()
@Module({})
export class NacosConfigModule {
  static register(options: ClientOptions): DynamicModule {
    const provider = NacosConfigModule.createProvider(options);
    return {
      module: NacosConfigModule,
      providers: [provider, NacosConfigService],
      exports: [NacosConfigService],
    };
  }

  static createProvider(
    nacosConfigOptions: ClientOptions,
  ): Provider<ClientOptions> {
    return {
      provide: NACOS_CONFIG_OPTION,
      useValue: nacosConfigOptions,
    };
  }
}
