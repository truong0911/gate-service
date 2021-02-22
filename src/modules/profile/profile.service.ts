import { AccessibleModel } from "@casl/mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DB_PROFILE } from "../repository/db-collection";
import { SystemRole } from "../user/common/user.constant";
import { UserDocument } from "../user/entities/user.entity";
import { ProfileAbitityFactory } from "./common/profile.ability";
import { PublicInfoScope } from "./common/profile.constant";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileDocument } from "./entities/profile.entity";
import { PublicInfo } from "./entities/public-info.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(DB_PROFILE)
    private readonly profileModel: AccessibleModel<ProfileDocument>,
    private readonly profileAbilityFactory: ProfileAbitityFactory,
  ) { }

  private isFobbidenProp(profile: ProfileDocument, prop: string): boolean {
      // TODO: Implement FRIEND scope
    return profile.get(`publicInfo.${prop}`) !== PublicInfoScope.PUBLIC;
  }

  private async userGetPublicProfile(user: UserDocument, profile: ProfileDocument) {
    if (user.systemRoles.includes(SystemRole.ADMIN)) {
      return profile;
    } else if (user.systemRoles.includes(SystemRole.USER)) {
      const info: PublicInfo = {
        address: PublicInfoScope.PUBLIC,
        dateOfBirth: PublicInfoScope.PUBLIC,
        gender: PublicInfoScope.PUBLIC,
        phoneNumber: PublicInfoScope.PUBLIC,
      };
      Object.keys(info)
        .filter(prop => this.isFobbidenProp(profile, prop))
        .forEach(fobbidenProp => {
          profile.set(fobbidenProp, undefined);
        });
      return profile;
    } else {
      return null;
    }
  }

  create(createProfileDto: CreateProfileDto) {
    return this.profileModel.create(createProfileDto);
  }

  async findAll() {
    return this.profileModel.find();
  }

  async userFindById(user: UserDocument, id: string) {
    const profile = await this.profileModel.findById(id);
    return this.userGetPublicProfile(user, profile);
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
