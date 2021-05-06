import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";
import * as uuid from "uuid";
import { ErrorData } from "../../common/exception/error-data";
import { ClientPlatform } from "../../config/constant";
import { DeviceData, DeviceDataDocument } from "../device-data/entities/device-data.entity";
import { DB_DEVICE_DATA, DB_USER } from "../repository/db-collection";
import { UserAuthorizedDocument } from "../user/dto/user-authorized.dto";
import { UserDocument } from "../user/entities/user.entity";
import { AuthErrorCode } from "./common/auth.constant";
import { JwtPayload } from "./dto/jwt-payload";
import { LoginMobileRequestDto } from "./dto/login-mobile-request.dto";
import { LoginResultDto } from "./dto/login-result.dto";
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceData: Model<DeviceDataDocument>,

        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ username: username.toLowerCase() });
        if (user) {
            const matchPassword = await user.comparePassword(password);
            if (matchPassword) {
                return user;
            }
            throw ErrorData.Unauthorized(AuthErrorCode.UNAUTHORIZED_WRONG_PASSWORD);
        } else {
            throw ErrorData.Unauthorized(AuthErrorCode.UNAUTHORIZED_USERNAME_NOT_FOUND);
        }
    }

    async loginWeb(user: UserDocument): Promise<LoginResultDto> {
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                authorizationVersion: user.authorizationVersion.version,
                platform: ClientPlatform.WEB,
            },
            jti: new mongo.ObjectId().toHexString(),
        };
        return { user, accessToken: this.jwtService.sign(payload) };
    }

    async loginMobile(user: UserDocument, loginInfo: LoginMobileRequestDto): Promise<LoginResultDto> {
        const jti = uuid.v4();
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                authorizationVersion: user.authorizationVersion.version,
                platform: ClientPlatform.MOBILE,
                deviceId: loginInfo.deviceId,
            },
            jti,
        };
        if (loginInfo.oneSignalId !== undefined) {
            this.deviceData.updateOne(
                { oneSignalId: loginInfo.oneSignalId },
                {
                    $set: {
                        username: user.username,
                        deviceId: loginInfo.deviceId,
                        jti,
                    } as DeviceData,
                },
                { upsert: true }
            ).exec();
        }
        return { user, accessToken: this.jwtService.sign(payload) };
    }

    async logoutMobile(user: UserAuthorizedDocument): Promise<void> {
        this.deviceData.deleteOne({ jti: user.jti }).exec();
    }

}
