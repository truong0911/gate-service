import { SsoRole } from "@config/constant";
import { JwtSsoPayload } from "@module/auth/dto/jwt-sso-payload";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
    ApiCondition,
    ApiPageableQuery,
    FetchPageableQuery,
    QueryCondition,
} from "../../common/decorator/api.decorator";
import { AllowSsoRole, Authorization } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { ResponseDto } from "../../common/dto/response/response.dto";
import { FetchQueryOption } from "../../common/pipe/fetch-query-option.interface";
import { CreateNotificationAll } from "./dto/create-notification-all.dto";
import { CreateNotificationUser } from "./dto/create-notification-user.dto";
import { NotificationCondition } from "./dto/notification-condition.dto";
import { NotifyReadOne } from "./dto/notify-read-one.dto";
import { NotificationPageableResponse } from "./dto/response/notification-pageable-response.dto";
import { NotificationResponse } from "./dto/response/notification-response.dto";
import { NotifyReadResponse } from "./dto/response/notify-read-response.dto";
import { NotificationService } from "./service/notification.service";
import { NotifyReadService } from "./service/notify-read.service";

@Controller("notification")
@ApiTags("notification")
@Authorization()
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly notifyReadService: NotifyReadService,
    ) {}

    @Get("test")
    async test() {
        return "Hello world";
    }

    @Get("me")
    @ApiCondition()
    @ApiPageableQuery()
    async userGetNotification(
        @ReqUser() u: JwtSsoPayload,
        @QueryCondition(NotificationCondition) condition: any,
        @FetchPageableQuery() option: FetchQueryOption,
    ): Promise<NotificationPageableResponse> {
        const data = await this.notificationService.userGetNotif(u, option, condition);
        return ResponseDto.create(data);
    }

    @Get("pageable")
    @ApiCondition()
    @ApiPageableQuery()
    @AllowSsoRole(SsoRole.ADMIN)
    async getPageable(
        @QueryCondition(NotificationCondition) condition: any,
        @FetchPageableQuery() option: FetchQueryOption,
    ): Promise<NotificationPageableResponse> {
        const data = await this.notificationService.getPageable(condition, option);
        return ResponseDto.create(data);
    }

    @Get(":id/me")
    async userGetById(
        @ReqUser() u: JwtSsoPayload,
        @Param("id") id: string,
    ): Promise<NotificationResponse> {
        const data = await this.notificationService.userGetById(u, id);
        return ResponseDto.create(data);
    }

    @Post("type/all")
    @AllowSsoRole(SsoRole.ADMIN)
    async createNotificationAll(
        @ReqUser() u: JwtSsoPayload,
        @Body() dto: CreateNotificationAll,
    ): Promise<NotificationResponse> {
        const data = await this.notificationService.createNotifAll(dto, u);
        return ResponseDto.create(data);
    }

    @Post("type/user")
    @AllowSsoRole(SsoRole.ADMIN)
    async createNotificationUser(
        @ReqUser() u: JwtSsoPayload,
        @Body() dto: CreateNotificationUser,
    ): Promise<NotificationResponse> {
        const data = await this.notificationService.createNotifUser(dto, u);
        return ResponseDto.create(data);
    }

    @Post("me/read/one")
    async userReadOne(
        @ReqUser() u: JwtSsoPayload,
        @Body() dto: NotifyReadOne,
    ): Promise<NotifyReadResponse> {
        const data = await this.notifyReadService.readOne(u, dto);
        return ResponseDto.create(data);
    }

    @Post("me/read/all")
    async userReadAll(@ReqUser() u: JwtSsoPayload): Promise<NotifyReadResponse> {
        const data = await this.notifyReadService.readAll(u);
        return ResponseDto.create(data);
    }
}
