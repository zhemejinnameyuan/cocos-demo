/** 是否为undefined | null */
export function isNil(v) {
    return v === undefined || v === null
}
/** 是否是对象 */
export function isObject(v) {
    return !isNil(v) && typeof v === 'object'
  }
/** 是否是字典 */
export function isDict(v) {
    return isObject(v) && v.length === undefined
  }
/** 是否是数组 */
export function isArray(v) {
    return !isNil(v) && Array.isArray(v)
}
/** 判断变量是否是空值 */
export function isEmpty(v) {
    if (isNil(v)) {
        return true
    } else {
        switch (typeof (v)) {
            case 'string':
                return v == ""
            case 'object':
                if (isArray(v)) {
                    return v.length == 0
                } else {
                    return Object.keys(v).length == 0
                }
            default:
                return false
        }
    }
}


/**
 * 返回dic keys
 * @param obj 
 * @param parmas {sort}
 * @returns 
 */
export function keys(obj: object, parmas: any = {}) {
    const { sort } = parmas
    const _keys = Object.keys(obj).filter(k => {
        return obj[k] !== undefined
    })
    if (sort) {
        if (typeof (sort) === "function") {
            _keys.sort(sort)
        } else {
            _keys.sort((l, r) => {
                return l === r ? 0 : l < r ? -1 : 1
            })
        }
    }
    return _keys
}
/** 比较两个对象是否相等 */
export function isEqual(new_val: any, old_val: any, params: any = {}) {
    const is_new_nil = isNil(new_val)
    const is_old_nil = isNil(old_val)
    const { show_log } = params
    if (is_new_nil && !is_old_nil || !is_new_nil && is_old_nil) {
        // show_log && console.log("not Equal (nil)", new_val, old_val)
        return false
    } else if (is_new_nil && is_old_nil) {
        return true
    }
    const new_type = typeof (new_val)
    const old_type = typeof (old_val)
    if (new_type !== old_type) {
        // show_log && console.log("not Equal (type)", new_type, old_type, new_val, old_val)
        return false
    } else {
        switch (new_type) {
            case "object":
                if (Array.isArray(new_val)) {
                    if (new_val.length === old_val.length) {
                        for (let i = 0; i < new_val.length; ++i) {
                            if (!isEqual(new_val[i], old_val[i], params)) {
                                return false
                            }
                        }
                        return true
                    } else {
                        // show_log && console.log("not Equal (array length)", new_val, old_val)
                        return false
                    }
                } else {
                    const new_class_name = Object.prototype.toString.call(new_val)
                    const old_class_name = Object.prototype.toString.call(old_val)
                    if (new_class_name === old_class_name) {
                        const new_keys = keys(new_val, { sort: true })
                        const old_keys = keys(old_val, { sort: true })
                        if (isEqual(new_keys, old_keys, params)) {
                            for (let k in new_keys) {
                                if (!isEqual(new_val[new_keys[k]], old_val[old_keys[k]], params)) {
                                    return false
                                }
                            }
                            return true
                        }
                    } else {
                        // show_log && console.log("not Equal (object classname)", new_class_name, old_class_name, new_val, old_val)
                        return false
                    }
                }
            default:
                const ret = new_val === old_val
                // !ret && show_log && console.log("not Equal (value)", new_val, old_val)
                return ret
        }
    }
}

/**
 * 深度拷贝
 * @param obj 源对象
 * @param deep 深度 防止对象太大导致拷贝出bug 限制为5层
 * @returns 
 */
export function deepClone(obj, _deep: number | undefined = undefined) {
    const deep: number = (!isNil(_deep) && (_deep as number) < 5) ? (_deep as number) : 5

    if (deep <= 0) {
        return obj
    }
    let target = {}
    try {
        if (isDict(obj)) {
            for (let i in obj) {
                target[i] = deepClone(obj[i], deep - 1);
            }
        } else if (isArray(obj)) {
            target = []
            for (let i = 0; i < obj.length; i++) {
                target[i] = deepClone(obj[i], deep - 1);
            }
        } else {
            target = obj
        }
        return target;
    } catch (e) {
        // console.log("functions deepClone error", e)
        return obj
    }
}
/**
 * 对象合并 注意合并对象只是浅拷贝
 * @param {object} target 目标对象 合并后target会改变
 * @param  {...object} source 
 * @return {object} 合并后的对象
 */
export function assign(target, ...source) {
    return Object.assign(target, ...source)
}
/**
 * 对象合并 深度拷贝
 * @param target 
 * @param source 
 * @returns 
 */
export function assignDeep(target, ...source) {
    if (!target) { target = {} }
    const ttt = source.map(o => deepClone(o))
    return assign(target, ...ttt)
}
/**
* 获取变量子属性
* @param {dict} dic
* @param {string} key
* @param {any} deault_data
*/
export function get(dic: any, key: string, deault_data: any = undefined) {
    if (!isObject(dic) || isEmpty(key)) return dic || deault_data
    if (typeof (key) != "string") {
        key = String(key).toString()
    }
    const k_arr = key.split(".")
    const length = k_arr.length;
    let index = 0
    let _o = dic
    while (!isNil(_o) && index < length) {
        _o = _o[k_arr[index++]];
    }
    return (!isNil(_o) && index && index == length) ? _o : deault_data
}

/**
 * 设置子属性 没有则创建一个子属性
 * @param {dict} dict
 * @param {string} key
 * @param {any} data
 */
export function set(dict: any, key: string, data: any) {
    if (isEmpty(key)) {
        dict = data
        return dict
    }
    if (!isDict(dict)) {
        dict = {}
    }
    key = key.toString()
    const k_arr = key.split(".")
    const length = k_arr.length;
    let _o = dict
    let k = ""
    for (let i = 0; i < length; i++) {
        k = k_arr[i]
        if (i == length - 1) {
            _o[k] = data
            break
        } else if (!isDict(_o[k])) {
            _o[k] = {}
        }
        _o = _o[k]
    }
    return dict
}
/**
 * 数组过滤 回调函数true则保留
 * @param {*} arr 源数据
 * @param {*} cb 过滤函数
 * @return {Arrary} 返回结果
 */
export function filter(arr: any, cb?: Function) {
    const result: Array<any> = []
    for (let k in arr) {
        const new_item = cb ? cb(arr[k]) : undefined
        new_item && result.push(new_item)
    }
    return result
}
/**
 * 返回在[min,max]之间的值包含min和max
 * @param {*} number
 * @param {*} min
 * @param {*} max
 */
export function clamp(number: number, min: number, max?: number) {
    if (max === undefined) {
        max = min
    }
    if (min === undefined) {
        return number
    } else {
        if (max < min) {
            max = min
        }
        return Math.max(min, Math.min(number, max))
    }
}

/**
 * 导出一个对象的方法(不包含以下划线开头的方法)
 * @param obj 
 */
export function exportFunction(obj: Object) {
    const new_func_obj = {}
    if (typeof (obj) === "object") {
        for (let k in obj) {
            if (typeof (obj[k]) === "function" && !(/^_/.test(k))) {
                new_func_obj[k] = obj[k].bind(obj)
            }
        }
    }
    return new_func_obj
}