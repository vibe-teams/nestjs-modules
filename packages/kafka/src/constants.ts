const DEBEZIUM_TOPIC_PREFIX = 'device.public.';

export enum Topics {
  USER = `${DEBEZIUM_TOPIC_PREFIX}user`,
}

export const KAFKA_MODULE_OPTIONS = 'KAFKA_MODULE_OPTIONS';

export const KAFKA_SERVICE_NAME = 'KAFKA_SERVICE';
