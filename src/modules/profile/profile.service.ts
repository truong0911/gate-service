import { AccessibleModel } from "@casl/mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageableDto } from "../../common/dto/pageable.dto";
import { FetchQueryOption } from "../../common/pipe/fetch-query-option.interface";
import { DB_PROFILE } from "../repository/db-collection";
import { PublicInfoScope } from "./common/profile.constant";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfilePageableDto } from "./dto/profile-pageable.dto";
import { ProfileDocument } from "./entities/profile.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(DB_PROFILE)
        private readonly profileModel: AccessibleModel<ProfileDocument>,
    ) {}

    private isFobbidenProp(profile: ProfileDocument, prop: string): boolean {
        // TODO: Implement FRIEND scope
        return profile.get(`publicInfo.${prop}`) !== PublicInfoScope.PUBLIC;
    }

    create(createProfileDto: CreateProfileDto) {
        return this.profileModel.create(createProfileDto);
    }

    async findPageable(conditions: any, option: FetchQueryOption): Promise<ProfilePageableDto> {
        const total = this.profileModel.countDocuments(conditions);
        const result = this.profileModel.find(conditions).setOptions(option);
        return Promise.all([total, result]).then((p) => PageableDto.create(option, p[0], p[1]));
    }

    async findAll(query: FetchQueryOption) {
        return this.profileModel.find().setOptions(query);
    }

    async findByUsername(username: string) {
        return this.profileModel.findOne({ username });
    }

    async deleteById(id: string) {
        return this.profileModel.findByIdAndDelete(id);
    }
}
