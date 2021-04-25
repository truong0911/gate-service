import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request, Response } from "express";
import { Model } from "mongoose";
import { DB_FILE_MANAGER } from "../../repository/db-collection";
import { UserDocument } from "../../user/entities/user.entity";
import { FileManagerDocument } from "../entities/file-manager.entity";
import * as fs from "fs";
import * as path from "path";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../../auth/dto/jwt-payload";

@Injectable()
export class FileRetrieveService {
    constructor(
        @InjectModel(DB_FILE_MANAGER)
        private readonly fileManagerModel: Model<FileManagerDocument>,

        private readonly jwtService: JwtService,
    ) { }

    private validateJwt(bearerToken: string): JwtPayload {
        if (bearerToken?.startsWith("Bearer ")) {
            const jwt = bearerToken.substr(7);
            try {
                return this.jwtService.verify(jwt);
            } catch (err) {
                throw new UnauthorizedException();
            }
        } else {
            throw new UnauthorizedException();
        }
    }

    async retrieveFile(
        fileId: string,
        req: Request,
        res: Response
    ): Promise<void> {
        const retrievedFile = await this.fileManagerModel.findById(fileId);
        if (!retrievedFile) {
            throw new NotFoundException();
        }

        if (retrievedFile.public === false) {
            const payload = this.validateJwt(req.headers.authorization);
            console.log(payload);
        }

        const ext = path.extname(path.basename(retrievedFile.path));
        const newFilename = `${retrievedFile.filename}${ext}`;

        res.setHeader("Content-Type", retrievedFile.mimetype);
        res.setHeader("Content-Disposition", `filename="${newFilename}"`);

        const filePath = path.join(__dirname, "../../../..", retrievedFile.path);
        fs.createReadStream(filePath).pipe(res);
    }
}