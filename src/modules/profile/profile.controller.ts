import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiPageableQuery, FetchPageableQuery } from "../../common/decorator/api.decorator";
import { AllowSsoRole, Authorization } from "../../common/decorator/auth.decorator";
import { ResponseDto } from "../../common/dto/response/response.dto";
import { FetchQueryOption } from "../../common/pipe/fetch-query-option.interface";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfilePageableResponseDto } from "./dto/profile-pageable-response.dto";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import { ProfileService } from "./profile.service";
import { SsoRole } from "@config/constant";

@Controller("profile")
@ApiTags("profile")
@Authorization()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post()
    async create(@Body() createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
        const data = await this.profileService.create(createProfileDto);
        return ResponseDto.create(data);
    }

    @Get("pageable")
    @AllowSsoRole(SsoRole.ADMIN)
    @ApiPageableQuery()
    async findPageable(
        @FetchPageableQuery() option: FetchQueryOption,
    ): Promise<ProfilePageableResponseDto> {
        const conditions: any = {};
        const data = await this.profileService.findPageable(conditions, option);
        return ResponseDto.create(data);
    }

    // @Get("me")
    // async findMe(
    //     @ReqUser() user: JwtSsoPayload,
    // ): Promise<ProfileResponseDto> {
    //     const data = await this.profileService.findByUsername(user.username);
    //     return ResponseDto.create(data);
    // }

    @Delete(":id")
    @AllowSsoRole(SsoRole.ADMIN)
    async deleteById(@Param("id") id: string) {
        await this.profileService.deleteById(id);
    }
}
