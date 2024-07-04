import { createParamDecorator } from '@nestjs/common';

export const NacosConfig = createParamDecorator(
  (data: { dataId: string; group?: string }, ctx) => {},
);
