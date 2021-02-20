import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileSchema } from "../profile/entities/profile.entity";
import { UserSchema } from "../user/entities/user.entity";
import { DB_PROFILE, DB_USER } from "./db-collection";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DB_USER, schema: UserSchema },
            { name: DB_PROFILE, schema: ProfileSchema },
        ]),
    ],
    exports: [
        MongooseModule,
    ],
})
export class RepositoryModule { }