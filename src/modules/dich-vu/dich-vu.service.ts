import { DangKyDichVu } from "./dto/dang-ky-dich-vu.dto";
import { DB_DICH_VU, DB_DICH_VU_HOA_DON, DB_Dich_VU_USER } from "@module/repository/db-collection";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DichVuDocument } from "./entities/dich-vu.entity";
import { CreateDichVuDto } from "./dto/create-dich-vu.dto";
import { UpdateDichVuDto } from "./dto/update-dich-vu.dto";
import { DichVuUserDocument } from "./entities/dich-vu-user.entity";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { HoaDonDocument } from "./entities/dich-vu-hoa-don.entity";
import { CreateHoaDonDto } from "./dto/tao-hoa-don.dto";

@Injectable()
export class DichVuService {
    private readonly logger = new Logger(DichVuService.name);
    constructor(
        @InjectModel(DB_DICH_VU)
        private readonly dichVuModel: Model<DichVuDocument>,
        @InjectModel(DB_Dich_VU_USER)
        private readonly dichVuUserModel: Model<DichVuUserDocument>,
        @InjectModel(DB_DICH_VU_HOA_DON)
        private readonly hoaDonModel: Model<HoaDonDocument>,
        private readonly httpService: HttpService,
    ) {}

    async getById(id: string) {
        const res = await this.dichVuModel.findById(id);
        return res;
    }

    async getDSDichVu() {
        const res = await this.dichVuModel.find();
        return res;
    }

    async create(dto: CreateDichVuDto) {
        const res = await this.dichVuModel.create(dto);
        return res;
    }

    async update(id: string, dto: UpdateDichVuDto) {
        const res = await this.dichVuModel.findByIdAndUpdate(id, dto);
        return res;
    }
    async delete(id: string) {
        const res = await this.dichVuModel.findByIdAndDelete(id);
        return res;
    }

    async dangKyDichVu(dto: DangKyDichVu, userId: string) {
        dto.userId = userId;
        const res = await this.dichVuUserModel.create(dto);
        return res;
    }

    async getDSDichVuDangKy(userIdd: string) {
        const res = await this.dichVuUserModel.find({ userId: userIdd });
        return res;
    }

    async taoHoaDon(userId: string) {
        // const res = await this.dichVuUserModel.find();
        // const dv = this.dichVuModel;
        // let tongTien = 0;
        // res.forEach(async function (ids) {
        //     tongTien += (await dv.findOne({ ten: ids.dichVu })).giaTien * ids.soLuong;
        //     console.log("tt", tongTien);
        // });
        const tongTien = await this.TongTien();
        console.log("all", tongTien);
        const dto = new CreateHoaDonDto();
        const hoaDon = await this.hoaDonModel.find();
        const maNew = hoaDon.length > 0 ? hoaDon[hoaDon.length - 1].ma : 0;
        console.log(maNew);
        dto.tongTien = tongTien;
        dto.ma = maNew + 1;
        dto.idUser = userId;
        return await this.hoaDonModel.create(dto);
    }

    async TongTien() {
        const res = await this.dichVuUserModel.find();
        const dv = this.dichVuModel;
        let tongTien = 0;
        // const danhSachGiaTien = await Promise.all(
        //     res.map(async function (ids) {
        //         return (await dv.findOne({ ten: ids.dichVu })).giaTien * ids.soLuong;
        //     }),
        // );
        for (const ids of res) {
            tongTien += (await dv.findOne({ ten: ids.dichVu })).giaTien * ids.soLuong;
        }
        return tongTien;
    }

    // async taoHoaDon() {
    //     const res = awa
    // }

    // async findAll(): Promise<AxiosResponse<DichVuUser[]>> {
    //     return this.httpService.axiosRef.get("http://192.168.1.41:3000/dich-vu");
    // }

    // async findAll(): Promise<DichVu[]> {
    //     const { data } = await firstValueFrom(
    //         this.httpService.get<Cat[]>("http://localhost:3000/cats").pipe(
    //             catchError((error: AxiosError) => {
    //                 this.logger.error(error.response.data);
    //                 throw "An error happened!";
    //             }),
    //         ),
    //     );
    //     return data;
    // }

    // async yourMethod() {
    //     const response = await this.httpService.get("http://example.com/api/payload").toPromise();
    //     // Xử lý dữ liệu từ response ...
    //     return response.data;
    // }
}
