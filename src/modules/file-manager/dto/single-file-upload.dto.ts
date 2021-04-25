import { ApiProperty, PickType } from "@nestjs/swagger";
import { FileManager } from "../entities/file-manager.entity";

export class SingleFileUploadDto  extends PickType(FileManager, [
    "filename",
    "public",
]) {
    @ApiProperty({ type: "string", format: "binary" })
    file: any;
}