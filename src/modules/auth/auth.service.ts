import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";
import { DB_USER } from "../repository/db-collection";
import { UserDocument } from "../user/entities/user.entity";
import { JwtPayload } from "./dto/jwt-payload";
import { LoginResponseDTO } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,

        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username });
        if (user) {
            const matchPassword = await user.comparePassword(password);
            if (matchPassword) {
                return user;
            }
            throw new UnauthorizedException("Wrong password");
        } else {
            throw new UnauthorizedException("Username not found");
        }
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
