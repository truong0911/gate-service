import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FileRetrieveService } from "../service/file-retrieve.service";
import { AllowSsoRole } from "@common/decorator/auth.decorator";
import { SsoRole } from "@config/constant";
import { UpdateFileDto } from "../dto/update-file.dto";
import { FileUploadService } from "../service/file-upload.service";
import { ReqUser } from "@common/decorator/user.decorator";
import { JwtSsoPayload } from "@module/auth/dto/jwt-sso-payload";
import { ResponseDto } from "@common/dto/response/response.dto";
import { join } from "path";
import { createReadStream } from "fs";
import { StreamableFile } from "@nestjs/common";

@Controller("file")
@ApiTags("file")
export class FileController {
    constructor(
        private readonly fileRetrieveService: FileRetrieveService,
        private readonly fileUploadService: FileUploadService,
    ) {}

    @Get(":fileId")
    @ApiBearerAuth()
    async retrieveFile(
        @Param("fileId") fileId: string,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<void> {
        await this.fileRetrieveService.retrieveFile(fileId, req, res);
    }

    @Put("cap-phep/:fileId")
    @ApiBearerAuth()
    @AllowSsoRole(SsoRole.ADMIN)
    async capPhep(
        @ReqUser() user: JwtSsoPayload,
        @Param("fileId") fileId: string,
        @Body() dto: UpdateFileDto,
    ): Promise<any> {
        const res = await this.fileUploadService.capPhep(dto, fileId);
        return ResponseDto.create(res);
    }

    @Delete("xoa-file")
    @ApiBearerAuth()
    @AllowSsoRole(SsoRole.USER)
    async xoaFile(@ReqUser() user: JwtSsoPayload, @Param("fileId") fileId: string) {
        return await this.fileUploadService.xoaFile(fileId);
    }

    // @Get()
    // async getFile() {
    //     return await this.fileRetrieveService.getFile();
    // }

    @Get()
    getFile(): StreamableFile {
        const file = createReadStream(join(process.cwd(), "package.json"));
        return new StreamableFile(file);
    }
}
