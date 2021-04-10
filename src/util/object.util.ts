export class ObjectUtil {
    static isEmptyObject(obj: any): boolean {
        for (const value in obj) {
            return true;
        }
        return false;
    }
}