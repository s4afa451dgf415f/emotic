<template>
  <div class="login h-14 bg-gradient-to-r from-purple-500 to-yellow-500">
    <form ref="form" class="login-form max-w-sm p-10 bg-white rounded-lg shadow-2xl">
      <h3 class="login-title">系统登录</h3>
      <div class="form-group">
        <label class="label inline" for="username">用户名:</label>
        <button class="btn btn-sm btn-primary bg-primary-300  inline float-right w-2/5 mb-2  hover:bg-gray-400" @click="submit1">我只是普通用户</button>
        <input class="input" v-model="form.username" type="text" id="username" placeholder="请输入账号" />
      </div>
      <div class="form-group">
        <label class="label" for="password">密码:</label>
        <input class="input" v-model="form.password" type="password" id="password" placeholder="请输入密码" />
      </div>
      <div class="form-group">
        <button class="btn btn-primary text-lg hover:bg-gray-400 w-full" @click="submit">登录</button>
      </div>
    </form>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import { getMenu } from '../api'
import fs from 'fs'
// import md5 from '../utils/md5.js'
// import Main from "@/views/Main";

export default {
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
  },
  data() {
    return {
      form: {
        username: 'NGzhinengyanjiusuo',
        password: '123456'
      }
    }
  },
  methods: {
    submit() {
      console.log(fs)
      // 验证用户名和密码是否为空
      if (!this.form.username || !this.form.password) {
        this.$message.error('用户名和密码不能为空');
        return;
      }
      // this.form.password=md5(this.form.password)
      getMenu(this.form).then(({data}) => {
        if (data.code === 20000) {
          // token信息存入cookie用于不同页面间的通信
          Cookie.set('token', data.data.token)

          // 获取菜单的数据，存入store中
          this.$store.commit('setMenu', data.data.menu)
          this.$store.commit('addMenu', this.$router)
          // 跳转到首页
          this.$router.push('/admin')
        } else {
          this.$message.error(data.data.message);
        }
      })
    },
    submit1(){
      let putongForm={
        username: 'putongyonghu',
        password: '123456'
      }
      getMenu(putongForm).then(({data}) => {
        if (data.code === 20000) {
          // token信息存入cookie用于不同页面间的通信
          Cookie.set('token', data.data.token)
          // 获取菜单的数据，存入store中
          this.$store.commit('setMenu', data.data.menu)
          this.$store.commit('addMenu', this.$router)
          // 跳转到首页
          this.$router.push('/upload')
        } else {
          this.$message.error(data.data.message);
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

@tailwind base;
@tailwind components;
@tailwind utilities;
@font-face {
  font-family: 'ZhouFangRiMingTi';
  src: url('../assets/font/ZhouFangRiMingTi-2.otf') format('truetype');
}
.login{
  position: absolute;
  top:0;
  width:100%;
  height:100vh;
  //background-color: #4c51bf;
  font-family: 'ZhouFangRiMingTi',serif;
}
.login-form {
  max-width: 400px;
  margin: 360px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  .form-group {
    margin-bottom: 20px;
  }
  .login-title {
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
  }
  .label {
    //display: block;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 16px;
  }
  .input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    &:focus {
      border-color: #4c51bf;
      box-shadow: 0 0 0 1px #4c51bf;
    }
  }
  .btn {
    padding: 10px;
    border-radius: 5px;
  }
  .mb-2{
    margin-top:-0.6rem ;
  }
}
</style>
