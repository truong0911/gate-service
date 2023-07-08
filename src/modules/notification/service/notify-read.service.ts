import { JwtSsoPayload } from "@module/auth/dto/jwt-sso-payload";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_NOTIFY_READ } from "../../repository/db-collection";
import { NotifyReadType } from "../common/notification.constant";
import { NotifyReadOne } from "../dto/notify-read-one.dto";
import { NotifyReadDocument } from "../entities/notify-read.entity";

@Injectable()
export class NotifyReadService {
    constructor(
        @InjectModel(DB_NOTIFY_READ)
        private readonly notifyReadModel: Model<NotifyReadDocument>,
    ) {}

    async readOne(user: JwtSsoPayload, dto: NotifyReadOne): Promise<NotifyReadDocument> {
        return this.notifyReadModel.findOneAndUpdate(
            {
                userId: String(user.sub),
                notificationId: dto.notificationId,
                type: NotifyReadType.ONE,
            },
            { $set: { readAt: new Date() } },
            { upsert: true, new: true },
        );
    }

    async readAll(user: JwtSsoPayload): Promise<NotifyReadDocument> {
        const userId = String(user.sub);
        return this.notifyReadModel
            .findOneAndUpdate(
                { userId, type: NotifyReadType.ALL },
                { $set: { readAt: new Date() } },
                { upsert: true, new: true },
            )
            .then((res) => {
                this.notifyReadModel.deleteMany({ userId, readAt: { $lt: res.readAt } }).exec();
                return res;
            });
    }
}
