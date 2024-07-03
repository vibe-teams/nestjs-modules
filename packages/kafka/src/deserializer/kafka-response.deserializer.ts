import type { Deserializer } from '@nestjs/microservices';
import type { KafkaResponse } from '../interface';

export class KafkaResponseDeserializer
  implements Deserializer<any, KafkaResponse>
{
  deserialize(message: any): KafkaResponse {
    const { key, value, timestamp, offset, headers } = message;
    let id = key;
    let response = value;

    if (Buffer.isBuffer(key)) {
      id = Buffer.from(key).toString();
    }

    if (Buffer.isBuffer(value)) {
      response = Buffer.from(value).toString();
    }

    for (const key in headers) {
      if (Buffer.isBuffer(headers[key])) {
        headers[key] = Buffer.from(headers[key]).toString();
      }
    }

    return {
      key: id,
      response,
      timestamp,
      offset,
      headers,
    };
  }
}
