import {log as ccLog, warn as ccWarn, error as ccError} from "cc"
import { HTML5, DEV, NATIVE } from "cc/env"
import DateUtil from "./DateUtil"

// const APP_DEBUG = console.debug || ccDebug
const APP_LOG = HTML5 ? console.log : (console.log || ccLog)
const APP_WARN = HTML5 ? console.warn : (console.warn || ccWarn)
const APP_ERROR =  HTML5 ? console.error : (console.error || ccError)

/** 日志等级 */
enum LOG_LV {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
}

export default class Logger {
    /** 日式等级开关 */
    private static log_switch:any = undefined
    /** logger筛选 js正则 */
    private static logger_filter_reg = undefined
    /** 对象 */
    private static instance_list = {}
    /** 名称 */
    private name:string = ""

    constructor (name:string) {
        this.name = name
    }
    /**
     * 初始化
     * @param str_lv 日志等级 debug info warn error
     */
    public static init(str_lv) {
        if (this.log_switch) return
        this.logger_filter_reg = HTML5?localStorage.getItem("loggername"):""
        this.log_switch = {}

        switch (str_lv) {
            case LOG_LV.DEBUG:
                this.log_switch[LOG_LV.DEBUG] = true
            case LOG_LV.INFO:
                this.log_switch[LOG_LV.INFO] = true
            case LOG_LV.WARN:
                this.log_switch[LOG_LV.WARN] = true
            case LOG_LV.ERROR:
                this.log_switch[LOG_LV.ERROR] = true
        }
    }
    /** 创建一个logger */
    public static getLogger(name?:string) {
        if (!DEV || !name) {
            name = "app"
        }
        if (!this.instance_list[name]) {
            this.instance_list[name] = new Logger(name)
        }
        return this.instance_list[name]
    }
    /** 错误日志 */
    public error(...args) {
        Logger.log_switch && Logger.log_switch[LOG_LV.ERROR] && this._log(new Error(), APP_ERROR, LOG_LV.ERROR, ...args)
    }
    /** 警告日志 */
    public warn(...args) {
        Logger.log_switch && Logger.log_switch[LOG_LV.WARN] && this._log(null, APP_WARN, LOG_LV.WARN, ...args)
    }
    /** 信息日志 */
    public info(...args) {
        Logger.log_switch && Logger.log_switch[LOG_LV.INFO] && this._log(null, APP_LOG, LOG_LV.INFO, ...args)
    }
    /** 调试日志 */
    public debug(...args) {
        if (Logger.log_switch && Logger.log_switch[LOG_LV.DEBUG]) {
            this._log(new Error(), APP_LOG, LOG_LV.DEBUG, ...args)
        }
    }
    /** 日志 */
    public log(...args) {
        Logger.log_switch && Logger.log_switch[LOG_LV.DEBUG] && this._log(null, APP_LOG, LOG_LV.DEBUG, ...args)
    }
    /**
     * 在堆栈中定位错误或者信息
     * @param index 定位的第几处错误
     * @returns 将定位的位置以类名+错误所在的位置输出
     */
    // private stack(index): string {
    //     const e = new Error();
    //     const lines = e.stack.split('\n');
    //     return lines.length>4?lines[4]:"ERROR"
    // }
    /** 日志输出 */
    private _log(e, log_func, str_lv, ...args) {
        // if (!this.log_switch[str_lv]) return
        if (NATIVE) {
            /** 原生应用没有办法打印obkect 需要json格式化 */
            args = args.map(item=>{
                if (typeof(item) === "object") {
                    return JSON.stringify(item)
                } else {
                    return item
                }
            })
        }
        /** 筛选 */
        if (DEV && this.name && Logger.logger_filter_reg) {
            const r = new RegExp(Logger.logger_filter_reg)
            if (!(r).test(this.name)) {
                return
            }
        }

        let color = ""
        switch (str_lv) {
            case LOG_LV.INFO:
                color = '%ccolor:#66FFFF;'
                break;
            case LOG_LV.WARN:
                color = 'color:#ee7700;'
                break;
            case LOG_LV.ERROR:
                color = 'color:red;'
                break;
            case LOG_LV.DEBUG:
                break
        }
        /** 加入颜色与时间 */
        const param_time = DateUtil.format(DateUtil.getTime(), "HH:mm:ss")
        if (color) {
            args.unshift(`%c[${this.name}-${str_lv}][${param_time}]`, `color:${color};`)
        } else {
            args.unshift(`[${this.name}-${str_lv}][${param_time}]`)
        }

        /** 堆栈 文件位置 */
        // const param_stack = show_statck?Logger.stack(2):""; 
        e && args.push("\n",e)
  
        log_func && log_func.call(this,...args)
    }
}
/** 日志挂到全局 */
(window as any).CLogger = Logger;