import { Document, DocumentQuery, Model, Query, QueryFindOneAndUpdateOptions } from "mongoose";
import { FetchQueryOption } from "../../common/pipe/fetch-query-option.interface";
import { ObjectUtil } from "../../util/object.util";

export abstract class MongoRepository<T extends Document> {
    constructor(
        private readonly model: Model<T>,
    ) { }

    count(condition?: Record<string, unknown>): Query<number> {
        if (ObjectUtil.isEmptyObject(condition) && !this.model.baseModelName) {
            return this.model.estimatedDocumentCount();
        } else {
            return this.model.countDocuments(condition);
        }
    }

    get(condition: Record<string, unknown>): DocumentQuery<T[], T> {
        return this.model.find(condition);
    }

    getOne(condition: Record<string, unknown>): DocumentQuery<T, T> {
        return this.model.findOne(condition);
    }

    getPaging(condition: Record<string, unknown>, option: FetchQueryOption): {
        total: Query<number>,
        data: DocumentQuery<T[], T>,
    } {
        const total = this.count(condition);
        const data = this.model
            .find(condition)
            .setOptions(option);
        return { total, data };
    }

    async create(doc: unknown): Promise<T> {
        return this.model.create(doc);
    }

    async updateOne(conditions: unknown, update: unknown, options?: QueryFindOneAndUpdateOptions): Promise<T> {
        return this.model.findOneAndUpdate(conditions, update, options);
    }

    async updateById(id: string, update: unknown, options?: QueryFindOneAndUpdateOptions): Promise<T> {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    async deleteOne(conditions: unknown): Promise<T> {
        return this.model.findOneAndDelete(conditions);
    }

    async deleteById(id: string): Promise<T> {
        return this.model.findByIdAndDelete(id);
    }
}