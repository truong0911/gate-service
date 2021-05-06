import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DeviceDataSchema } from "../device-data/entities/device-data.entity";
import { FileManagerProvider } from "../file-manager/entities/file-manager.entity";
import { ProfileSchema } from "../profile/entities/profile.entity";
import { SettingSchema } from "../setting/entities/setting.entity";
import { UserSchema } from "../user/entities/user.entity";
import * as db from "./db-collection";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: db.DB_SETTING, schema: SettingSchema },
            { name: db.DB_USER, schema: UserSchema },
            { name: db.DB_PROFILE, schema: ProfileSchema },
            { name: db.DB_DEVICE_DATA, schema: DeviceDataSchema },
        ]),
    ],
    providers: [
        FileManagerProvider,
    ],
    exports: [
        FileManagerProvider,
        MongooseModule,
    ],
})
export class RepositoryModule { }