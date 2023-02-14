import { PipeTransform } from "@nestjs/common";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";

export class FileUploadTransform
    implements PipeTransform<SingleFileUploadDto, SingleFileUploadDto>
{
    transform(value: SingleFileUploadDto): SingleFileUploadDto {
        value.public = value.public === "true";
        return value;
    }
}
