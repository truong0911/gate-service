import { Module } from "@nestjs/common";
import { UserAbilityFactory } from "./common/user.ability";
import { UserService } from "./service/user.service";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserAbilityFactory,
  ],
  exports: [UserService],
})
export class UserModule {}
