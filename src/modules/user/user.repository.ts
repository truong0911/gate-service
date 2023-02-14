import { AccessibleModel } from "@casl/mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ErrorData } from "../../common/exception/error-data";
import { DB_USER } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { UserAbilityFactory } from "./common/user.ability";
import { UserErrorCode } from "./common/user.constant";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserAuthorizedDocument } from "./dto/user-authorized.dto";
import { UserDocument } from "./entities/user.entity";

export class UserRepository extends MongoRepository<UserDocument> {
    /**
     *
     */
    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: AccessibleModel<UserDocument>,
        private readonly userAbilityFactory: UserAbilityFactory,
    ) {
        super(userModel);
    }

    userFindAll(user: UserDocument) {
        return this.userModel
            .accessibleBy(this.userAbilityFactory.createForUser(user), "read")
            .find()
            .select(
                "-authorizationVersion -passwordReset -emailVerify -password -identifiedDeviceInfo",
            );
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

    async userChangePassword(user: UserAuthorizedDocument, changePassword: ChangePasswordDto) {
        const correctOldPassword = await user.comparePassword(changePassword.oldPassword);
        if (!correctOldPassword) {
            throw ErrorData.BadRequest(UserErrorCode.BAD_REQUEST_WRONG_OLD_PASSWORD);
        }
        if (changePassword.newPassword === changePassword.oldPassword) {
            throw ErrorData.BadRequest(UserErrorCode.BAD_REQUEST_DUPLICATE_NEW_PASSWORD);
        }
        user.password = changePassword.newPassword;
        await user.save();
        user.password = undefined;
        return user;
    }
}
