import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Authorization, SystemRoles } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { ESystemRole } from "./common/user.constant";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./entities/user.entity";
import { UserService } from "./service/user.service";

@Controller("user")
@ApiTags("user")
@Authorization()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @SystemRoles(ESystemRole.ADMIN)
  async findAll(
    @ReqUser() user: UserDocument,
  ): Promise<User[]> {
    return this.userService
      .userFindAll(user);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @ReqUser() user: UserDocument,
  ): Promise<User> {
    return this.userService.userFindById(user, id);
  }

  @Put(":id")
  @SystemRoles(ESystemRole.ADMIN)
  async updateById(
    @ReqUser() user: UserDocument,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.userUpdateById(user, id, updateUserDto);
  }

  @Delete(":id")
  @SystemRoles(ESystemRole.ADMIN)
  async deleteById(
    @ReqUser() user: UserDocument,
    @Param("id") id: string,
  ): Promise<User> {
    return this.userService.userDeleteById(user, id);
  }
}
