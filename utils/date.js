function parseDate(date) {
    return new Date(Date.parse(date.replace(/-/g, "/")));
}

//是否是正确的日期
function isValidDate(date) {
    if (type(date) === 'string') date = new Date(date.replace(/-/g, '/'));
    if (type(date) === 'number') date = new Date(date);
    return type(date) === 'date' && date.toString() !== 'Invalid Date';
}

/**
 * 格式化时间
 * @param date Date 时间
 * @param format 格式化 "yyyy-MM-dd hh:mm:ss www"=format
 * @returns {string} 格式化后字符串
 */
function format(date, format) {
    if (typeof date == 'string') {
        date = parseDate(date)
    }
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };

    let w = [
        ['日', '一', '二', '三', '四', '五', '六'],
        ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    ];


    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    if (/(w+)/.test(format)) {
        format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()]);
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

/**
 * 获取日期昵称
 * @param {*} date 日期 "2016-11-11"
 * @param {*} type =week 时，显示周...
 * @returns {string} "今天" | "明天" | "后天" | "周.."
 */
function nearDay(date, type = 'week') {
    let nowDate = new Date()
    let weekValue = "周" + "日一二三四五六".split("")[parseDate(date).getDay()]

    if (type == 'week') {
        return weekValue
    }
    switch (date) {
        case format(nowDate, 'yyyy-MM-dd'):
            return "今天";
            break;
        case addDay(1, nowDate, 'yyyy-MM-dd').day:
            return "明天";
            break;
        case addDay(2, nowDate, 'yyyy-MM-dd').day:
            return "后天";
            break;
        default:
            return weekValue;
    }
}

/**
 * 日期后推
 * @param {*} interval 
 * @param {*} number 
 * @param {*} date Date 时间
 * @param {*} formatStr 格式化 "yyyy-MM-dd hh:mm:ss www"=formatStr
 * @returns {object} { date: new Date(), day: '2018-01-01' }
 * 例如 dateAdd('days', 1, '2018-01-01', 'yyyy-MM-dd')
 */
function dateAdd(interval, number, date, formatStr) {
    interval = (interval || '').replace(/\s+/ig, '')
    if (typeof date == 'string') {
        date = parseDate(date)
    }
    date = date || new Date()
    number = Number(number)
    formatStr = formatStr || 'yyyy-MM-dd'

    switch (interval) {
        case 'years':
            date.setFullYear(date.getFullYear() + number);
            break;
        case 'quarters':
            date.setMonth(date.getMonth() + number * 3);
            break;
        case 'months':
            date.setMonth(date.getMonth() + number);
            break;
        case 'weeks':
            date.setDate(date.getDate() + number * 7);
            break;
        case 'days':
            date.setDate(date.getDate() + number);
            break;
        case 'hours':
            date.setHours(date.getHours() + number);
            break;
        case 'minutes':
            date.setMinutes(date.getMinutes() + number);
            break;
        case 'seconds':
            date.setSeconds(date.getSeconds() + number);
            break;
        case 'milliseconds':
            date.setMilliseconds(date.getMilliseconds() + number);
            break;
    }

    return {
        date: date,
        day: format(date, formatStr)
    }

}

/**
 * 根据出生日期字符串得到周岁
 * @param {*} birthday 出生日期
 * @param {*} now 当前日期
 * @returns {number} 20
 */
function fullAge(birthday, now = '') {
    if (typeof birthday == 'string') {
        birthday = parseDate(birthday)
    }
    now = now || new Date()
    if (typeof now == 'string') {
        now = parseDate(now)
    }
    if (!birthday) {
        return -1;
    }

    let returnAge,
        birthYear = format(birthday, 'yyyy'),
        birthMonth = format(birthday, 'MM'),
        birthDay = format(birthday, 'dd'),
        nowYear = format(now, 'yyyy'),
        nowMonth = format(now, 'MM'),
        nowDay = format(now, 'dd');

    if (nowYear == birthYear) {
        returnAge = 0; //同年 则为0岁  
    } else {
        let ageDiff = nowYear - birthYear; //年之差  
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                let dayDiff = nowDay - birthDay; //日之差  
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                let monthDiff = nowMonth - birthMonth; //月之差  
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天  
        }
    }
    return returnAge; //返回周岁年龄 
}

/**
 * 根据日期字符串获取当月总的天数
 * @param {*} dateString 日期
 * @returns {number} 30
 */
function totalDays(date) {
    if (typeof date == 'string') {
        date = parseDate(date)
    }
    let month = data.getMonth()
    month++
    date.setMonth(month);
    date.setDate(0);
    return date.getDate();
}

/**
 * 根据身份证号码获取生日和性别
 * @param {string} idCardNo 身份证号码
 * @returns {number} { birth: '1990-01-01', sex: 'M' }
 */
function birthSex(idCardNo) {
    let tmpStr = '',
        sexStr = '';
    if (idCardNo.length == 15) {
        tmpStr = idCardNo.substring(6, 12);
        tmpStr = "19" + tmpStr;
        tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
        sexStr = parseInt(idCardNo.substr(14, 1), 10) % 2 ? "M" : "F";
    } else {
        tmpStr = idCardNo.substring(6, 14);
        tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
        sexStr = parseInt(idCardNo.substr(16, 1), 10) % 2 ? "M" : "F";
    }
    let age = fullAge(tmpStr)
    return {
        birth: tmpStr,
        sex: sexStr,
        age
    }
}

module.exports = {
    parseDate,
    isValidDate,
    format,
    nearDay,
    dateAdd,
    fullAge,
    totalDays,
    birthSex,
}