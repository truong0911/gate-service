import { AccessibleModel } from "@casl/mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DB_USER } from "../../repository/db-collection";
import { UserAbilityFactory } from "../common/user.ability";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserDocument } from "../entities/user.entity";
import _ from "lodash";

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

  async findAll(user: UserDocument) {
    return this.userModel
      .find();
  }

  async findOne(conditions: object) {
    return this.userModel
      .findOne(conditions);
  }

  async userFindById(user: UserDocument, id: string) {
    return this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "read")
      .findOne({ _id: id });
  }

  async userUpdateById(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, { $set: updateUserDto }, { runValidators: true, new: true });
  }

  async userDeleteById(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
