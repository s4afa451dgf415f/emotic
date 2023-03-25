import axios from 'axios'
import store from '../store';
import Cookie from "js-cookie";



const http=axios.create({
    // baseURL:'https://localhost:3000',
    // baseURL:'https://Tu-Chuang.ccyellowstar.repl.co',
    timeout:10000,
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
        config.headers['token'] = Cookie.get('token')
        return config;
    },
        function(error) {
            return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    response.headers['Access-Control-Allow-Credentials']=true
    // 对响应数据做点什么
        if (response.data.code === 500) {
            this.$message({
                showClose: true,
                message: response.data.message,
                duration: 2000,
                type: 'error'
            });
        }
        return response.data;
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '错误请求';
                    break;
                case 401:
                    err.message = '未授权，请重新登录';
                    break;
                // case 403:
                //     // 定位到登录页面
                //     // err.message = '拒绝访问，请重新登录'
                //     break;
                case 404:
                    err.message = '请求错误,未找到该资源';
                    break;
                case 405:
                    err.message = '请求方法未允许';
                    break;
                case 408:
                    err.message = '请求超时';
                    break;
                case 500:
                    err.message = '服务器端出错';
                    break;
                case 501:
                    err.message = '网络未实现';
                    break;
                case 502:
                    err.message = '网络错误';
                    break;
                case 503:
                    err.message = '服务不可用';
                    break;
                case 504:
                    err.message = '网络超时';
                    break;
                case 505:
                    err.message = 'http版本不支持该请求';
                    break;
                default:
                    err.message = `连接错误${err.response.status}`;
            }
        } else {
            err.message = '连接到服务器失败!';
        }
        this.$message({
            showClose: true,
            message: err.message,
            duration: 2000,
            type: 'error'
        });
        return Promise.resolve(err.response);
});

export default  http
