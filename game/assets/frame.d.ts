
/** 日志 */
declare namespace CLogger {
    export class Logger {
        /** 错误日志 */
        error(...args);
        /** 警告日志 */
        warn(...args);
        /** 信息日志 */
        info(...args);
        /** 普通日志 */
        log(...args);
        /** 调试日志 */
        debug(...args);
    }
    /** 创建一个logger */
    function getLogger(name?: string): Logger; 

    /** 初始化 */
    function init(str_lv): Logger; 
}