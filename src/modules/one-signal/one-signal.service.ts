import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeviceDataDocument } from "../device-data/entities/device-data.entity";
import { Notification } from "../notification/entities/notification.entity";
import { DB_DEVICE_DATA } from "../repository/db-collection";
import { OneSignalQueueService } from "./one-signal-queue.service";

@Injectable()
export class OneSignalService {
    constructor(
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceDataModel: Model<DeviceDataDocument>,

        private readonly oneSignalQueueService: OneSignalQueueService,
    ) {}

    async sendToAll(notif: Notification) {
        this.oneSignalQueueService.handleSendBatch(this.deviceDataModel.find(), notif);
    }

    sendToUserIds(notif: Notification, userIds: string[]) {
        this.oneSignalQueueService.handleSendBatch(
            this.deviceDataModel.find({ userId: { $in: userIds } }),
            notif,
        );
    }
}
