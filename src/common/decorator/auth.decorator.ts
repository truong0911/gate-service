import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../modules/auth/guard/jwt-auth.guard";

export const Authorization = () => applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
);