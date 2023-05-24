import http from'../utils/request'

//请求首页数据
const    baseURL='http://localhost:3000'
// const    baseURL='http://111.230.15.231:3000' //等待买域名

//获取菜单
export const getMenu = (data) => {
     return http.post(baseURL+'/user/getMenu', data)
     // return http.post('/admin/login', data)
}

//表情管理(未审核)
export const getUser = (params) => {
     // 返回用户列表
     return http.get(baseURL+'/index/read',params)
}

export const addUser = (data) => {
     return http.post(baseURL+'/index/creat', data)
}

export const editUser = (data) => {
     console.log('edit')
     return http.post(baseURL+'/index/edit', data)
}

export const delUser = (data) => {
     return http.post(baseURL+'/index/del', data)
}

//表情管理(已审核)
export const getEmotic = (data) => {
    return http.get(baseURL+'/emotic/readEmotic', data)
    // return http.post('/admin/login', data)
}
export const editEmotic = (data) => {
     return http.post(baseURL+'/emotic/editEmotic', data)
     // return http.post('/admin/login', data)
}
export const delEmotic = (data) => {
     return http.post(baseURL+'/emotic/delEmotic', data)
     // return http.post('/admin/login', data)
}
