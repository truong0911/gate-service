import { JwtSsoPayload } from "./jwt-sso-payload";

export class LoginResultDto {
    user: JwtSsoPayload;
    accessToken: string;
}
