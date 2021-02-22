import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Authorization } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { UserDocument } from "../user/entities/user.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileService } from "./profile.service";

@Controller("profile")
@ApiTags("profile")
@Authorization()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(":id")
  findOne(
    @ReqUser() user: UserDocument,
    @Param("id") id: string,
  ) {
    return this.profileService.userFindById(user, id);
  }

  @Put("me")
  async update(
    @ReqUser() user: UserDocument,
    @Param("id") id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.userUpdate(user, updateProfileDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.profileService.remove(+id);
  }
}
