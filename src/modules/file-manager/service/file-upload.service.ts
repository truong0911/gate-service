import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as sharp from "sharp";
import * as fs from "fs";
import { DB_FILE_MANAGER } from "../../repository/db-collection";
import { UserDocument } from "../../user/entities/user.entity";
import { AllowMimeTypes, UPLOAD_DIR } from "../common/file-manager.constant";
import { FileCreatedDto } from "../dto/file-created.dto";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";
import { FileManager, FileManagerDocument } from "../entities/file-manager.entity";
import { ParamOption } from "../../../common/types";

@Injectable()
export class FileUploadService {
    constructor(
        @InjectModel(DB_FILE_MANAGER)
        private readonly fileManagerModel: Model<FileManagerDocument>,

        private readonly configService: ConfigService,
    ) { }

    private getFileUrl(fileId: string): string {
        const serverAddress = this.configService.get<string>("server.address");
        const url = `${serverAddress}/file/${fileId}`;
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

    async createSingleImageFile(
        user: UserDocument,
        fileUpload: Express.Multer.File,
        doc: SingleFileUploadDto,
        compress: ParamOption,
    ): Promise<FileCreatedDto> {
        if (compress == "1") {
            const fileType = AllowMimeTypes.image.find(t => t.type === fileUpload.mimetype);
            let p: Promise<Buffer>;
            switch (fileType.ext) {
                case "jpeg":
                    p = sharp(fileUpload.path)
                        .toFormat("jpeg")
                        .jpeg({ quality: 80 })
                        .toBuffer();
                    break;
                case "png":
                    p = sharp(fileUpload.path)
                        .toFormat("png")
                        .png({ quality: 80 })
                        .toBuffer();
                    break;
                case "webp":
                    p = sharp(fileUpload.path)
                        .toFormat("webp")
                        .webp({ quality: 80, alphaQuality: 80 })
                        .toBuffer();
                    break;
            }
            p.then(buffer => {
                fs.writeFile(fileUpload.path, buffer, err => {
                    if (err) {
                        console.error("Error compress file", fileUpload.filename, err);
                    }
                });
            });
        }
        return this.createSingleFile(user, fileUpload, doc);
    }
}