import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import Cookie from 'js-cookie'
import './daisyComponents';
Vue.config.productionTip = false

Vue.use(ElementUI);


//添加全局前置导航守卫
router.beforeEach((to,from,next)=>{
  //token存不存在
  const token=Cookie.get('token')
  if(store.state.tab.getCancelTokenList.length){
    for(let i=0;i<store.state.tab.getCancelTokenList.length;i++){
      store.state.tab.getCancelTokenList[i]('取消请求')
    }
    // store.state.tab.getCancelTokenList[0]('取消请求')
    store.commit('setCancelTokenList', [])
  }
  if(token){
    if(to.name==='login'||to.name==='upload'){
      next('/')
    }
    else{
      next()
    }
  }
  else if(to.name!=='login'&&to.name!=='upload'){
    next({name:'upload'})
  }
  else{
    next()
  }


})
let app=new Vue({
  router,
  store,
  render: h => h(App),
  //写在main里每次刷新都注册一次路由避免白屏情况
  created(){
    store.commit('addMenu',router)
  }
}).$mount('#app')

export default app
