import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { SingleFileUploadDto } from "../../file-manager/dto/single-file-upload.dto";


export class SingleFileUploadTransform implements PipeTransform<SingleFileUploadDto, SingleFileUploadDto> {
    transform(
        value: SingleFileUploadDto,
        metadata: ArgumentMetadata,
    ): SingleFileUploadDto {
        if (value.public !== undefined) {
            value.public = Boolean(value.public);
        }
        return value;
    }
}
