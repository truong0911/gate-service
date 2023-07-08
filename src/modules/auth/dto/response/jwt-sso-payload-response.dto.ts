import { ResponseDto } from "@common/dto/response/response.dto";
import { JwtSsoPayload } from "../jwt-sso-payload";

export class JwtSsoPayloadResponseDto extends ResponseDto<JwtSsoPayload> {
    data: JwtSsoPayload;
}
