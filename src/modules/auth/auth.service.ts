import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { mongo } from "mongoose";
import { UserDocument } from "../user/entities/user.entity";
import { UserService } from "../user/service/user.service";
import { JwtPayload } from "./dto/jwt-payload";
import { LoginResponseDTO } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne({ username });
        if (user) {
            const matchPassword = await user.comparePassword(password);
            if (matchPassword) {
                return user;
            }
            throw new UnauthorizedException("Wrong password");
        }
        throw new UnauthorizedException("Username not found");
    }

    async login(user: UserDocument): Promise<LoginResponseDTO> {
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                authorizationVersion: user.authorizationVersion.version,
            },
            jti: new mongo.ObjectId().toHexString(),
        };
        return { accessToken: this.jwtService.sign(payload) };
    }
}
