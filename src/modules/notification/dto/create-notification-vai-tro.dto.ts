import { PickType } from "@nestjs/swagger";
import { Notification } from "../entities/notification.entity";

export class CreateNotificationVaiTro extends PickType(Notification, [
    "title",
    "description",
    "htmlContent",
    "content",
    "imageUrl",
    "roles",
]) {}
