/**
 * 
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * demo:
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * 
 */
const formatDate = (date, fmt) => {
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}

/**
 * 日期后推
 * @param {*} interval 
 * @param {*} number 
 * @param {*} date 
 */
const dateAdd = (interval, number, date) => {
    interval = (interval || '').replace(/\s+/ig, '');
    date = new Date(date);
    number = Number(number);
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

    return date;
}

/**
 * 日期前推
 * @param {*} interval 
 * @param {*} number 
 * @param {*} date 
 */
const dateSubtract = (interval, number, date) => {
    interval = (interval || '').replace(/\s+/ig, '');
    date = new Date(date);
    number = Number(number);
    switch (interval) {
        case 'years':
            date.setFullYear(date.getFullYear() - number);
            break;
        case 'quarters':
            date.setMonth(date.getMonth() - number * 3);
            break;
        case 'months':
            date.setMonth(date.getMonth() - number);
            break;
        case 'weeks':
            date.setDate(date.getDate() - number * 7);
            break;
        case 'days':
            date.setDate(date.getDate() - number);
            break;
        case 'hours':
            date.setHours(date.getHours() - number);
            break;
        case 'minutes':
            date.setMinutes(date.getMinutes() - number);
            break;
        case 'seconds':
            date.setSeconds(date.getSeconds() - number);
            break;
        case 'milliseconds':
            date.setMilliseconds(date.getMilliseconds() - number);
            break;
    }

    return date;
}

/**
 * 根据出生日期字符串得到出生天数
 * @param {出生日期字符串'1993/9/22'} birthday 
 */
const getFullDay = (birthday) => {
    birthday = birthday.replace(/-/g, '/');
    let now = new Date();
    let birthDay = new Date(birthday);
    return parseInt((now.getTime() - birthDay.getTime()) / 1000 / 3600 / 24);
}

/**
 * 根据出生日期字符串得到周岁
 * @param {出生日期字符串'1993/9/22'} birthday 
 */
const getFullAge = (birthday) => {
    birthday = birthday.replace(/-/g, '/');
    let returnAge; // 返回周岁年龄
    let strBirthdayArr = birthday.split('/');
    let birthYear = strBirthdayArr[0];
    let birthMonth = strBirthdayArr[1];
    let birthDay = strBirthdayArr[2];
    let d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();

    if (nowYear == birthYear) {
        returnAge = 0; // 同年 则为0岁  
    } else {
        let ageDiff = nowYear - birthYear; // 年之差  
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                let dayDiff = nowDay - birthDay; // 日之差  
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                let monthDiff = nowMonth - birthMonth; // 月之差  
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天  
        }
    }

    return returnAge;
}

/**
 * 计算出生日期范围
 * @param {*} minageUtil 
 * @param {*} minage 
 * @param {*} maxageUtil 
 * @param {*} maxage 
 * @param {*} birthStr 
 */
const birthdayToStartAndEnd = (minageUtil, minage, maxageUtil, maxage) => {
    let minDate, maxDate;
    maxage = Number(maxage);
    minage = Number(minage);
    if (maxageUtil == 'Y') {
        maxDate = formatDate(dateAdd('days', 1, dateSubtract('years', maxage + 1, new Date())), 'yyyy-MM-dd');
    } else if (maxageUtil == 'D') {
        maxDate = formatDate(dateAdd('days', 1, dateSubtract('days', maxage, new Date())), 'yyyy-MM-dd');
    } else if (maxageUtil == 'M') {
        maxDate = formatDate(dateSubtract('months', maxage, new Date()), 'yyyy-MM-dd');

    }
    if (minageUtil == 'Y') {
        minDate = formatDate(dateSubtract('years', minage, new Date()), 'yyyy-MM-dd');
    } else if (minageUtil == 'D') {
        if(minage === 0){
            minDate = formatDate(new Date(), 'yyyy-MM-dd');
        }else{
            minDate = formatDate(dateAdd('days', 1, dateSubtract('days', minage, new Date())), 'yyyy-MM-dd');
        }        
    } else if (minageUtil == 'M') {
        minDate = formatDate(dateSubtract('months', minage, new Date()), 'yyyy-MM-dd');
    }

    return { startBirthdayDate: maxDate, endBirthdayDate: minDate };
}

/**
 * 判断日期是否在两个日期之间,包括两个日期
 * @param {*} startDate 
 * @param {*} endDate 
 * @param {*} date 
 */
const isBetween = (startDate, endDate, date) => {
    startDate = startDate.replace(/-/g, '/');
    endDate = endDate.replace(/-/g, '/');
    date = date.replace(/-/g, '/');
    let startTime = new Date(startDate).getTime();
    let endTime = new Date(endDate).getTime();
    let dateTime = new Date(date).getTime();
    if(dateTime >= startTime && dateTime <= endTime){
        return true;
    }
    return false;
}

/**
 * 判断出生日期是否在范围内
 * @param {*} minageUtil 
 * @param {*} minage 
 * @param {*} maxageUtil 
 * @param {*} maxage 
 * @param {*} birthStr 
 */
const judgeInRage = (minageUtil, minage, maxageUtil, maxage, birthStr) => {
    let minDate, maxDate;
    maxage = Number(maxage);
    minage = Number(minage);

    if (maxageUtil == 'Y') {
        maxDate = formatDate(dateSubtract('years', 1, dateSubtract('years', maxage, new Date())), 'yyyy-MM-dd');
        // maxDate = moment().subtract(maxage, 'years').subtract(1, 'years').format('YYYY-MM-DD');
    } else if (maxageUtil == 'D') {
        maxDate = formatDate(dateSubtract('days', maxage, new Date()), 'yyyy-MM-dd');
        // maxDate = moment().subtract(maxage, 'days').format('YYYY-MM-DD');
    } else if (maxageUtil == 'M') {
        maxDate = formatDate(dateSubtract('months', maxage, new Date()), 'yyyy-MM-dd');
        // maxDate = moment().subtract(maxage, 'months').format('YYYY-MM-DD');
    }
    if (minageUtil == 'Y') {
        minDate = formatDate(dateAdd('days', 1, dateSubtract('years', minage, new Date())), 'yyyy-MM-dd');
        // minDate = moment().subtract(minage, 'years').add(1, 'days').format('YYYY-MM-DD');
    } else if (minageUtil == 'D') {
        minDate = formatDate(dateAdd('days', 2, dateSubtract('days', minage, new Date())), 'yyyy-MM-dd');
        // minDate = moment().subtract(minage, 'days').add(2, 'days').format('YYYY-MM-DD');
    } else if (minageUtil == 'M') {
        minDate = formatDate(dateAdd('days', 1, dateSubtract('months', minage, new Date())), 'yyyy-MM-dd');
        // minDate = moment().subtract(minage, 'months').add(1, 'days').format('YYYY-MM-DD');
    }
    // console.log(maxDate, birthStr, minDate)
    // console.log('isBetween------',isBetween(maxDate, minDate, birthStr))
    return isBetween(maxDate, minDate, birthStr)
    // return moment(birthStr).isBetween(maxDate, minDate);
}

/**
 * 根据身份证获取性别和出生日期
 * @param {*} idCard 
 */
const getIdCardToInfo = (idCard) => {
    let birthday, gender, genderNumber;
    // ss.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    if (idCard.length === 15) {
        genderNumber = parseInt(idCard.substr(14, 1));
        birthday = idCard.substring(6, 12);
        birthday = `19${birthday}`;
    } else {
        genderNumber = parseInt(idCard.substr(16, 1));
        birthday = idCard.substring(6, 14);
    }

    birthday = birthday.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    if(genderNumber % 2 === 0){
        gender = 'F';
    }else{
        gender = 'M';
    }

    return {
        birthday,
        gender,
        returnAge: getFullAge(birthday)
    }
}

module.exports = {
    formatDate,
    dateAdd,
    dateSubtract,
    getFullDay,
    getFullAge,
    birthdayToStartAndEnd,
    isBetween,
    judgeInRage,
    getIdCardToInfo,
}