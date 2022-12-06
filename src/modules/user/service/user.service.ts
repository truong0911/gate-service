import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DocumentQuery, mongo } from "mongoose";
import { PageableDto } from "../../../common/dto/pageable.dto";
import { FetchQueryOption } from "../../../common/pipe/fetch-query-option.interface";
import { JwtPayload } from "../../auth/dto/jwt-payload";
import { LoginResultDto } from "../../auth/dto/login-result.dto";
import { Gender } from "../../profile/common/profile.constant";
import { SystemRole } from "../common/user.constant";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserAuthorizedDocument } from "../dto/user-authorized.dto";
import { UserPageableDto } from "../dto/user-pageable.dto";
import { User, UserDocument } from "../entities/user.entity";
import { UserRepository } from "../user.repository";
@Injectable()
export class UserService implements OnModuleInit {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async onModuleInit() {
        await this.initAdmin();
    }

    async initAdmin() {
        const exists = await this.userRepository.exists({ username: "admin" });
        if (!exists) {
            this.logger.verbose("Initializing Administrator");
            await this.userRepository.create({
                username: "admin",
                password: this.configService.get<string>("project.defaultAdminPassword"),
                systemRole: SystemRole.ADMIN,
                email: "administrator@project.com",
                profile: {
                    firstname: "Admin",
                    lastname: "Manager",
                    dateOfBirth: new Date(),
                    gender: Gender.MALE,
                },
            } as User);
        } else {
            this.logger.verbose("Administrator initialized");
        }
    }

    create(createUserDto: CreateUserDto) {
        return this.userRepository.create(createUserDto);
    }

    findById(id: string): DocumentQuery<UserDocument, UserDocument> {
        return this.userRepository.getOne({ _id: id });
    }

    async findPageable(conditions: any, option: FetchQueryOption): Promise<UserPageableDto> {
        const total = this.userRepository.count(conditions);
        const result = this.userRepository
            .get(conditions)
            .setOptions(option)
            .select(
                "-authorizationVersion -passwordReset -emailVerify -password -identifiedDeviceInfo",
            );
        return Promise.all([total, result]).then((p) => PageableDto.create(option, p[0], p[1]));
    }

    userFindAll(user: UserDocument) {
        return this.userRepository.userFindAll(user);
    }

    userFindById(user: UserDocument, id: string) {
        return this.userRepository.userFindById(user, id);
    }

    userUpdateById(user: UserDocument, id: string, updateUserDto: UpdateUserDto) {
        return this.userRepository.userUpdateById(user, id, updateUserDto);
    }

    userDeleteById(user: UserDocument, id: string) {
        return this.userRepository.userDeleteById(user, id);
    }

    async changePassword(
        user: UserAuthorizedDocument,
        changePassword: ChangePasswordDto,
    ): Promise<LoginResultDto> {
        const newUser = await this.userRepository.userChangePassword(user, changePassword);
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                authorizationVersion: user.authorizationVersion.version + 1,
                platform: user.clientPlatform,
            },
            jti: new mongo.ObjectId().toHexString(),
        };
        return { user: newUser, accessToken: this.jwtService.sign(payload) };
    }
}
