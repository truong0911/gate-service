import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { RepositoryModule } from "./modules/repository/model.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb://localhost:27017/simple-project",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        retryDelay: 5000,
      },
    ),
    RepositoryModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule { }
