<template>
  <div>
    <el-container>
      <el-aside   width="auto"><common-aside></common-aside></el-aside>
      <el-container>
          <el-header> <common-header></common-header></el-header>
        <common-tag></common-tag>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import commonAside from '../components/commonAside'
import commonTag from '../components/commonTag'
import commonHeader from '../components/commonHeader'
import Cookie from "js-cookie";
export default {
  data(){
    return {
    }
  },
  methods:{
    handleClick() {
        console.log('登出')
        // 清除cookie中的token
        Cookie.remove('token')
        // 跳转到登录页
        this.$router.push('/login')
    }
  },
  components:{commonAside,commonHeader,commonTag},
}

</script>

<style scoped>
.el-header{
  padding:0
}
</style>
