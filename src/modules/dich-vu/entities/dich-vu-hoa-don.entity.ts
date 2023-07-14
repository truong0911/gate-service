import { DB_DICH_VU_HOA_DON } from "@module/repository/db-collection";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Document } from "mongoose";

@Schema({ collection: DB_DICH_VU_HOA_DON, timestamps: true })
export class HoaDon {
    @Prop({ required: true })
    @IsNumber()
    ma: number;

    @Prop({ required: true })
    @IsString()
    @IsOptional()
    idUser: string;

    @Prop({ required: true })
    @IsNumber()
    tongTien: number;

    // @Prop({ required: true })
    // @IsString()
    // menhGia: string;
}

export type HoaDonDocument = HoaDon & Document;

export const HoaDonSchema = SchemaFactory.createForClass(HoaDon);
