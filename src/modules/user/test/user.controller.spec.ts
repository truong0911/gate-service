import { Test } from "@nestjs/testing";
import { UserController } from "../controller/user.controller";
import { UserResponseDto } from "../dto/response/user-response.dto";
import { UserDocument } from "../entities/user.entity";
import { UserService } from "../service/user.service";
import { userStub } from "./stubs/user.stub";

jest.mock("../service/user.service");
describe("User controller", () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        }).compile();

        userController = moduleRef.get<UserController>(UserController);
        userService = moduleRef.get<UserService>(UserService);
        jest.clearAllMocks();
    });

    describe("getUserById", () => {
        describe("when getUserById is called", () => {
            let userResponse: UserResponseDto;
            let user: UserDocument;

            beforeEach(async () => {
                user = userStub();
                userResponse = await userController.findById(user._id, user);
            });

            test("then it should call userService", () => {
                expect(userService.userFindById).toBeCalledWith(user, user._id);
            });

            test("then it should return a user", () => {
                expect(userResponse.data).toEqual(user);
            });
        });
    });
});
