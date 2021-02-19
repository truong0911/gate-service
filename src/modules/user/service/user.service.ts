import { AccessibleModel } from "@casl/mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_USER } from "../../repository/db-collection";
import { UserAbilityFactory } from "../common/user.ability";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserDocument } from "../entities/user.entity";

@Injectable()
export class UserService {

  constructor(
    @InjectModel(DB_USER)
    private readonly userModel: AccessibleModel<UserDocument>,
    private readonly userAbilityFactory: UserAbilityFactory,
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.userModel
      .create(createUserDto);
  }

  userFindAll(user: UserDocument) {
    return this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "read")
      .find()
      .select("-authorizationVersion -passwordReset -emailVerify");
  }

  userFindById(user: UserDocument, id: string) {
    return this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "read")
      .findOne({ _id: id });
  }

  async userUpdateById(user: UserDocument, id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "update")
      .findOne({ _id: id });
    if (updateUser) {
      Object.assign(updateUser, updateUserDto);
      return updateUser.save();
    }
    return null;
  }

  userDeleteById(user: UserDocument, id: string) {
    return this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "delete")
      .findOneAndRemove({ _id: id });
  }
}
