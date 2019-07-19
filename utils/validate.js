/**
 * 手机号
 * /^1((3[\d])|(4[5,6,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[1-3,5-8])|(9[1,8,9]))\d{8}$/
 * 
 * 大写字母
 * /^[A-Z]+$/
 * 
 * 日期,如: 2000-01-01
 * /^\d{4}(-)\d{1,2}\1\d{1,2}$/
 * 
 * email地址
 * /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
 * 
 * 国内座机电话,如: 0341-86091234
 * /\d{3}-\d{8}|\d{4}-\d{7}/
 * 
 * 身份证号(15位、18位数字)，最后一位是校验位，可能为数字或字符X
 * /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
 * 
 * 帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合
 * /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
 * 
 * 只包含中文
 * /^[\u4E00-\u9FA5]/
 * 
 * 是否小数
 * /^\d+\.\d+$/
 * 
 * 是否电话格式(手机和座机)
 * /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$/
 * 
 * 是否8位纯数字
 * /^[0-9]{8}$/
 * 
 * 是否html标签
 * /<(.*)>.*<\/\1>|<(.*) \/>/
 * 
 * 是否qq号格式正确
 *  /^[1-9]*[1-9][0-9]*$/
 * 
 * 是否由数字和字母组成
 * /^[A-Za-z0-9]+$/
 * 
 * 是否小写字母组成
 * /^[a-z]+$/
 * 
 * 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
 * /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
 * 
 * 用户名正则，4到16位（字母，数字，下划线，减号）
 * /^[a-zA-Z0-9_-]{4,16}$/
 * 
 * ipv4地址正则
 * /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
 * 
 * 16进制颜色
 * /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
 * 
 * 微信号，6至20位，以字母开头，字母，数字，减号，下划线
 * /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
 * 
 * 中国邮政编码
 * /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/
 * 
 * 只包含中文和数字
 * /^(([\u4E00-\u9FA5])|(\d))+$/
 * 
 * 非字母
 * /[^A-Za-z]/
 */



/**
 * 验证
 * 
 */
const { trim } = require('./index');

/**
 * 身份证号合法性验证
 * 支持15位和18位身份证号
 * 支持地址编码、出生日期、校验位验证
 * @param {*} value 
 */
const idCard = (value) => {
    const city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    value = trim(value);
    let tip = '', pass = true;

    if (!!value) {
        let reg15 = /^\d{8}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{3}$/i;
        let reg = /^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{3}(\d|X)$/i;
        if (value.length === 15 && !reg15.test(value)) {
            pass = false;
        } else if (value.length !== 15 && !reg.test(value)) {
            pass = false;
        } else if (!city[value.substr(0, 2)]) {
            pass = false;
        } else {
            // 18位身份证需要验证最后一位校验位
            if (value.length === 18) {
                value = value.split('');
                // ∑(ai×Wi)(mod 11)
                // 加权因子
                let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                // 校验位
                let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0, ai = 0, wi = 0;
                for (let i = 0; i < 17; i++) {
                    ai = value[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                let last = parity[sum % 11];
                if (parity[sum % 11] != value[17]) {
                    pass = false;
                }
            }
        }
    } else {
        pass = false;
    }

    return pass;
}

/**
 * 匹配中文，英文，或者空格，并且移除空格至少包含2个字符
 * 中文&英文校验，包含数字为错误字段
 * @param {*} value 
 */
const name = (value) => {
    value = trim(value);
    let reg = /^[a-zA-Z\u4e00-\u9fa5\s]{2,100}$/;
    if (!value) return false;

    if (reg.test(value)) {
        if (value.indexOf('\\') !== -1) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

/**
 * 验证手机号码
 * @param {*} value 
 */
const mobile = (value) => {
    // /^1((3[\d])|(4[5,6,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[1-3,5-8])|(9[1,8,9]))\d{8}$/
    // /^(13[0-9]|14[135678]|15[0-9]|16[6]|17[0135678]|18[0-9]|19[89])[0-9]{8}$/;
    let reg = /^1((3[\d])|(4[5,6,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[1-3,5-8])|(9[1,8,9]))\d{8}$/
    return reg.test(value);
}

/**
 * 验证邮箱
 * @param {*} value 
 */
const email = (value) => {
    // /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    // /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return reg.test(value);
}

let obj = { idCard, name, mobile, email }

/**
 * 验证数组
 * @param {*验证数组} rules 
 * @param {*验证值} value 
 * @param {*callback} cb 
 */
const rule = (rules, value, cb) => {
    for (let j = 0; j < rules.length; j++) {
        const { required, pattern, message } = rules[j]
        if (required) {
            if (!value) {
                getApp().showToast(message)
                console.log('message---', message)
                return typeof cb === 'function' && cb(false);
            }
        }
        if (pattern) {
            if (!obj[pattern](value)) {
                getApp().showToast(message)
                console.log('message---', message)
                return typeof cb === 'function' && cb(false);
            }
        }
    }
    return typeof cb === 'function' && cb(true);
}

obj = { ...obj, rule }

module.exports = obj