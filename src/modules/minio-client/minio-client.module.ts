import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MinioModule } from "nestjs-minio-client";
import { MinioClientService } from "./minio-client.service";

@Module({
    imports: [
        MinioModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configSerVice: ConfigService) => ({
                endPoint: configSerVice.get<string>("minio.endPoint"),
                port: configSerVice.get<number>("minio.port"),
                useSSL: false,
                accessKey: configSerVice.get<string>("minio.accessKey"),
                secretKey: configSerVice.get<string>("minio.secretKey"),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MinioClientService],
    exports: [MinioClientService],
})
export class MinioClientModule {}
