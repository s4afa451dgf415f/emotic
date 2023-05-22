<script>
export default {
  name: 'dsBtn',
  /*
    @params: btn [{ label: 按钮名称, type: 类型, click: 方法名称, icon: 图标名称}]
  */
  props: {
    btn: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    btnList() {
      return this.btn;
    }
  },
  methods: {
    eventParent(clickEvent) { //触发父组件的同名事件
      this.$parent[clickEvent]();
    }
  },
  //render是渲染，结合参数createElement用来上树
  //先用createElement创建zw-icon加上文字再在此基础上创建和遍历el-button最后在外面裹上一层div
  render(createElement) {
    if(this.btnList.length !== 0) {
      //用map遍历每一个zw-icon,用createElement函数在每一个zw-icon外层包裹el-button标签
      return createElement('div', { class: 'zw-btn' }, this.btnList.map( item =>{
            return createElement('el-button', {
              attrs: {
                'size': 'mini',
                'type': item.type
              },
              nativeOn: {
                click: () => {
                  this.eventParent(item.click)
                }
              },
            }, [item.icon ? createElement('zw-icon', { attrs : { 'icon': item.icon }}) : '', item.label])
          })
      )
    }
    return '';
  }
};
</script>

<style scoped lang="less">
.zw-btn {
  display: inline-block;
  .el-button:first-child {
    margin-left: 10px;
  }
  .el-button:last-child {
    margin-right: 10px;
  }
}
</style>
