import { Body, Controller, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiBadRequestDoc } from "../../../common/decorator/api.decorator";
import { Authorization } from "../../../common/decorator/auth.decorator";
import { ReqUser } from "../../../common/decorator/user.decorator";
import { ResponseDto } from "../../../common/dto/response/response.dto";
import { SingleFileUploadTransform } from "../../profile/pipe/single-file-upload.pipe";
import { UserDocument } from "../../user/entities/user.entity";
import { AllowMimeTypes, FileManagerError } from "../common/file-manager.constant";
import { UploadFileParams } from "../dto/params/upload-file.params";
import { FileCreatedResponseDto } from "../dto/response/file-created-response.dto";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";
import { FileUploadService } from "../service/file-upload.service";

@Controller("file/image")
@ApiTags("file-image")
@Authorization()
export class FileImageController {
    constructor(
        private readonly fileManagerService: FileUploadService,
    ) { }

    @Post("single")
    @ApiBadRequestDoc(
        {
            errorCode: FileManagerError.BAD_REQUEST_INVALID_MIME_TYPE,
            errorDescription: `<p>Invalid image MIME types<p><p>Valid types:<ul>${AllowMimeTypes.image.map(t => `<li>${t.type}</li>`).join("")}<ul>`,
        },
    )
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    @ApiQuery({ name: "compress", required: false, enum: ["0", "1"] })
    async uploadImage(
        @ReqUser() user: UserDocument,
        @UploadedFile() fileUpload: Express.Multer.File,
        @Body(SingleFileUploadTransform) doc: SingleFileUploadDto,
        @Query() query: UploadFileParams,
    ): Promise<FileCreatedResponseDto> {
        const data = await this.fileManagerService.createSingleImageFile(user, fileUpload, doc, query.compress);
        return ResponseDto.create(data);
    }
}