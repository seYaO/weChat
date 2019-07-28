/**
 * Created by kroll on 2016/9/27.
 */
/**
 * 最大同时请求数量
 * @type {number}
 */
var maxRequestCount = 10;

/**
 * 请求数量
 * @type {number}
 */
var requestCount = 0;

/**
 *  堆积请求池
 * @type {Array}
 */
var pool = [];
/**
 * 接口请求队列（小程序接口请求并发限制兼容）
 *  params = {
 *      data: {},
 *      method: "GET",//默认GET
 *          callback: function (error, res) {
 *      //成功：error:false,失败：error:true;
 *      }
 *  }
 */
function requestData(params) {
    if (requestCount >= maxRequestCount) {
        pool.push(params);
        return false;
    }
    requestCount++;
    let timeout = '';
    let request = wx.request({
        url: params.url,
        data: params.data,
        header: params.header || {
            "Content-Type": "application/json"
        },
        responseType: params.responseType || 'text',
        dataType: params.dataType || 'json',
        method: params.method || 'GET',
        success: function (res) {
            if (params && params.success) {
                params.success(res);
            }
        },
        fail: function (res) {
            params && params.fail && params.fail(res);
        },
        complete: function (res) {
            if (timeout) {
                clearTimeout(timeout);
            }
            params && params.complete && params.complete(res);
            requestCount--;
            var parm = pool.shift();
            if (parm) {
                dataService.requestData(parm);
            }
        }
    });
    if (params.timeout && request && request.abort) {
        timeout = setTimeout(() => {
            request && request.abort()
        }, params.timeout)
    }
    return request;
}

function getLogin() {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res) {
                resolve(res.code);
            },
            fail(err) {
                resolve('');
            }
        })
    })
}

function getUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success(res) {
                resolve(res);
            },
            fail(err) {
                resolve(null);
            }
        });
    })
}

// 是否授权 'scope.userInfo'
function hasUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            fail(err) {
                resolve(false);
            }
        })
    })
}

function getImageInfo(url) {
    return new Promise((resolve, reject) => {
        if (url == '' || !url) {
            resolve('');
            return;
        }
        wx.getImageInfo({
            src: url,
            success(res) {
                resolve(res.path);
            },
            fail(err) {
                resolve('');
            }
        })
    })
}

// 支付
function requestPayment(params) {
    return new Promise((resolve, reject) => {
        if (!params) {
            resolve('');
            return;
        }
        wx.requestPayment({
            // 'timeStamp': res.content.TimeStamp,
            // 'nonceStr': res.content.NonceStr,
            // 'package': res.content.Package,
            // 'signType': 'MD5',
            // 'paySign': res.content.Sign,
            ...params,
            success() {
                resolve(true);
            },
            fail() {
                resolve(false);
            }
        })
    })
}

/**
 * 缓存图片
 * @param {*} url 
 */
const tmpWechatImage = (url) => {
    return new Promise((resolve, reject) => {
        if (url == '' || !url) {
            resolve('');
            return;
        }
        wx.getImageInfo({
            src: url,
            success: function (res) {
                resolve(res.path);
            },
            fail: function (err) {
                resolve('');
            }
        })
    })
}

/**
 * 保存图片到相册
 * @param {*} url 
 */
const saveImage = (url) => {
    wx.saveImageToPhotosAlbum({
        filePath: url,
        success(res) {
            wx.showToast({
                title: '图片保存成功',
            })
        }
    })
}

// 获取DOM节点
const querySelect = (el) => {
    return new Promise((resolve, reject) => {
        let querry = wx.createSelectorQuery();
        if (Object.prototype.toString.call(el).indexOf('String') > 0) {
            el = [el];
        };
        if (Object.prototype.toString.call(el).indexOf('Array') > 0) {
            try {
                el.forEach(v => {
                    querry.select(v).boundingClientRect();
                });
                querry.exec(res => {
                    resolve(res);
                })
            } catch (e) {
                reject(e);
            };
        } else {
            reject('参数只能是String或者Array');
        };
    })
}

// 获取当前页面栈
const getCurrentPages = (cb) => {
    const arr = getCurrentPages()
    console.log(arr)
}

module.exports = {
    requestData,
    getLogin,
    getUserInfo,
    hasUserInfo,
    requestPayment,
    tmpWechatImage,
    saveImage,
    querySelect,
    getCurrentPages,
}