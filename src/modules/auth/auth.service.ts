import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeviceDataDocument } from "../device-data/entities/device-data.entity";
import { OneSignalClient } from "../one-signal/one-signal";
import { ONE_SIGNAL_CLIENT } from "../one-signal/one-signal-client";
import { DB_DEVICE_DATA } from "../repository/db-collection";
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceDataModel: Model<DeviceDataDocument>,
        @Inject(ONE_SIGNAL_CLIENT)
        private readonly oneSignalClient: OneSignalClient,

        private readonly jwtService: JwtService,
    ) {}
}
