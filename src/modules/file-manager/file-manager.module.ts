import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileDocumentModule } from "./module/file-document.module";
import { FileImageModule } from "./module/file-image.module";
import { FileRetrieveService } from "./service/file-retrieve.service";

@Module({
  imports: [
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
