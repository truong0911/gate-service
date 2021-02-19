import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ESystemRole } from "../../modules/user/common/user.constant";
import { User } from "../../modules/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const systemRoles =
            this.reflector.get<ESystemRole[]>("system-roles", context.getHandler()) ||
            this.reflector.get<ESystemRole[]>("system-roles", context.getClass());
        if (systemRoles === undefined) {
            return true;
        }
        const user = context.switchToHttp().getRequest().user as User;
        const intersection = systemRoles.filter(role => user.systemRoles.includes(role));
        return intersection.length > 0;
    }
}
