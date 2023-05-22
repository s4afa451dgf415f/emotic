import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/Main'
import Login from '../views/Login'
import Upload from '../views/Upload'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect:'/admin',
        component: Main,
        name:'Main',
        children: [
            // {path: 'home', name:'home',component: Home},//首页
            // {path: 'user', name:'user',component: User},//用户管理
            // {path: 'mall', name:'mall',component: Mall},//商品管理
            // {path: 'page1', name:'page1',component: PageOne},//页面1
            // {path: 'page2', name:'page2',component: PageTwo}//页面2
        ]
    },
    {
        path:'/login',
        name:'login',
        component: Login,
    },
    {
        path:'/upload',
        name:'upload',
        component: Upload,
    }
]

const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

export default router
