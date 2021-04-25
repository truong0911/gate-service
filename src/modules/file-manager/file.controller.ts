import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { Authorization } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { UserDocument } from "../user/entities/user.entity";
import { FileRetrieveService } from "./service/file-retrieve.service";

@Controller("file")
@ApiTags("file")
// @Authorization()
export class FileController {
    constructor(
        private readonly fileRetrieveService: FileRetrieveService,
    ) { }

    @Get(":fileId")
    async retrieveFile(
        @ReqUser() user: UserDocument,
        @Param("fileId") fileId: string,
        @Res() res: Response,
    ): Promise<void> {
        await this.fileRetrieveService.retrieveFile(user, fileId, res);
    }
}