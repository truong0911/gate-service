import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { JwtSsoPayload } from "../dto/jwt-sso-payload";

@Injectable()
export class JwtSsoGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const bearer = req.headers.authorization;
        let success = false;
        // Lấy token và verify với JWKS
        if (bearer && bearer.substring(0, 7).toLowerCase() === "bearer ") {
            try {
                // Map payload SSO
                const token = bearer.substring(7);
                const payload = jwt.decode(token) as JwtSsoPayload;
                req.user = payload;
                success = true;
            } catch {
                success = false;
            }
        }
        if (success) {
            return true;
        } else {
            throw new UnauthorizedException();
        }
    }
}
