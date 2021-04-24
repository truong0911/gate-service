import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Matches } from "class-validator";

export const UPLOAD_DIR = "upload";

export enum UploadType {
    IMAGE = "image",
    DOCUMENT = "document",
    DATA = "data",
}

const filenameRegex = /^[ 0-9a-z_-aàáạảãâầấậẩẫăằắặẳẵeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹdđ]{1,100}$/i;

export const FilenameMatches = () => applyDecorators(
    Matches(filenameRegex),
    ApiProperty({ description: `regex: <pre>${String(filenameRegex)}</pre>` })
);

export enum FileManagerError {
    BAD_REQUEST_INVALID_MIME_TYPE = "BAD_REQUEST_INVALID_MIME_TYPE",
}

export const AllowMimeTypes = {
    image: [
        "image/webp",
        "image/img",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
    ],

    document: [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
};