import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import Cookie from 'js-cookie'
Vue.config.productionTip = false

Vue.use(ElementUI);


//添加全局前置导航守卫
router.beforeEach((to,from,next)=>{
    //token存不存在
  const token=Cookie.get('token')
  //token不存在，说明用户和管理员均未登录,应该跳转至登录页
  if(!token&&to.name!=='login'){
    next({name:'login'})
  }
  else if(token&&Cookie.get('token')!=='undefined'&&to.name==='login'){//如果token存在且不为普通用户，说明管理员登录，跳转至首页
    next({name:'/'})
  }
  //如果token存在且为普通用户跳转至upload
  else if(token&&Cookie.get('token')==='undefined'&&to.name!=='upload'){
    next({name:'upload'})
  }
  else{
    next()
  }


})
new Vue({
  router,
  store,
  render: h => h(App),
  //写在main里每次刷新都注册一次路由避免白屏情况
  created(){
    store.commit('addMenu',router)
  }
}).$mount('#app')
