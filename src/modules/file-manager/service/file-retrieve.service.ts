import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Response } from "express";
import { Model } from "mongoose";
import { DB_FILE_MANAGER } from "../../repository/db-collection";
import { UserDocument } from "../../user/entities/user.entity";
import { FileManagerDocument } from "../entities/file-manager.entity";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FileRetrieveService {
    constructor(
        @InjectModel(DB_FILE_MANAGER)
        private readonly fileManagerModel: Model<FileManagerDocument>,
    ) { }

    async retrieveFile(
        user: UserDocument,
        fileId: string,
        res: Response
    ): Promise<void> {
        const retrievedFile = await this.fileManagerModel.findById(fileId);
        if (!retrievedFile) {
            throw new NotFoundException();
        }
        const ext = path.extname(path.basename(retrievedFile.path));
        const newFilename = `${retrievedFile.filename}${ext}`;
        res.setHeader("Content-Type", retrievedFile.mimetype);
        res.setHeader("Content-Disposition", `filename="${newFilename}"`);
        const filePath = path.join(__dirname, "../../../..", retrievedFile.path);
        fs.createReadStream(filePath).pipe(res);
    }
}