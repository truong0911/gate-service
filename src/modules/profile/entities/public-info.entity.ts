import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class PublicInfo {
    @Prop({ default: false })
    dateOfBirth: boolean;
    @Prop({ default: false })
    gender: boolean;
    @Prop({ default: false })
    phoneNumber: boolean;
    @Prop({ default: false })
    address: boolean;
}

export const PublicInfoSchema = SchemaFactory.createForClass(PublicInfo);
export interface PublicInfoSchemaDocument extends PublicInfo, Document { }