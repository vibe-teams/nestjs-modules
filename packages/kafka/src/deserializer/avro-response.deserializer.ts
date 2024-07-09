import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import type { SchemaRegistryAPIClientOptions } from '@kafkajs/confluent-schema-registry/dist/@types';
import type { SchemaRegistryAPIClientArgs } from '@kafkajs/confluent-schema-registry/dist/api';
import { Logger } from '@nestjs/common/services/logger.service';
import type { Deserializer } from '@nestjs/microservices';
import type { KafkaResponse } from '../interface';
import { KafkaResponseDeserializer } from './kafka-response.deserializer';

export class KafkaAvroResponseDeserializer
  implements Deserializer<any, Promise<KafkaResponse>>
{
  protected registry: SchemaRegistry;
  protected logger = new Logger(KafkaAvroResponseDeserializer.name);
  protected fallback: KafkaResponseDeserializer;

  constructor(
    config: SchemaRegistryAPIClientArgs,
    options?: SchemaRegistryAPIClientOptions,
  ) {
    this.registry = new SchemaRegistry(config, options);
    this.fallback = new KafkaResponseDeserializer();
  }

  async deserialize(message: any): Promise<KafkaResponse> {
    const { value, key, timestamp, offset } = message;
    const decodeResponse = {
      response: value,
      key,
      timestamp,
      offset,
    };

    try {
      decodeResponse.key =
        message.key?.length > 0
          ? await this.registry.decode(message.key)
          : null;
      decodeResponse.response = message.value
        ? await this.registry.decode(message.value)
        : message.value;
    } catch (e) {
      this.logger.error(e);
      // Fall back to the normal kafka deserialize.
      const msg = this.fallback.deserialize(message);
      Object.assign(decodeResponse, msg);
    }

    return decodeResponse;
  }
}
