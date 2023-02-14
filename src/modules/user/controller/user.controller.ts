import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
    ApiBadRequestDoc,
    ApiCondition,
    ApiPageableQuery,
    FetchPageableQuery,
    QueryCondition,
} from "../../../common/decorator/api.decorator";
import { AllowSystemRoles, Authorization } from "../../../common/decorator/auth.decorator";
import { ReqUser } from "../../../common/decorator/user.decorator";
import { ResponseDto } from "../../../common/dto/response/response.dto";
import { FetchQueryOption } from "../../../common/pipe/fetch-query-option.interface";
import { LoginResultResponseDto } from "../../auth/dto/response/login-result-response.dto";
import { SystemRole, UserErrorCode } from "../common/user.constant";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserPageableResponseDto } from "../dto/response/user-pageable-response.dto";
import { UserResponseDto } from "../dto/response/user-response.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserCondition } from "../dto/user-condition.dto";
import { UserDocument } from "../entities/user.entity";
import { UserService } from "../service/user.service";

@Controller("user")
@ApiTags("user")
@Authorization()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @AllowSystemRoles(SystemRole.ADMIN)
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const data = await this.userService.create(createUserDto);
        return ResponseDto.create(data);
    }

    @Get("pageable")
    @AllowSystemRoles(SystemRole.ADMIN)
    @ApiCondition()
    @ApiPageableQuery()
    async findPageable(
        @FetchPageableQuery() option: FetchQueryOption,
        @QueryCondition(UserCondition) condition: UserCondition,
    ): Promise<UserPageableResponseDto> {
        const data = await this.userService.findPageable(condition, option);
        return ResponseDto.create(data);
    }

    @Get("me")
    async findMe(@ReqUser() user: UserDocument): Promise<UserResponseDto> {
        const data = await this.userService
            .findById(user._id)
            .populate("profile")
            .select("-authorizationVersion -passwordReset -emailVerify -password");
        return ResponseDto.create(data);
    }

    @Get(":id")
    async findById(
        @Param("id") id: string,
        @ReqUser() user: UserDocument,
    ): Promise<UserResponseDto> {
        const data = await this.userService.userFindById(user, id);
        return ResponseDto.create(data);
    }

    @Put(":id")
    @AllowSystemRoles(SystemRole.ADMIN)
    async updateById(
        @ReqUser() user: UserDocument,
        @Param("id") id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const data = await this.userService.userUpdateById(user, id, updateUserDto);
        return ResponseDto.create(data);
    }

    @Post("me/change/password")
    @ApiBadRequestDoc(
        {
            errorCode: UserErrorCode.BAD_REQUEST_WRONG_OLD_PASSWORD,
            errorDescription: "Mật khẩu cũ không chính xác",
        },
        {
            errorCode: UserErrorCode.BAD_REQUEST_DUPLICATE_NEW_PASSWORD,
            errorDescription: "Mật khẩu cũ trùng với mật khẩu mới",
        },
    )
    async userChangePassword(
        @ReqUser() user: UserDocument,
        @Body() changePassword: ChangePasswordDto,
    ): Promise<LoginResultResponseDto> {
        const data = await this.userService.changePassword(user, changePassword);
        return ResponseDto.create(data);
    }

    @Delete(":id")
    @AllowSystemRoles(SystemRole.ADMIN)
    async deleteById(
        @ReqUser() user: UserDocument,
        @Param("id") id: string,
    ): Promise<UserResponseDto> {
        const data = await this.userService.userDeleteById(user, id);
        return ResponseDto.create(data);
    }
}
