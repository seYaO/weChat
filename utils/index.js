
/**
 * 字符串去前后的空格
 * @param {*} val 
 */
const trim = (val) => {
    return !!val && val.replace(/^\s+|\s+$/gm, '')
}

const typeDeepOf = (obj) => {
    if (typeof obj !== 'object') return typeof obj;
    return Object.prototype.toString.apply(obj).slice(8, -1).toLowerCase();
}

/**
 * 数组去重
 * @param {*} array 
 */
const unique = (array) => {
    if (typeDeepOf(array) !== 'array' || array.length === 0) return array;
    let result = [], obj = {};
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (!obj[item]) {
            result.push(item);
            obj[item] = 1;
        }
    }
    return result;
}

var slice = [].slice, class2type = {}, toString = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (name, i) {
    class2type["[object " + name + "]"] = name.toLowerCase()
})

function type(obj) {
    return obj == null ? String(obj) :
        class2type[toString.call(obj)] || "object"
}

function isFunction(value) {
    return type(value) == "function"
}

function isObject(obj) {
    return type(obj) == "object"
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype
}
var isArray = Array.isArray ||
    function (object) {
        return object instanceof Array
    }

//对象合并
function extend(target) {
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
        deep = target
        target = args.shift()
    }

    args.forEach(function (arg) {
        extended(target, arg, deep)
    })
    return target
}

//
function extended(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                target[key] = {}

            if (isArray(source[key]) && !isArray(target[key]))
                target[key] = []
            extend(deep, target[key], source[key])
        } else if (source[key] !== undefined) target[key] = source[key]
    }
}

//判断是否为空字符串
function isNotEmptyString(str) {
    return typeof str === "string" && str !== "";
}

/**
 * 小数位数处理
 * @param {*} price 
 */
const getDecimal = (value, number) => {
    value = Number(value)
    value = value.toFixed(number);
    value = value.replace(/(\d*)(\.)(\d*)/, (a, b, c, d) => {
        if (d === '00') {
            return b;
        } else {
            if (/\d0/.test(d)) {
                d = d[0];
            }
            return `${b}.${d}`;
        }
    })
    return Number(value);
}

const newline = (str = '') => {
    str = str.replace(/\\n/g, "<br/>")
    str = str.replace(/\r\n/g, "<br/>")
    str = str.replace(/\n/g, "<br/>")
    return str
}

/**
 * 图片地址处理
 * @param {*} url 
 * https://imagev2.xmcdn.com/group29/M07/D2/D6/wKgJWVlgT1iwnJJzAAGe1uBYMMs847.jpg
 * https://bookpic.lrts.me/49ccee6f1b2f4aaebba56d11eea1db56.jpg
 */
const setImageSize = (url) => {
    if (!url) {
        return null;
    }

    if (url.indexOf("imagev2.xmcdn.com") > -1) {
        url = `${url}!strip=1&quality=7&magick=jpg&op_type=5&upload_type=album&name=mobile_large&device_type=ios`
    }

    return url
}


module.exports = {
    extend,
    isNotEmptyString,
    trim,
    unique,
    isFunction,
    isObject,
    isArray,
    getDecimal,
    newline,
    setImageSize,
}