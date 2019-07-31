/**
 * 列表页面防抖处理
 * @param {*} url 
 * @param {*} size 
 */
const throttle = (func, delay, mustRunDelay) => {

    var startTime = null,
        timer = null;
    return (function () {
        var context = this,
            args = arguments,
            currentTime;
        clearTimeout(timer);
        if (!startTime) {
            startTime = Date.now();
        }
        currentTime = Date.now();
        if (currentTime - startTime >= mustRunDelay) {
            func.apply(context, args);
            startTime = null;
            clearTimeout(timer);
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
                startTime = null;
                clearTimeout(timer);
            }, delay);
        }
    })
}

module.exports = {
    throttle,
}