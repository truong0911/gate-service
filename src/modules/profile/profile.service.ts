import { AccessibleModel } from "@casl/mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DB_PROFILE } from "../repository/db-collection";
import { UserDocument } from "../user/entities/user.entity";
import { ProfileAbitityFactory } from "./common/profile.ability";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileDocument } from "./entities/profile.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(DB_PROFILE)
    private readonly profileModel: AccessibleModel<ProfileDocument>,
    private readonly profileAbilityFactory: ProfileAbitityFactory,
  ) { }

  create(createProfileDto: CreateProfileDto) {
    return this.profileModel.create(createProfileDto);
  }

  async findAll() {
    return this.profileModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async userUpdate(
    user: UserDocument,
    updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileModel
      .accessibleBy(this.profileAbilityFactory.createForUser(user))
      .findOneAndUpdate({ username: user.username }, { $set: updateProfileDto });
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
