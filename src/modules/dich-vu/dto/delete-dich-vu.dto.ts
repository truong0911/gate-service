import { PartialType } from "@nestjs/swagger";
import { CreateDichVuDto } from "./create-dich-vu.dto";

export class DeleteDichVuDto extends PartialType(CreateDichVuDto) {}
