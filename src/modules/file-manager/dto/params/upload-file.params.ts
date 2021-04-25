import { IsIn } from "class-validator";
import { ParamOption } from "../../../../common/types";

export class UploadFileParams {
    @IsIn(["0", "1"])
    compress: ParamOption;
}