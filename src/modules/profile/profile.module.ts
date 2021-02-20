import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { ProfileAbitityFactory } from "./common/profile.ability";

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ProfileAbitityFactory,
  ],
})
export class ProfileModule { }
