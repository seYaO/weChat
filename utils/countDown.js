/**
 * 引用
 * const countDown = require('../../utils/countDown');
 * 
 * 使用
 * countDown({
 *     starTime: nowTime,
 *     endTime,
 *     nowTime,
 *     updateFn(t, b) {
 *         let countDownTime = `${t.hour <= 9 ? '0' + t.hour : t.hour}小时${t.minute <= 9 ? '0' + t.minute : t.minute}分${t.second <= 9 ? '0' + t.second : t.second}秒`;
 *         _this.setData({ countDownTime });
 *     },
 *     nobeginFn() { },
 *     ingFn() { },
 *     endFn() {
 *         console.log('倒计时结束')
 *     }
 * });
 * 
 */




// -----------

/**
 * 倒计时
 */
const countDown = (options) => {
    let opt = {
        setUp: 1000, // 刷新时间间隔
        microse: 3000, // 时间长度
        // 更新方法
        updateFn: function (timeObj) { },
        // 回调
        callBackFn: function () { }
    };

    Object.assign(opt, options);

    let eTime = new Date().getTime() + opt.microse, destoryThisTimer, interId;
    destoryThisTimer = () => {
        if (interId) {
            clearInterval(interId);
            // opt.updateFn({
            //     day: 0,
            //     hour: 0,
            //     minute: 0,
            //     second: 0,
            //     minsecond: 0,
            //     microse: 0
            // });
        }
    };
    interId = setInterval(() => {
        let suT = eTime - new Date().getTime();
        if (suT <= 0) {
            destoryThisTimer();
            suT = 0;
            opt.updateFn({
                day: 0,
                hour: 0,
                minute: 0,
                second: 0,
                minsecond: 0,
                microse: 0
            });
            opt.callBackFn();
            return false;
        }
        opt.updateFn({
            day: parseInt((suT / 1000 / 60 / 60 / 24), 10),
            hour: parseInt((suT / 1000 / 60 / 60 % 24), 10),
            minute: parseInt((suT / 1000 / 60 % 60), 10),
            second: parseInt((suT / 1000 % 60), 10),
            minsecond: parseInt((suT % 1000) / 100, 10),
            microse: suT
        });
    }, opt.setUp);

    return destoryThisTimer;
}

const startCountDown = (options) => {
    let _this = this,
        g = {
            getTime: -1,
            startTime: 0,
            nowTime: 0,
            endTime: 0,
            updateFn() { }, // 更新
            nobeginFn() { }, // 未开始
            ingFn() { }, // 正在进行
            endFn() { }, // 结束
        },
        clearFn = function () { },
        countDownType = -1;

    Object.assign(g, options);

    if (g.getTime != -1) {
        countDownType = 1;
        g.ingFn();
        clearFn = countDown({
            setUp: 300,
            microse: g.getTime - 3000,
            updateFn(timeObj) {
                g.updateFn(timeObj, countDownType);
            },
            callBackFn() {
                countDownType = 0;
                g.endFn();
            }
        });
        return clearFn
    }

    if (g.nowTime < g.startTime) { // 未开始
        countDownType = -1;
        g.nobeginFn();
        clearFn = countDown({
            setUp: 300,
            microse: g.startTime - g.nowTime,
            updateFn(timeObj) {
                g.updateFn(timeObj, countDownType);
            },
            callBackFn() {
                countDownType = 1;
                g.ingFn();
                clearFn = countDown({
                    setUp: 300,
                    microse: g.endTime - g.startTime - 3000,
                    updateFn(timeObj) {
                        g.updateFn(timeObj, countDownType);
                    },
                    callBackFn() {
                        countDownType = 0;
                        g.endFn();
                    }
                });
            }
        });
    } else if (g.nowTime >= g.startTime && g.nowTime < g.endTime) { // 正在进行
        countDownType = 1;
        g.ingFn();
        clearFn = countDown({
            setUp: 300,
            microse: g.endTime - g.nowTime - 3000,
            updateFn(timeObj) {
                g.updateFn(timeObj, countDownType);
            },
            callBackFn() {
                countDownType = 0;
                g.endFn();
            }
        });
    } else { // 已结束
        countDownType = 0;
        g.endFn();
    }
    return clearFn
}

module.exports = (options) => {
    let opt = {
        getTime: -1,
        startTime: '',
        endTime: '',
        nowTime: '',
        updateFn() { },
        nobeginFn() { },
        ingFn() { },
        endFn() { }
    };

    Object.assign(opt, options);

    function fn(opt) {
        let timerID = null,
            destory = startCountDown({
                getTime: opt.getTime,
                startTime: opt.startTime,
                nowTime: opt.nowTime,
                endTime: opt.endTime,
                updateFn: opt.updateFn,
                nobeginFn: opt.nobeginFn,
                ingFn: opt.ingFn,
                endFn: opt.endFn,
            });
        return destory;
    }

    return new fn(opt);
}