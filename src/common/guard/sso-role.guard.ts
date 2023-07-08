import { JwtSsoPayload } from "@module/auth/dto/jwt-sso-payload";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class SsoRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const ssoRole =
            this.reflector.get<string[]>("sso-roles", context.getHandler()) ||
            this.reflector.get<string[]>("sso-roles", context.getClass());

        if (ssoRole === undefined) {
            return true;
        }

        const user = context.switchToHttp().getRequest<Request>().user as JwtSsoPayload;
        return user.realm_access.roles.some((role) => ssoRole.includes(role));
        return false;
    }
}
