import { ResponseDto } from "@common/dto/response/response.dto";
import { HoaDon } from "@module/dich-vu/entities/dich-vu-hoa-don.entity";

export class HoaDonResponse extends ResponseDto<HoaDon> {
    data: HoaDon;
}
