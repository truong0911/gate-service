import { ObjectId } from "bson";
import { Gender } from "../../../profile/common/profile.constant";
import { SystemRole } from "../../common/user.constant";
import { UserDocument } from "../../entities/user.entity";

export const userStub = (): UserDocument => {
    return {
        _id: new ObjectId("638ad7991f765ce3cbf5f5f2"),
        username: "johndoe",
        password: "user-plain-password",
        email: "johndoe@gmail.com",
        authorizationVersion: {
            version: 1,
        },
        systemRole: SystemRole.USER,
        profile: {
            firstname: "John",
            lastname: "Doe",
            dateOfBirth: new Date("2022-12-03T04:59:05.721Z"),
            gender: Gender.FEMALE,
            phoneNumber: "0123456789",
            address: "Add1",
        },
    } as UserDocument;
};

export const adminStub = (): UserDocument => {
    return {
        _id: new ObjectId("638ad7991f765ce3cbf5f5f1"),
        username: "admin",
        password: "admin-plain-password",
        email: "admin@gmail.com",
        authorizationVersion: {
            version: 1,
        },
        systemRole: SystemRole.ADMIN,
        profile: {
            firstname: "Admin",
            lastname: "Manager",
            dateOfBirth: new Date("2022-11-03T04:59:05.721Z"),
            gender: Gender.FEMALE,
            phoneNumber: "0123456788",
            address: "Add2",
        },
    } as UserDocument;
};
