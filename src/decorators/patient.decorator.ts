import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Patient = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.patient;
  },
);
