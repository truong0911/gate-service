import { ResponseDto } from "@common/dto/response/response.dto";
import { DichVu } from "@module/dich-vu/entities/dich-vu.entity";

export class DichVuResponse extends ResponseDto<DichVu> {
    data: DichVu;
}
