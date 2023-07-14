import { DB_DICH_VU } from "@module/repository/db-collection";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Document } from "mongoose";

@Schema({ collection: DB_DICH_VU, timestamps: true })
export class DichVu {
    @Prop({ required: true })
    @IsString()
    ten: string;

    @Prop()
    @IsString()
    @IsOptional()
    moTa?: string;

    @Prop({ required: true })
    @IsNumber()
    giaTien: number;

    @Prop({ required: true })
    @IsString()
    menhGia: string;
}

export type DichVuDocument = DichVu & Document;

export const DichVuSchema = SchemaFactory.createForClass(DichVu);
