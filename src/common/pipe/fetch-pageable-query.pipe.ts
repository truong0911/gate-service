import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { FetchPageableParam } from "./fetch-pageable-param";
import { FetchQueryOption } from "./fetch-query-option.interface";

@Injectable()
export class FetchPageableQueryPipe
    implements PipeTransform<FetchPageableParam, Promise<FetchQueryOption>>
{
    async transform(value: FetchPageableParam): Promise<FetchQueryOption> {
        const param: FetchPageableParam = plainToClass(FetchPageableParam, value);
        const errors = await validate(param);
        if (errors.length > 0) {
            throw new BadRequestException("Invalid fetch params");
        }
        const result: FetchQueryOption = {};
        if (param.page && param.limit) {
            const page = parseInt(param.page, 10);
            const limit = parseInt(param.limit, 10);
            result.page = page;
            result.limit = limit;
            result.skip = (page - 1) * limit;
        }
        result.select = param.select && JSON.parse(param.select);
        result.sort = (param.sort && JSON.parse(param.sort)) || { _id: -1 };
        return result;
    }
}
