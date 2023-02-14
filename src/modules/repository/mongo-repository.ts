import { FetchQueryOption } from "@common/pipe/fetch-query-option.interface";
import {
    Document,
    DocumentQuery,
    FilterQuery,
    Model,
    QueryFindOneAndUpdateOptions,
    UpdateQuery,
} from "mongoose";
import { PageableDto } from "../../common/dto/pageable.dto";
import { ObjectUtil } from "../../util/object.util";

export abstract class MongoRepository<T extends Document> {
    constructor(private readonly model: Model<T>) {}

    async count(condition?: FilterQuery<T>): Promise<number> {
        if (ObjectUtil.isEmptyObject(condition) && !this.model.baseModelName) {
            return this.model.estimatedDocumentCount();
        } else {
            return this.model.countDocuments(condition);
        }
    }

    get(condition: FilterQuery<T>): DocumentQuery<T[], T> {
        return this.model.find(condition);
    }

    getOne(condition: FilterQuery<T>): DocumentQuery<T, T> {
        return this.model.findOne(condition);
    }

    getPagingComponent(
        condition: FilterQuery<T>,
        option: FetchQueryOption,
    ): {
        total: Promise<number>;
        data: DocumentQuery<T[], T>;
    } {
        const total = this.count(condition);
        const data = this.model.find(condition).setOptions(option);
        return { total, data };
    }

    async getPaging(
        condition: FilterQuery<T>,
        option: FetchQueryOption,
    ): Promise<PageableDto<any>> {
        const { data: p1, total: p2 } = this.getPagingComponent(condition, option);
        const [result, total] = await Promise.all([p1, p2]);
        return PageableDto.create(option, total, result);
    }

    async create(doc: any): Promise<T> {
        return this.model.create(doc);
    }

    async updateOne(
        condition: FilterQuery<T>,
        update: UpdateQuery<T>,
        options?: QueryFindOneAndUpdateOptions,
    ): Promise<T> {
        return this.model.findOneAndUpdate(condition, update, options);
    }

    async updateById(
        id: string,
        update: UpdateQuery<T>,
        options?: QueryFindOneAndUpdateOptions,
    ): Promise<T> {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    async deleteOne(condition: FilterQuery<T>): Promise<T> {
        return this.model.findOneAndDelete(condition);
    }

    async exists(conditions: any): Promise<boolean> {
        return this.model.exists(conditions);
    }

    async deleteById(id: string): Promise<T> {
        return this.model.findByIdAndDelete(id);
    }
}
