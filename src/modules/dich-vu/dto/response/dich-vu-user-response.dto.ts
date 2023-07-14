import { ResponseDto } from "@common/dto/response/response.dto";
import { DichVuUser } from "@module/dich-vu/entities/dich-vu-user.entity";

export class DichVuUserResponse extends ResponseDto<DichVuUser> {
    data: DichVuUser;
}
