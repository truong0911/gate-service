import { SsoRole } from "@config/constant";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AllowSsoRole, Authorization } from "../../common/decorator/auth.decorator";
import { SettingKey } from "./common/setting.constant";
import { CreateSettingDTO } from "./dto/create-setting.dto";
import { Setting } from "./entities/setting.entity";
import { SettingService } from "./service/setting.service";

@Controller("setting")
@ApiTags("setting")
@Authorization()
export class SettingController {
    constructor(private readonly settingService: SettingService) {}

    @Get("/:key")
    async getByKey(@Param("key") key: SettingKey): Promise<Setting> {
        return this.settingService.getSetting(key);
    }

    @Post("upsert")
    @AllowSsoRole(SsoRole.ADMIN)
    async upsertSetting(@Body() data: CreateSettingDTO) {
        return this.settingService.setSetting(data);
    }
}
