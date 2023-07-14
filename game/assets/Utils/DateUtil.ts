/**
 * 日期类
 */
export default class DateUtil {

    /**
     * 取当前时间 
     * @returns 
     */
    public static getTime(): number {
        return new Date().getTime();
    }

    /**
     * 时间戳转字符串
     * @retrun '2019-10-10 10:10:10'
     */
    public static formatFullTime(t) {
        return this.format(t, "yyyy-MM-dd HH:mm:ss")
    }

    /** 格式化当前日期 */
    public static format(date_value: number | string, str_format?: string) {
        !str_format && (str_format = "HH:mm:ss");
        !date_value && (date_value = this.getTime());
        const _date = new Date(date_value)
        if (_date instanceof Date) {
            const _dict: any = {
                yyyy: _date.getFullYear(),
                MM: String(_date.getMonth() + 1 + 100).substring(1),
                dd: String(_date.getDate() + 100).substring(1),
                HH: String(_date.getHours() + 100).substring(1),
                mm: String(_date.getMinutes() + 100).substring(1),
                ss: String(_date.getSeconds() + 100).substring(1),
            }
            return str_format.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, function () {
                return _dict[arguments[0]]
            });
        } else {
            return ""
        }
    }
}