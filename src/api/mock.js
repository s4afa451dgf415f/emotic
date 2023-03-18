import Mock from 'mockjs'
import user from './mockServeData/user'
import permission from "./mockServeData/permission";

//定义mock请求拦截
Mock.mock(/api\/user\/getUser/, user.getUserList)
Mock.mock('/api/user/add','post',user.createUser)
Mock.mock('/api/user/edit','post',user.updateUser)
Mock.mock('/api/user/del','post',user.deleteUser)
Mock.mock(/api\/permission\/getMenu/, 'post',permission.getMenu)

