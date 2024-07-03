import type { ModuleMetadata, Type } from '@nestjs/common';
import type { Deserializer, Serializer } from '@nestjs/microservices';
import type {
  ConsumerConfig,
  ConsumerRunConfig,
  KafkaConfig,
  Message,
  ProducerConfig,
  ProducerRecord,
  RecordMetadata,
  Transaction,
} from 'kafkajs';

export interface IHeaders {
  [key: string]: any;
}
export interface KafkaResponse<T = any> {
  response: T;
  key: string;
  timestamp: string;
  offset: number;
  headers?: IHeaders;
}
export interface KafkaModuleOption {
  name: string;
  options: {
    client: KafkaConfig;
    consumer: ConsumerConfig;
    consumerRunConfig?: ConsumerRunConfig;
    producer?: ProducerConfig;
    deserializer?: Deserializer;
    serializer?: Serializer;
    consumeFromBeginning?: boolean;
    seek?: Record<string, number | 'earliest' | Date>;
    autoConnect?: boolean;
  };
}
export interface KafkaMessageObject extends Message {
  value: any | Buffer | string | null;
  key: any;
}
export interface KafkaMessageSend extends Omit<ProducerRecord, 'topic'> {
  messages: KafkaMessageObject[];
  topic?: string;
}
export interface KafkaModuleOptionsAsync
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<KafkaOptionsFactory>;
  useClass?: Type<KafkaOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<KafkaModuleOption[]> | KafkaModuleOption[];
}
export interface KafkaOptionsFactory {
  createKafkaModuleOptions():
    | Promise<KafkaModuleOption[]>
    | KafkaModuleOption[];
}
export interface KafkaTransaction
  extends Omit<Transaction, 'send' | 'sendBatch'> {
  send(message: KafkaMessageSend): Promise<RecordMetadata[]>;
}

export type KafkaConsumerFunction = (
  response: string,
  key: string,
  offset: string,
  timestamp: string,
  partition: string,
  headers: string,
) => void;
