<template>
  <div class="header-container">
    <div class="l-content">
      <el-button style="margin-right: 20px" @click='handleMenu' icon="el-icon-menu" size="mini"></el-button>
      <!--      面包削-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:item.path}" v-for="item in tableList" :key="item.path">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown @command="handleClick">
                <span class="el-dropdown-link">
                    <img class="user" src="../assets/images/user.jpg" alt="">
                </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex'
import Cookie from 'js-cookie'
export default {
  data() {
    return {}
  },
  methods:{
    handleMenu(){
      this.$store.commit('collapseMenu')
    },
    handleClick(command) {
      if (command === 'cancel') {
        console.log('登出')
        // 清除cookie中的token
        Cookie.remove('token')
        // 跳转到登录页
        this.$router.push('/login')
      }
    }

  },
  computed:{
    ...mapState({
      tableList: state=>state.tab.tableList
    })
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.header-container {
  padding: 0 20px;
  background-color: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }
  .r-content{
    .user{
      height:40px;
      width:40px;
      border-radius: 20px;
    }
  }
  .l-content {
    display: flex;
    align-items: center;
    /deep/.el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;
        &.is-link {
          color: #666
        }
      }
      &:last-child {
        .el-breadcrumb__inner {
          color: #fff
        }
      }
    }
  }
}
</style>
