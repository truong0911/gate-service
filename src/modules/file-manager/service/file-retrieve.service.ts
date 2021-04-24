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
        const file = await this.fileManagerModel.findById(fileId);
        if (!file) {
            throw new NotFoundException("File not found");
        }
        res.setHeader("content-type", file.mimetype);
        const filePath = path.join(__dirname, "../../../..", file.path);
        fs.createReadStream(filePath).pipe(res);
    }
}