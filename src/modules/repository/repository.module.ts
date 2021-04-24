import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FileManagerSchema } from "../file-manager/entities/file-manager.entity";
import { ProfileSchema } from "../profile/entities/profile.entity";
import { SettingSchema } from "../setting/entities/setting.entity";
import { UserSchema } from "../user/entities/user.entity";
import { DB_FILE_MANAGER, DB_PROFILE, DB_SETTING, DB_USER } from "./db-collection";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DB_SETTING, schema: SettingSchema },
            { name: DB_FILE_MANAGER, schema: FileManagerSchema },
            { name: DB_USER, schema: UserSchema },
            { name: DB_PROFILE, schema: ProfileSchema },
        ]),
    ],
    exports: [
        MongooseModule,
    ],
})
export class RepositoryModule { }