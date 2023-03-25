import http from'../utils/request'

//请求首页数据
// const    baseURL='https://Tu-Chuang.ccyellowstar.repl.co'
const    baseURL=''
// const    PbaseURL=''
    export const getData=()=>{
    //返回一个promise对象
     return http.get('/home/getData')
}

// export const getUser = (params) => {
//      // 返回用户列表
//      return http.get('/user/getUser', params)
// }

export const getUser = (params) => {
     // 返回用户列表
     console.log(params, 'params')
     return http.get(baseURL+'/getemo',params)
}

export const addUser = (data) => {
     return http.post('baseURL'+'/upload', data)
}

export const editUser = (data) => {
     return http.post(baseURL+'/user/edit', data)
}

export const delUser = (data) => {
     return http.post(baseURL+'/user/del', data)
}
export const getMenu = (data) => {
     return http.post(baseURL+'/admin/login', data)
     // return http.post('/admin/login', data)
}
