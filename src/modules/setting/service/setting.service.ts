import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PeriodOfTime, SettingKey } from "../common/setting.constant";
import { SettingDocument } from "../entities/setting.entity";
import { DB_SETTING } from "./../../repository/db-collection";
import { CreateSettingDTO } from "./../dto/create-setting.dto";
import * as moment from "moment";

@Injectable()
export class SettingService {
    constructor(
        @InjectModel(DB_SETTING)
        private readonly settingModel: Model<SettingDocument>,
    ) { }

    create(createSettingDto: CreateSettingDTO) {
        return this.settingModel.create(createSettingDto);
    }

    getSetting(key: SettingKey) {
        return this.settingModel.findOne({ key });
    }

    async getSettingValue<T = any>(key: SettingKey): Promise<T> {
        const res = await this.settingModel.findOne({ key });
        return res?.value;
    }

    setSetting(data: CreateSettingDTO) {
        return this.settingModel.findOneAndUpdate(
            { key: data.key },
            { $set: data },
            {
                runValidators: true,
                new: true,
                upsert: true,
            },
        );
    }

    async getPeriodOfTime(date: Date) {
        const now = moment(date).format("HH:mm");
        if (now >= "04:00" && now < "13:30") {
            return PeriodOfTime.MORNING;
        } else {
            return PeriodOfTime.AFTERNOON;
        }
    }

    async getWorkTime(date: Date) {
        const periodOfTime = await this.getPeriodOfTime(date);
        let workFromSettingKey: SettingKey;
        let workToSettingKey: SettingKey;
        switch (periodOfTime) {
            case PeriodOfTime.MORNING:
                workFromSettingKey = SettingKey.MORNING_WORK_FROM;
                workToSettingKey = SettingKey.MORNING_WORK_TO;
                break;
            case PeriodOfTime.AFTERNOON:
                workFromSettingKey = SettingKey.AFTERNOON_WORK_FROM;
                workToSettingKey = SettingKey.AFTERNOON_WORK_TO;
                break;
        }
        const [workFrom, workTo] = await Promise.all([
            this.getSettingValue<string>(workFromSettingKey),
            this.getSettingValue<string>(workToSettingKey),
        ]);
        return { periodOfTime, workFrom, workTo };
    }
}