import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ReqUser = createParamDecorator((prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return prop ? user && user[prop] : user;
});
