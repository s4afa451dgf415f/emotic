<template>
  <!--    <div :data-theme="valentine">-->
  <div class="manage"  data-theme="dracula">
    <div style="background-color: #282A36;height:100vh;width:100%;position:fixed;left:0;top:0;z-index:-1"></div>
    <button class="btn btn-outline btn-success small fixed top-0 right-0" @click="handleClick()">管理员登录</button>
    <ds-alert  :type="'error'" :show="showAlert" @update="showAlert=false">
      {{showMessage}}
    </ds-alert>
    <div class="dialog object-center" v-if="dialogVisible">
      <!--      <div class="dialog-title"></div>-->
      <div class="dialog-content">
        <div class="uploader w-1/2">
          <button class="btn" @click="onUpload">上传表情（可多选,最多9张）</button>
          <div class="grid-container">
            <div v-for="(item, index) in form.fileList" :key="index" class="grid-item">
              <img class='object-contain shadow-inner border-4 border-cyan-400' :src="item" alt="图片" />
              <button class="btn btn-warning delete-btn" @click="deleteItem(index)">删除</button>
            </div>
          </div>
          <input type="file" ref="uploadInput" style="display:none;" multiple @change="uploadFiles($event.target.files)">
        </div>
        <div style="margin-bottom: 20px">
          <span class="mr-2">Tag:</span>
          <div v-for="(tag, index) in form.tags" :key="tag + index" class="tag inline-block mr-2 text-lg">
            {{ tag.name }}
            <button class="btn btn-xs btn-close" @click="handleCloseTag(tag)">×</button>
          </div>
          <input
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              class="input input-xs"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
          >
          <button  v-show="tagsButton" class="btn btn-xs" @click="showInput">+ New Tag</button>
        </div>
        <div style="margin-bottom: 20px">
          <span>上传者(可选):</span>
          <input v-model="form.other" class="input input-bordered w-full input-sm max-w-xs ml-2">
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn  btn-active text-lg w-1/5 object-center" :disabled="submitFormDis" @click="submit">提 交</button>
      </div>
    </div>
    <div class="manage-header object-center">
      <button @click="handleAdd" v-if='addButon' class="btn btn-outline btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-wide add-button">
        + 上传表情包
      </button>
    </div>
  </div>
  <!--    </div>-->
</template>
<script>
import { addUser } from '@/api'

export default {
  data() {
    return {
      showAlert: false,
      showMessage: false,
      addButon:true,
      tagsButton: true,
      submitFormDis:false,
      dialogVisible:false,
      inputVisible: false,
      inputValue: '',
      form: {
        fileList: [],
        tags: [],
        other: '',
      },
    }
  },
  methods: {
    handleClick() {
      // 跳转到登录页
      this.$router.push('/login')
    },
    onUpload() {
      this.$refs.uploadInput.click();
    },
    validate(fn) {
      if (!this.form.fileList.length) {
        this.showAlert = true;
        this.showMessage = "请上传至少一张图片";
      } else if (!this.form.tags.length) {
        this.showAlert = true;
        this.showMessage = "请输入至少一个tag";
      } else {
        fn(true);
      }
    },
    // validate(fn) {
    //   if (!this.form.fileList.length) {
    //     this.$message({
    //       showClose: true,
    //       message: "请上传至少一张图片",
    //       type: "error",
    //     });
    //   } else if (!this.form.tags.length) {
    //     this.$message({
    //       showClose: true,
    //       message: "请输入至少一个tag",
    //       type: "error",
    //     });
    //   } else {
    //     fn(true);
    //   }
    // },
    uploadFiles(files) {
      if (this.form.fileList.length + files.length > 9) {
        this.$message.error("最多只能上传9张图片");
        return;
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.warning(`每张表情不能超过500MB，第${i+1}张将进行压缩`);
          return ;
        }
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          const url = reader.result;
          this.form.fileList.push(url);
        };
      }
    },

    deleteItem(index) {
      this.form.fileList.splice(index, 1);
    },
    handleCloseTag(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
      this.tagsButton = this.form.tags.length < 5
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.tags.push({name: inputValue});
      }
      this.tagsButton = this.form.tags.length < 5
      this.inputVisible = false;
      this.inputValue = '';
    },
    submit(){
      this.validate((valid) => {
        if (valid) {
          let userForm={
            fileList: this.form.fileList,
            tags: this.form.tags.map(e=>e['name']),
            other: this.form.other
          }
          this.submitFormDis = true;
          addUser(userForm).then((res) => {
            if(res.code===200){
              this.form.tags = []
              this.form.fileList = []
              this.dialogVisible = false
              this.$message({
                showClose: true,
                message: '新增成功',
                type: 'success'
              });
            }
            this.submitFormDis = false;
            this.addButon=true
            this.dialogVisible = false
            this.tagsButton = false
          })
        }
      })
    },
    cancel() {
      this.form.fileList = []
      this.dialogVisible = false
    },
    handleAdd() {
      this.addButon=false
      this.dialogVisible = true
      this.tagsButton = true
    },
  },
}
</script>
<style lang="less" scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

button{
  &:focus {
    outline: none;
  }
}
input{
  &:focus {
    outline: none;
  }
}
.manage {
  //height: 100vh;
  .dialog{
    //box-sizing: border-box;
    padding: 0 10px;
    margin-top: 25vh;
    margin-left: 50%;
    transform: translateX(-25%);
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }

    .tag-input {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }

    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      label {
        margin-right: 10px;
        font-weight: 500;
      }
    }

    .grid-container {
      align-items: normal;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 20px;
      .grid-item {
        flex:1 1 30%;
        position: relative;
        margin: 10px 3px;
        //width: 150px;
        //height: 150px;
        overflow: hidden;
        border-radius: 5px;
        box-shadow: 0 0 5px #ccc;
      }
    }
    .grid-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      &:hover {
        transform: scale(1.1);
      }
    }
    .delete-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      transform: scale(0.8);
      background-color: rgba(255, 97, 84, 0.7);
      color: #fff;
      border: none;
      border-radius: 50%;
      padding: 5px;
      font-size: 1.1rem;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: rgba(255, 0, 0, 1);
      }
    }
  }

  .manage-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}


.add-button {
  position: absolute;
  top: 30%;
  left: 45%;
  //font-size: 1.5rem;
  //padding: 15px 30px;
  //background-color: rgb(233,109,123);
  //color: #fff;

  //border-radius: 20px;
  //font-weight: 500;
  animation: pulse 1.5s infinite ease-in-out;
  //&:hover {
  //  background-color: darken(#4c51bf, 5%);
  //  animation: none;
  //}
}
.uploader {
  display: flex;
  flex-direction: column;
  margin-top: 9.4vh;
}

</style>

