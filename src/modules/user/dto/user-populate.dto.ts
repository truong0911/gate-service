import { Profile } from "../../profile/entities/profile.entity";
import { User, UserDocument } from "../entities/user.entity";

export class UserPopulateDto extends User {
    profile?: Profile;
}

export type UserPopulateDocument = UserPopulateDto & UserDocument;