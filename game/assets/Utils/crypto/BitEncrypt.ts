/** 异或加密 */
import {base64Encode, base64Decode} from "./crypto"
export default class BitEncryp {
    /**
     * 解密
     * @param content 加密的内容
     * @param key 解密的key 默认encryptKey
     * @returns 解密后的内容
     */
    public static decode(key: string, hex_string: string): string {
        if (key && hex_string && /^#/.test(hex_string)) {
            hex_string = base64Decode(hex_string.slice(1))
            const key_byte = []
            for (let i=0;i<key.length;++i) {
                key_byte.push(key.charCodeAt(i))
            }
            let k = 0,str_out=""
            for (let j=0; j<hex_string.length; ++j) {
                const c = hex_string.charCodeAt(j)
                const _k = key_byte[k++]
                if (k>=key_byte.length) {k=0}
                str_out += String.fromCharCode(c ^ _k)
            }
            return str_out
        } else {
            return hex_string
        }
    }
    
    /**
     * 加密
     * @param content 未加密内容
     * @param key 解密的key 默认encryptKey
     * @returns 加密后的内容
     */
    public static encode(key: string, content: string): string {
        if (key && content) {
            const key_byte = []
            for (let i=0;i<key.length;++i) {
                key_byte.push(key.charCodeAt(i))
            }
            let out_str = "";
            for (let j=0,k=0; j<content.length; ++j) {
                const c = content.charCodeAt(j)
                const _k = key_byte[k++]
                if (k>=key_byte.length) {k=0}
                out_str += String.fromCharCode(c ^ _k)
            }
            return "#" + base64Encode(out_str)
        } else {
            return content
        }
    }
}