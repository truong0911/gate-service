import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfigService } from "../../auth/strategy/jwt-config-service";
import { FileController } from "../controller/file.controller";
import { FileDocumentModule } from "./file-document.module";
import { FileImageModule } from "./file-image.module";
import { FileRetrieveService } from "../service/file-retrieve.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    FileDocumentModule,
    FileImageModule,
  ],
  providers: [
    FileRetrieveService,
  ],
  controllers: [
    FileController,
  ],
})
export class FileManagerModule {}
