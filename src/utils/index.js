// 防抖
// func: debounce(function() {
// }, 1000, false),
export function debounce(func, wait = 500, immediate = true) {
    let timeout, args, context, timestamp, result

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function (...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

// 节流
export function throttle(fn, delay) {
    let timer
    let prevTime
    return function (...args) {
        const currTime = Date.now()
        const context = this
        if (!prevTime) prevTime = currTime
        clearTimeout(timer)

        if (currTime - prevTime > delay) {
            prevTime = currTime
            fn.apply(context, args)
            clearTimeout(timer)
            return
        }

        timer = setTimeout(function () {
            prevTime = Date.now()
            timer = null
            fn.apply(context, args)
        }, delay)
    }
}

// 全局唯一标识
export function guid(len = 8, firstU = true, radix = null) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [];
    radix = radix || chars.length;

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        let r;
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (firstU) {
        uuid.shift();
        return 'u' + uuid.join('');
    }
    return uuid.join('');

}


// 获取多级数组选中数据
export function getDetArraysValue(key, treeData, id = 'areaId', children = 'children') {
    if (!key) return [];
    let arr = []; // 在递归时操作的数组
    let returnArr = []; // 存放结果的数组
    let depth = 0; // 定义全局层级
    // 定义递归函数
    function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
            depth = depthN; // 将执行的层级赋值 到 全局层级
            arr[depthN] = childrenData[j][id];
            if (childrenData[j][id] === key) {
                returnArr = arr.slice(0, depthN + 1); // 将目前匹配的数组，截断并保存到结果数组，
                break
            } else {
                if (childrenData[j][children]) {
                    depth++;
                    childrenEach(childrenData[j][children], depth);
                }
            }
        }
        return returnArr;
    }
    return childrenEach(treeData, depth);
}

// 获取多级数组选中详细数据
// data 为源数组
// value 为选中数组
// keyName 为返回键名 不传默认返回一个完整对象，传值，则返回当前选择对象键名的值，建议传值；
export function getArrayValue(data, value, keyName = 'code', id = 'areaId') {
    if (!value && value.length === 0 && !data && data.length === 0) return '';
    for (let i = 0; i < data.length; i++) {
        if (data[i][id] === value[0]) {
            if (data[i].children && value.length > 1) {
                value.splice(0, 1);
                return getArrayValue(data[i].children, value, keyName);
            } return keyName ? data[i][keyName] : data[i];
        }
    }
}

// 获取区域的id
export function changeDetSelect(key, treeData, id = 'areaId', children = 'children') {
    if (!key) return [];
    let arr = []; // 在递归时操作的数组
    let returnArr = []; // 存放结果的数组
    let depth = 0; // 定义全局层级
    // 定义递归函数
    function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
            depth = depthN; // 将执行的层级赋值 到 全局层级
            arr[depthN] = childrenData[j][id];
            if (childrenData[j][id] === key) {
                returnArr = arr.slice(0, depthN + 1); // 将目前匹配的数组，截断并保存到结果数组，
                break
            } else {
                if (childrenData[j][children]) {
                    depth++;
                    childrenEach(childrenData[j][children], depth);
                }
            }
        }
        return returnArr;
    }
    return childrenEach(treeData, depth);
}

// 删除多余的children
export function changeMenusData( menusData, children = 'children') {
    // menusData = menusData.slice(0,1)
    let data = menusData
    // 定义递归函数
    function childrenEach(childrenData) {
        for (var j = 0; j <= childrenData.length; j++) {
            if (childrenData[j][children].length === 0) {
                delete childrenData[j][children]
            } else if (childrenData[j][children].length > 0) {
                childrenEach(childrenData[j][children]);
            }
        }
        console.log(data);
        return data
    }
    return childrenEach(data);
}

