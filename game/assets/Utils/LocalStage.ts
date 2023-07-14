/**
 * 本地数据存储
 */
import Singleton from "./Singleton"
import { get, set, deepClone, isNil, isDict } from "./function"
import BitEncryp from "./crypto/BitEncrypt"
import { sys } from "cc"
import CLogger from "./log"
const Logger = CLogger.getLogger()
/**  */
const KEY_PREFIX = "s%4Y"
/** 默认是否开启数据加密 */
const DEFAULT_USE_CRYPTO=true

export default class LocalStorage extends Singleton {
    /** 临时数据 */
    private cache_tmp = {}
    /** 持久化数据*/
    private cache = {}
    /** name */
    private name: string = ""

    constructor(name: string) {
        super()
        this.name = name
    }

    /** 创建对象 */
    protected static create(...args: any[]): LocalStorage {
        return new LocalStorage("LS")
    }

    /**
     * 同步 获取运行内存数据
     * @param key 数据key
     * @param params {default_data:不存时返回默认数据,data_key:取某个子key} 
     * @returns value
     */
    public getCache(key: string, params: any = {}): any {
        if (key = this._checkKey(key), !key) return
        const { default_data, data_key } = params
        return get(this.cache_tmp[key], data_key, default_data)
    }
    /**
     * @param key key
     * @param data 数据
     * @param params {data_key:将数据存到指定的子key中} 
     */
    public setCache(key: string, data: any, params: any = {}) {
        if (key = this._checkKey(key), !key) return
        const { data_key } = params
        this.cache_tmp[key] = set(this.cache_tmp[key], data_key, data)
    }
    /**
     * 清除缓存
     * @param key 
     * @returns 
     */
    public clearCache(key: string | undefined) {
        if (key) {
            key = this._checkKey(key)
            delete this.cache_tmp[key]
        } else {
            for (let k in this.cache_tmp) {
                if (k.indexOf(this.name + '_') === 0) {
                    delete this.cache_tmp[k]
                }
            }
        }
    }
    /**
   * 同步 获取持久化数据
   * @param key 数据key
   * @param params { default_data:不存时返回默认数据,data_key:取某个子key } 
   * @returns value
   */
    getItem(key: string, params: any = {}): any {
        if (!key) return
        key = this.name + '_' + key
        let ret = undefined
        if (this.cache[key]) {
            ret = deepClone(this.cache[key])
        } else {
            try {
                const json_str = sys.localStorage.getItem(key)
                ret = this._decodeData(json_str)
            } catch (error) {
                console.error("storage error:", error)
            }
            if (!isNil(ret)) {
                this.cache[key] = ret
            }
        }

        const { default_data, data_key } = params
        if (!isNil(ret)) {
            if (data_key && isDict(ret)) {
                return get(ret, data_key, default_data)
            } else {
                return ret
            }
        } else {
            return default_data
        }
    }
    /**
     * 异步 存储数据
     * @param key :key
     * @param data :数据
     * @param params :{encrypt:是否加密,data_key:将数据存到指定的子key中,only_cache:true不写入storage} 
     */
    setItem(key: string, data: any, params: any = {}) {
        if (!key) return
        key = this.name + '_' + key
        const { encrypt=DEFAULT_USE_CRYPTO, data_key, only_cache } = params
        !this.cache.hasOwnProperty(key) && data_key && this.getItem(key)
        if (isNil(data)) {
            if (data_key) {
                isDict(this.cache[key]) && delete this.cache[key][data_key]
            } else {
                return this.removeItem(key)
            }
        } else {
            this.cache[key] = set(this.cache[key], data_key, deepClone(data))
        }

        if (only_cache) return
        const en_data: any = this._encodeData(this.cache[key], encrypt)
        setTimeout(() => {
            sys.localStorage.setItem(key, en_data)
        }, 0)
    }
    /**
     * 同步 删除
     * @param key 
     * @returns 
     */
    removeItem(key: string,): void {
        if (!key) return
        key = this.name + '_' + key
        delete this.cache[key]
        sys.localStorage.removeItem(key)
    }
    /**
     * 异步 清空自己命名空间下面的所有数据
     */
    clear() {
        setTimeout(() => {
            for (let m = 0; m < localStorage.length; m++) {
                const k: string = localStorage.key(m) || ''
                const len = this.name.length + 1
                if (k.indexOf(this.name + '_') === 0) {
                    this.removeItem(k.slice(len))
                }
            }
        }, 0)
    }
    /**
     * 异步 清理app下面所有的存储数据
     */
    clearAll() {
        setTimeout(() => {
            this.cache = {}
            sys.localStorage.clear()
        }, 0)
    }
    /** key检测 */
    private _checkKey(key: string): string {
        return key ? `${this.name}_${key}` : ''
    }
    private _decodeData(text: string) {
        if (text) {
            const value = JSON.parse(text)
            if (value.t) {
                const key = `${value.t}_${KEY_PREFIX}`.substr(-16)
                const de_text = BitEncryp.decode(key, value.d)
                try {
                    return JSON.parse(de_text)
                } catch (error) {
                    Logger.error("decode faild!", error)  
                }
                return undefined
            } else {
                return value.d
            }
        } else {
            return undefined
        }
    }
    /**
     * 存储数据处理
     * @param data 明文数据
     * @param is_encrypt 是否加密
     */
    private _encodeData(data: any, is_encrypt: boolean) {
        if (is_encrypt) {
            try {
                const str_data = JSON.stringify(data)
                const t = new Date().getTime()
                const key = `${t}_${KEY_PREFIX}`.substr(-16)
                const en_str = BitEncryp.encode(key, str_data)
                return JSON.stringify({ d: en_str, t })
            } catch (error) {
                console.warn("_dataCheck 数据存储格式化错误", error, data);
                return ""
            }
        } else {
            return JSON.stringify({ d: data })
        }
    }
}