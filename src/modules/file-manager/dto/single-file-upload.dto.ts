import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { FilenameMatches } from "../common/file-manager.constant";

export class SingleFileUploadDto {
    @ApiProperty({ type: "string", format: "binary" })
    file: any;

    @IsString()
    @FilenameMatches()
    filename: string;
}