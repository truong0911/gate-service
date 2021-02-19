import { Ability, defineAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "../../../common/types";
import { DB_USER } from "../../repository/db-collection";
import { UserDocument } from "../entities/user.entity";
import { ESystemRole } from "./user.constant";

@Injectable()
export class UserAbilityFactory {
    createForUser(user: UserDocument) {
        return defineAbility<Ability<[Action, string]>>((can, cannot) => {
            if (user.systemRoles.includes(ESystemRole.ADMIN)) {
                can("manage", DB_USER);
            }
            if (user.systemRoles.includes(ESystemRole.USER)) {
                can("read", DB_USER, { _id: user._id });
                can("update", DB_USER, { _id: user._id });
            }
        });
    }
}