// 防抖
// func: debounce(function() {
// }, 1000, false),
import Compressor from "compressorjs";

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

//上传加解压到指定大小，参数分别为图片文件对象，接近的大小，回调，从什么质量开始解压（选填）
export function uploadAndCompress(file, size, fn, quality = 1) {
    new Compressor(file, {
        quality,
        maxWidth: 800,
        maxHeight: 800,
        convertSize: size * 1024,
        success: (result) => {
            const reader = new FileReader();
            reader.readAsDataURL(result); // blob转base64
            // 读取完毕
            reader.onload = () => {
                console.log(reader.result.length, 1024 * size);
                if (reader.result.length > 1024 * size && quality > 0) {
                    quality -= 0.05;
                    uploadAndCompress(file, size, fn, quality);
                } else {
                    fn(reader.result);
                }
            };
        },
        error: () => {
            this.$message({
                showClose: true,
                message: '压缩失败',
                type: 'error',
            });
        },
    });
}

//时间转换
export function formatDate(str) {
    const date = new Date(str);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);

    return `${year}年${month}月${day}日${hour}:${minute}:${second}`;
}

