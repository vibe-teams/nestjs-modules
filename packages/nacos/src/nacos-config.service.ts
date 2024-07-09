import {
  Inject,
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { NacosConfigClient } from 'nacos';
import { NACOS_CONFIG_OPTION } from './constants';
import type { ClientOptions, Listener } from './interface';
// import { NacosConfigClient, ClientOptions } from "nacos";

@Injectable()
export class NacosConfigService implements OnModuleInit, OnModuleDestroy {
  private configClient: NacosConfigClient = null;
  private readonly logger = new Logger(NacosConfigService.name);
  private readonly listeners = new Array<Listener>();
  constructor(
    @Inject(NACOS_CONFIG_OPTION) private readonly options: ClientOptions,
  ) {}

  async onModuleInit() {
    this.configClient = new NacosConfigClient(this.options);
  }

  async onModuleDestroy() {
    for (const { dataId, group, listener } of this.listeners) {
      this.configClient.unSubscribe({ dataId, group }, listener);
    }
    this.listeners.length = 0;
    if (this.configClient) {
      this.configClient.close();
      this.configClient = null;
    }
  }

  subscribe(dataId: string, group: string, listener: (content: any) => void) {
    this.configClient.subscribe({ dataId, group }, listener);
    this.listeners.push({ dataId, group, listener });
    this.logger.log(`Subscribed ${dataId} ${group}`);
  }
}
