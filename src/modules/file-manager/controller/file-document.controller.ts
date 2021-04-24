import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiBadRequestDoc } from "../../../common/decorator/api.decorator";
import { Authorization } from "../../../common/decorator/auth.decorator";
import { ReqUser } from "../../../common/decorator/user.decorator";
import { ResponseDto } from "../../../common/dto/response/response.dto";
import { UserDocument } from "../../user/entities/user.entity";
import { AllowMimeTypes, FileManagerError } from "../common/file-manager.constant";
import { FileCreatedResponseDto } from "../dto/response/file-created-response.dto";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";
import { FileUploadService } from "../service/file-upload.service";

@Controller("file/document")
@ApiTags("file-document")
@Authorization()
export class FileDocumentController {
    constructor(
        private readonly fileManagerService: FileUploadService,
    ) { }

    @Post("single")
    @ApiBadRequestDoc(
        {
            errorCode: FileManagerError.BAD_REQUEST_INVALID_MIME_TYPE,
            errorDescription: `<p>Invalid document MIME types<p><p>Valid types:<ul>${AllowMimeTypes.document.map(t => `<li>${t}</li>`).join("")}<ul>`,
        },
    )
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    async uploadImage(
        @ReqUser() user: UserDocument,
        @UploadedFile() file: Express.Multer.File,
        @Body() doc: SingleFileUploadDto,
    ): Promise<FileCreatedResponseDto> {
        const data = await this.fileManagerService.createSingleFile(user, file, doc);
        return ResponseDto.create(data);
    }
}