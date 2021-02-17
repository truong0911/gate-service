import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Authorization } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDocument } from "./entities/user.entity";
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
  findAll(
    @ReqUser() user: UserDocument,
  ) {
    return this.userService
      .findAll(user);
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
    @ReqUser() user: UserDocument,
  ) {
    return this.userService.userFindById(user, id);
  }

  @Put(":id")
  updateById(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.userUpdateById(id, updateUserDto);
  }

  @Delete(":id")
  deleteById(@Param("id") id: string) {
    return this.userService.userDeleteById(id);
  }
}
