import { HttpModule, Module } from "@nestjs/common";
import { DichVuController } from "./dich-vu.controller";
import { DichVuService } from "./dich-vu.service";

@Module({
    imports: [HttpModule],
    controllers: [DichVuController],
    providers: [DichVuService],
})
export class DichVuModule {}
