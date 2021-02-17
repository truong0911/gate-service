import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../user/service/user.service";
import { JwtPayload } from "../dto/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "secret",
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOne({ _id: payload.sub.userId });
        if (user) {
            if (payload.sub.authorizationVersion !== user.authorizationVersion.version) {
                return undefined;
            }
            return user;
        }
        return undefined;
    }
}