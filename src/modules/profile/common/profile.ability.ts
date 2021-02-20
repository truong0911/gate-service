import { Ability, defineAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "../../../common/types";
import { DB_PROFILE } from "../../repository/db-collection";
import { SystemRole } from "../../user/common/user.constant";
import { UserDocument } from "../../user/entities/user.entity";
import { PublicInfo } from "../entities/public-info.entity";

@Injectable()
export class ProfileAbitityFactory {
    createForUser(user: UserDocument) {
        return defineAbility<Ability<[Action, any]>>((can, cannot) => {
            if (user.systemRoles.includes(SystemRole.ADMIN)) {
                can("manage", DB_PROFILE);
            } else if (user.systemRoles.includes(SystemRole.USER)) {
                can("read", DB_PROFILE, { username: user.username });
                can("update", DB_PROFILE, { username: user.username });
                const info: PublicInfo = {
                    address: true,
                    dateOfBirth: true,
                    gender: true,
                    phoneNumber: true,
                };
                const props = Object.keys(info);
                // tslint:disable-next-line: no-bitwise
                for (let state = 1; state < (1 << props.length); ++state) {
                    const publicProps = [];
                    const conditions: any = {};
                    for (let i = 0; i < props.length; ++i) {
                        // tslint:disable-next-line: no-bitwise
                        const bit = (state >> i) & 1;
                        if (bit === 1) {
                            publicProps.push(props[i]);
                        }
                        conditions[`publicInfo.${props[i]}`] = bit === 1;
                    }
                    console.log(publicProps, conditions);
                    can("read", DB_PROFILE, publicProps, conditions);
                }
            }
        });
    }
}