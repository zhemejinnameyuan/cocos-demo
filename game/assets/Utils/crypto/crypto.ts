/**
 * 加密模块 crypto-js,jsencrypt
 */

/**
 * aes密钥检测
 * @param {*} key aes密钥必须是16位
 */
function aesKeyCheck(key: string) {
    if (typeof (key) !== 'string') {
        return "$%!Gd*%3nk)['R2x"
    } else if (key.length > 16) {
        return key.slice(0, 16)
    } else if (key.length < 16) {
        const count = Math.ceil(16 / key.length)
        let new_key = ""
        for (let i = 0; i < count; ++i) {
            new_key += key
        }
        return new_key.slice(0, 16)
    } else {
        return key
    }
}

//aes加密
/**
 * aes加密
 * @param {*} key 加密key
 * @param {*} text 待加密数据
 * @returns string
 */
export function aesEncrypt(key, text) {
    if (!key || !text || !CryptoJS) { return "" }

    try {
        key = CryptoJS.enc.Utf8.parse(aesKeyCheck(key))
        const s_utf8 = CryptoJS.enc.Utf8.parse(text)
        const s_encrytped = CryptoJS.AES.encrypt(s_utf8, key, { iv: key, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        return s_encrytped.toString();
    } catch (err) {
        console.log("aesEncrypt err", err)
        return ""
    }
}

/**
 * aes加密 并把加密后数据中空格替换成+
 * @param {*} key 加密key
 * @param {*} text 待加密字符串
 * @returns string
 */
export function aesEncryptReplaceBlank(key, text) {
    const res = aesEncrypt(key, text)
    return res.replace(/\s/g, "+")
}

/**
 * aes解密
 * @param {*} key 解密key
 * @param {*} text 待解密字符串
 * @returns string
 */
export function aesDecrypt(key, text) {
    if (!key || !text || !CryptoJS) { return "" }
    try {
        key = CryptoJS.enc.Utf8.parse(aesKeyCheck(key))
        const s_decrypt = CryptoJS.AES.decrypt(text, key, { iv: key, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return s_decrypt.toString(CryptoJS.enc.Utf8).toString()
    } catch (err) {
        console.log("aesDecrypt error", err)
        return ""
    }
}

/**
 * rsa 公钥加密
 * @param {*} pub_key 公钥
 * @param {*} text 待加密字符串
 * @returns string
 */
 export function rsaEncryptByPubkey(pub_key, text) {
    try {
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(pub_key)
      return encrypt.encrypt(text)
    } catch (error) {
      return ''
    }
  }

/**
 * base64加密
 * @param {*} string_data 待加密字符数
 * @returns string
 */
export function base64Encode(string_data) {
    try {
        const words = CryptoJS.enc.Utf8.parse(string_data)
        return CryptoJS.enc.Base64.stringify(words)
    } catch (error) {
        return ''
    }
}

/**
 * bae64 解密
 * @param {*} string_data 待解密字符串
 * @returns string
 */
export function base64Decode(string_data) {
    try {
        const words = CryptoJS.enc.Base64.parse(string_data)
        return words.toString(CryptoJS.enc.Utf8)
    } catch (error) {
        return ''
    }
}

