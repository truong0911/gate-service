import { ProfileSchema } from "@module/profile/entities/profile.entity";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DeviceDataSchema } from "../device-data/entities/device-data.entity";
import { FileManagerProvider } from "../file-manager/entities/file-manager.entity";
import { JoinTopicSchema } from "../notification/entities/join-topic.entity";
import { NotificationSchema } from "../notification/entities/notification.entity";
import { NotifyReadSchema } from "../notification/entities/notify-read.entity";
import { TopicSchema } from "../notification/entities/topic/topic.entity";
import { SettingSchema } from "../setting/entities/setting.entity";
import * as db from "./db-collection";
import { DichVuSchema } from "@module/dich-vu/entities/dich-vu.entity";
import { DichVuUserSchema } from "@module/dich-vu/entities/dich-vu-user.entity";
import { HoaDonSchema } from "@module/dich-vu/entities/dich-vu-hoa-don.entity";
import { FileManagerSchema } from "../file-manager/entities/file-manager.entity";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: db.DB_SETTING, schema: SettingSchema },
            { name: db.DB_PROFILE, schema: ProfileSchema },
            { name: db.DB_DEVICE_DATA, schema: DeviceDataSchema },
            { name: db.DB_NOTIFICATION, schema: NotificationSchema },
            { name: db.DB_TOPIC, schema: TopicSchema },
            { name: db.DB_JOIN_TOPIC, schema: JoinTopicSchema },
            { name: db.DB_NOTIFY_READ, schema: NotifyReadSchema },
            { name: db.DB_DICH_VU, schema: DichVuSchema },
            { name: db.DB_Dich_VU_USER, schema: DichVuUserSchema },
            { name: db.DB_DICH_VU_HOA_DON, schema: HoaDonSchema },
            { name: db.DB_FILE_MANAGER, schema: FileManagerSchema },
        ]),
    ],
    providers: [FileManagerProvider],
    exports: [FileManagerProvider, MongooseModule],
})
export class RepositoryModule {}
