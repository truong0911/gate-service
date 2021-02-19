import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../user/entities/user.entity";
import { DB_USER } from "./db-collection";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DB_USER, schema: UserSchema },
        ]),
    ],
    exports: [
        MongooseModule,
    ],
})
export class RepositoryModule { }