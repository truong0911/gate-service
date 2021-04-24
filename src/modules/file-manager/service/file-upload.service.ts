import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_FILE_MANAGER } from "../../repository/db-collection";
import { UserDocument } from "../../user/entities/user.entity";
import { UPLOAD_DIR } from "../common/file-manager.constant";
import { FileCreatedDto } from "../dto/file-created.dto";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";
import { FileManager, FileManagerDocument } from "../entities/file-manager.entity";

@Injectable()
export class FileUploadService {
    constructor(
        @InjectModel(DB_FILE_MANAGER)
        private readonly fileManagerModel: Model<FileManagerDocument>,

        private readonly configService: ConfigService,
    ) { }

    private getFileUrl(fileId: string): string {
        const serverAddress = this.configService.get<string>("server.address");
        const url = `${serverAddress}/${UPLOAD_DIR}/${fileId}`;
        return url;
    }

    async createSingleFile(
        user: UserDocument,
        fileUpload: Express.Multer.File,
        doc: SingleFileUploadDto,
    ): Promise<FileCreatedDto> {
        const fileDoc: FileManager = {
            filename: doc.filename,
            path: fileUpload.path,
            mimetype: fileUpload.mimetype,
            author: {
                username: user.username,
                email: user.email,
                firstname: user.profile?.firstname,
                lastname: user.profile?.lastname,
            },
        };
        const file = await this.fileManagerModel.create(fileDoc);
        file.path = undefined;
        return {
            url: this.getFileUrl(file._id),
            file,
        };
    }
}