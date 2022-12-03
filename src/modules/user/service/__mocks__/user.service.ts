import { userStub } from "../../test/stubs/user.stub";

export const UserService = jest.fn().mockReturnValue({
    userFindById: jest.fn().mockResolvedValue(userStub()),
});
