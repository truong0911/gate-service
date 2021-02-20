import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../modules/auth/guard/jwt-auth.guard";
import { SystemRole } from "../../modules/user/common/user.constant";
import { RolesGuard } from "../guard/system-role.guard.";

export const SystemRoles = (...systemRoles: SystemRole[]) => SetMetadata("system-roles", systemRoles);

export const Authorization = () => applyDecorators(
    UseGuards(
        JwtAuthGuard,
        RolesGuard,
    ),
    ApiBearerAuth(),
);