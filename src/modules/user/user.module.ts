import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserAbilityFactory } from "./common/user.ability";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get("jwt.exp");
        const signOptions = {...(expiresIn !== undefined && { expiresIn })};
        return {
          secret: configService.get("jwt.secret"),
          signOptions,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserAbilityFactory,
  ],
  exports: [UserService],
})
export class UserModule { }
