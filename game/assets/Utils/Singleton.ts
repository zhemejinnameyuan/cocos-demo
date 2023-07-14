
/** 单例 */
export default class Singleton {
    /** 单例  */
    private static _instance: Singleton;
    /** 获取单例实例  */
    public static instance<T>(...args):T {
        if (!this._instance) {
            this._instance = this.create(...args)
        }
        return this._instance as T
    }

    /** 创建实例  */
    protected static create(...args) {
        return new Singleton()
    }
}