import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfigService } from "../auth/strategy/jwt-config-service";
import { UserAbilityFactory } from "./common/user.ability";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { UserRepository } from "./user.repository";

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserAbilityFactory],
    exports: [UserService],
})
export class UserModule {}
