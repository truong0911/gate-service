import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { RepositoryModule } from "./modules/repository/model.module";
import { UserModule } from "./modules/user/user.module";
import { ProfileModule } from "./profile/profile.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb://172.26.240.1:27017/simple-project",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        retryDelay: 5000,
      },
    ),
    RepositoryModule,
    UserModule,
    ProfileModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
