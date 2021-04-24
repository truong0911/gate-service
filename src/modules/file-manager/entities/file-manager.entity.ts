import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsIn, IsString, Matches, ValidateNested } from "class-validator";
import { Document } from "mongoose";
import { DB_FILE_MANAGER } from "../../repository/db-collection";
import { AllowMimeTypes, FilenameMatches } from "../common/file-manager.constant";
import { Author, AuthorSchema } from "./author.entity";

@Schema({
    timestamps: true,
    collection: DB_FILE_MANAGER,
})
export class FileManager {
    @IsString()
    @FilenameMatches()
    @Prop({ required: true })
    filename: string;

    @IsString()
    @IsIn([
        ...AllowMimeTypes.image,
        ...AllowMimeTypes.document,
    ])
    @Prop({ required: true })
    mimetype: string;

    @IsString()
    @Prop({ required: true })
    path: string;

    @ValidateNested()
    @Type(() => Author)
    @Prop({ type: raw(AuthorSchema), required: true })
    author: Author;
}

export const FileManagerSchema = SchemaFactory.createForClass(FileManager);
export type FileManagerDocument = FileManager & Document;