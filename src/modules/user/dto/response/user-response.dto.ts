import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { User, UserDocument } from "../../entities/user.entity";

export class UserResponseDto extends ResponseDto<User> {
    data: UserDocument;
}
