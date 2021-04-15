import { User } from "../../user/entities/user.entity";

export class LoginResultDto {
    user: User;
    accessToken: string;
}