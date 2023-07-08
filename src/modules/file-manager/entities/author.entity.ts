import { SsoRole } from "@config/constant";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Document } from "mongoose";

@Schema()
export class Author {
    @IsString()
    @Prop()
    username: string;

    @IsString()
    @Prop()
    firstname: string;

    @IsString()
    @Prop()
    lastname: string;

    @IsString()
    @Prop()
    email: string;

    @IsEnum(SsoRole)
    @Prop({ type: String, enum: Object.values(SsoRole) })
    @IsOptional()
    SsoRole?: SsoRole;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
export type AuthorDocument = Author & Document;
