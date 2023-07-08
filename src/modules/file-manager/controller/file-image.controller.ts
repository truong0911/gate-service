import { JwtSsoPayload } from "@module/auth/dto/jwt-sso-payload";
import {
    Body,
    Controller,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiBadRequestDoc } from "../../../common/decorator/api.decorator";
import { Authorization } from "../../../common/decorator/auth.decorator";
import { ReqUser } from "../../../common/decorator/user.decorator";
import { ResponseDto } from "../../../common/dto/response/response.dto";
import { AllowMimeTypes, FileManagerError } from "../common/file-manager.constant";
import { MultipleFileUploadDto } from "../dto/multiple-file-upload.dto";
import { UploadFileParams } from "../dto/params/upload-file.params";
import { FileCreatedListResponseDto } from "../dto/response/file-created-list-response.dto";
import { FileCreatedResponseDto } from "../dto/response/file-created-response.dto";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";
import { FileUploadTransform } from "../pipe/file-upload.pipe";
import { FileUploadService } from "../service/file-upload.service";

@Controller("file/image")
@ApiTags("file-image")
@Authorization()
export class FileImageController {
    constructor(private readonly fileManagerService: FileUploadService) {}

    @Post("single")
    @ApiBadRequestDoc({
        errorCode: FileManagerError.BAD_REQUEST_INVALID_MIME_TYPE,
        errorDescription: `<p>Invalid image MIME types<p><p>Valid types:<ul>${AllowMimeTypes.image
            .map((t) => `<li>${t.type}</li>`)
            .join("")}<ul>`,
    })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    @ApiQuery({ name: "compress", required: false, enum: ["0", "1"] })
    async uploadImage(
        @ReqUser() user: JwtSsoPayload,
        @UploadedFile() fileUpload: Express.Multer.File,
        @Body(FileUploadTransform) doc: SingleFileUploadDto,
        @Query() query: UploadFileParams,
    ): Promise<FileCreatedResponseDto> {
        const data = await this.fileManagerService.createSingleImageFile(
            user,
            fileUpload,
            doc,
            query.compress,
        );
        return ResponseDto.create(data);
    }

    @Post("multiple")
    @ApiBadRequestDoc({
        errorCode: FileManagerError.BAD_REQUEST_INVALID_MIME_TYPE,
        errorDescription: `<p>Invalid image MIME types<p><p>Valid types:<ul>${AllowMimeTypes.image
            .map((t) => `<li>${t.type}</li>`)
            .join("")}<ul>`,
    })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FilesInterceptor("files", 10))
    async uploadMultipleImage(
        @ReqUser() user: JwtSsoPayload,
        @UploadedFiles() filesUpload: Express.Multer.File[],
        @Body(FileUploadTransform) doc: MultipleFileUploadDto,
    ): Promise<FileCreatedListResponseDto> {
        const data = await this.fileManagerService.createMultipleFiles(user, filesUpload, doc);
        return ResponseDto.create(data);
    }
}
