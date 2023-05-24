<template>
  <transition name="fade" > <!--标签为transition的关键词为添加动画效果，name把标识符传递给style，如果不用name应声明默认类.v-->
    <div ref='alert' :class='alertTypeClass' class="sd-message alert  shadow-lg w-1/3" v-if="show" >
      <div style="margin:0 auto">
        <svg style="margin:0 auto" xmlns="http://www.w3.org/2000/svg"  :class="alertTypeClass" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span><slot></slot></span>
      </div>
      <button @click="close" class="ml-4 text-sm ">&times;</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'dsAlert',
  props: {
    type: {
      type: String,
      default: "error",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    alertTypeClass() {
      return {
        "alert-error": this.type === "error",
        "alert-success": this.type === "success",
        "alert-warning": this.type === "warning",
      };
    },
  },
  methods: {
    close() {
      this.$emit("update");
    },
  },
  mounted() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer=setTimeout(()=>{

      // this.close()
    },3000)
  },
  beforeUpdate(){
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer=setTimeout(()=>{
      this.close()
    },3000)
  }
};

</script>
<style lang="less" scoped>
.fade-leave-to, .fade-enter {
  opacity: 0;
  transform: translatey(-100%); /* 修改这里的 translateY 值 */
}

.fade-leave-active, .fade-enter-active {
  transition: opacity 1s ease-out, transform 1s ease-out;
}
.sd-message {
  min-width: 380px;
  box-sizing: border-box;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  //border-color: #e5e7eb;
  position: fixed;
  top: 20px;
  left: 33%;
  margin:0 auto;
  //transform:translateX(-50%);
  //background-color: #e5e7eb;
  overflow: hidden;
  padding: 20px 0;
  display: flex;
  align-items: center;
}
</style>
