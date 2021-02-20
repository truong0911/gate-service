import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { AuthModule } from "./modules/auth/auth.module";
import { RepositoryModule } from "./modules/repository/repository.module";
import { UserModule } from "./modules/user/user.module";
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("database.connectionUri"),
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        retryDelay: 5000,
      }),
      inject: [ConfigService],
    }),
    RepositoryModule,
    AuthModule,
    UserModule,
    ProfileModule,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule { }
