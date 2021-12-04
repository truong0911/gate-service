import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import * as crypto from "crypto";
import Minio from "minio";
import { MinioService } from "nestjs-minio-client";
import configuration from "../../config/configuration";
import { BufferedFile, PresignedFileData } from "./minio-client.interface";

@Injectable()
export class MinioClientService {
    private readonly logger: Logger;
    private readonly bucketName: string = configuration().minio.bucketName;

    constructor(private readonly minio: MinioService) {
        this.logger = new Logger("MinioService");
        // THIS IS THE POLICY
        // const policy = {
        //     Version: "2012-10-17",
        //     Statement: [
        //         {
        //             Effect: "Allow",
        //             Principal: {
        //                 AWS: ["*"],
        //             },
        //             Action: ["s3:ListBucketMultipartUploads", "s3:GetBucketLocation", "s3:ListBucket"],
        //             Resource: [`arn:aws:s3:::${this.bucketName}`],
        //         },
        //         {
        //             Effect: "Allow",
        //             Principal: {
        //                 AWS: ["*"],
        //             },
        //             Action: [
        //                 "s3:PutObject",
        //                 "s3:AbortMultipartUpload",
        //                 "s3:DeleteObject",
        //                 "s3:GetObject",
        //                 "s3:ListMultipartUploadParts",
        //             ],
        //             Resource: [`arn:aws:s3:::${this.bucketName}/*`], // Change this according to your bucket name
        //         },
        //     ],
        // };
        // this.client.setBucketPolicy(process.env.MINIO_BUCKET_NAME, JSON.stringify(policy), function (err) {
        //     if (err) throw err;

        //     console.log("Bucket policy set");
        // });
    }

    public get client(): Minio.Client {
        return this.minio.client;
    }

    public async upload(file: BufferedFile, bucketName: string = this.bucketName) {
        // TODO: Check mime type
        const timestamp = Date.now().toString();
        const hashedFileName = crypto.createHash("md5").update(timestamp).digest("hex");

        const extension = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);
        const metaData = {
            "Content-Type": file.mimetype,
        };

        // We need to append the extension at the end otherwise Minio will save it as a generic file
        const fileName = hashedFileName + extension;

        const resPut = await this.client.putObject(bucketName, fileName, file.buffer, undefined, metaData).catch((err) => {
            console.error(err);
            throw new BadRequestException("Upload error");
        });

        return {
            url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`,
        };
    }

    async delete(objetName: string, bucketName: string = this.bucketName) {
        return this.client.removeObject(bucketName, objetName).catch((err) => {
            console.error(err);
            throw new BadRequestException("Upload error");
        });
    }

    async getPresignedUrl(fileData: PresignedFileData, bucketName: string = this.bucketName) {
        const timestamp = Date.now().toString();
        const hashedFileName = crypto.createHash("md5").update(timestamp).digest("hex");

        const extension = fileData.originalname.substring(fileData.originalname.lastIndexOf("."), fileData.originalname.length);

        // We need to append the extension at the end otherwise Minio will save it as a generic file
        const fileName = hashedFileName + extension;
        return this.client.presignedPutObject(bucketName, fileName, 500).catch((err) => {
            this.logger.error("Presigned error");
            throw new BadRequestException("Error uploading");
        });
    }
}
