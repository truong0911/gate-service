import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { FileManager } from "../entities/file-manager.entity";

export class UpdateFileDto extends PickType(FileManager, ["filename"]) {
    @IsIn(["No", "Yes"])
    @ApiProperty({ type: String, enum: ["No", "Yes"] })
    state: string;
}
