import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DichVuService } from "./dich-vu.service";
import { ResponseDto } from "@common/dto/response/response.dto";
import { DichVuResponse } from "./dto/response/dich-vu-response.dto";
import { CreateDichVuDto } from "./dto/create-dich-vu.dto";
import { AllowSsoRole, Authorization } from "@common/decorator/auth.decorator";
import { SsoRole } from "@config/constant";
import { ReqUser } from "@common/decorator/user.decorator";
import { JwtSsoPayload } from "@module/auth/dto/jwt-sso-payload";
import { UpdateDichVuDto } from "./dto/update-dich-vu.dto";
// import { DeleteDichVuDto } from "./dto/delete-dich-vu.dto";
import { DangKyDichVu } from "./dto/dang-ky-dich-vu.dto";
import { DichVuUserResponse } from "./dto/response/dich-vu-user-response.dto";
import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs/internal/Observable";
import { AxiosResponse } from "axios";
import { HoaDonResponse } from "./dto/response/hoa-don-response.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("dich-vu")
@ApiTags("dich-vu")
@Authorization()
export class DichVuController {
    constructor(
        private readonly dichVuService: DichVuService,
        private readonly httpService: HttpService,
    ) {}

    @Post()
    @AllowSsoRole(SsoRole.ADMIN)
    async create(
        @Body() dto: CreateDichVuDto,
        @ReqUser() user: JwtSsoPayload,
    ): Promise<DichVuResponse> {
        const res = await this.dichVuService.create(dto);
        return ResponseDto.create(res);
    }

    // @Get("/:id")
    // async getById(@Param("id") id: string): Promise<DichVuResponse> {
    //     const res = await this.dichVuService.getById(id);
    //     return ResponseDto.create(res);
    // }

    @Get()
    async getDSDichVu() {
        const res = await this.dichVuService.getDSDichVu();
        return ResponseDto.create(res);
    }

    @Get("/dsDVDangKy")
    @AllowSsoRole(SsoRole.USER)
    async getDSDichVuDangKy(@ReqUser() user: JwtSsoPayload) {
        const res = await this.dichVuService.getDSDichVuDangKy(user.sub);
        return ResponseDto.create(res);
    }

    @Put(":id")
    @AllowSsoRole(SsoRole.ADMIN)
    async update(
        @Param("id") id: string,
        @Body() dto: UpdateDichVuDto,
        @ReqUser() user: JwtSsoPayload,
    ): Promise<DichVuResponse> {
        const res = await this.dichVuService.update(id, dto);
        return ResponseDto.create(res);
    }

    @Delete(":id")
    @AllowSsoRole(SsoRole.ADMIN)
    async delete(
        @Param("id") id: string,
        // @Body() dto: DeleteDichVuDto,
        @ReqUser() user: JwtSsoPayload,
    ): Promise<DichVuResponse> {
        const res = await this.dichVuService.delete(id);
        return ResponseDto.create(res);
    }

    @Post("register")
    @AllowSsoRole(SsoRole.USER)
    async dangKyDichVu(
        @Body() dto: DangKyDichVu,
        @ReqUser() user: JwtSsoPayload,
    ): Promise<DichVuUserResponse> {
        const res = await this.dichVuService.dangKyDichVu(dto, user.sub);
        return ResponseDto.create(res);
    }

    @Get("/payment")
    async yourMethod(): Promise<Observable<AxiosResponse<any, any>>> {
        console.log("1234");
        try {
            const response = await this.httpService
                .get("http://192.168.1.89:3000/api/#/payment")
                .toPromise();
            // const response = await this.httpService.axiosRef.get(
            //     "http://192.168.1.89:3000/payment",
            // );
            console.log("res:", response.data);
            console.log("res2:", response);
            return response.data;
        } catch (error) {
            // xử lý lỗi khi yêu cầu không thành công
            throw new Error("error");
        }
    }

    @Post("taoHoaDon")
    @AllowSsoRole(SsoRole.USER)
    async taoHoaDon(@ReqUser() user: JwtSsoPayload) {
        const res = await this.dichVuService.taoHoaDon(user.sub);
        return ResponseDto.create(res);
    }

    @Get("/:id")
    async getById(@Param("id") id: string): Promise<DichVuResponse> {
        const res = await this.dichVuService.getById(id);
        return ResponseDto.create(res);
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }
}
