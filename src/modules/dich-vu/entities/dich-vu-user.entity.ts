import { DB_DICH_VU, DB_Dich_VU_USER } from "@module/repository/db-collection";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiHideProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Document } from "mongoose";

@Schema({ collection: DB_Dich_VU_USER, timestamps: true })
export class DichVuUser {
    @ApiHideProperty()
    @Prop()
    userId: string;

    @Prop({ required: true })
    @IsString()
    dichVu: string;

    @Prop()
    @IsNumber()
    soLuong: number;
}

export type DichVuUserDocument = DichVuUser & Document;

export const DichVuUserSchema = SchemaFactory.createForClass(DichVuUser);
