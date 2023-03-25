<template>
  <div :data-theme="istoken?'':valentine">
    <el-button class="main-button" v-if=!istoken type='success' size="small" @click="handleClick()">管理员登录</el-button>
    <el-container>
      <el-aside   width="auto" v-if=istoken><common-aside></common-aside></el-aside>
      <el-container>
          <el-header v-if=istoken> <common-header></common-header></el-header>
        <common-tag v-if=istoken></common-tag>
        <el-main :style="{'padding-top':istoken ?'0vh' : '9.4vh'}">
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
    istoken:!(Cookie.get('token')==='undefined'),
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
.main-button{
  position:absolute;
  top:20px;
  right:20px;
}
.el-header{
  padding:0;
}
.el-container{
  height:100vh;

}
</style>
