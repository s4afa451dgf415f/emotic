<template>
        <div class="manage">
          <el-dialog
              :title="modalType?'审核/编辑':'新增'"
              :visible.sync="dialogVisible"
              width="50%"
              :before-close="handleClose">
            <!-- 用户的表单信息 -->
            <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="80px">
              <div class="uploader">
                <!-- 点击上传按钮 -->
                <el-button type="primary" size="medium" @click="onUpload">上传表情（可多选）</el-button>

                <!-- 图片展示九宫格 -->
                <div class="grid-container">
                  <el-col :span="8" v-for="(item, index) in form.fileList" :key="index">
                    <div class="grid-item">
                      <img :src="item" alt="图片" />
                      <el-button size='mini' type="danger" icon="el-icon-delete" circle class="delete-btn" @click="deleteItem(index)"></el-button>
                    </div>
                  </el-col>
                </div>

                <!-- 图片上传组件 -->
                <input type="file" ref="uploadInput" style="display:none;" multiple @change="uploadFiles($event.target.files)">
              </div>
              <el-form-item label="Tag" prop="tags" style="margin-right: 60px;">
                <el-tag
                    :key="tag+index"
                    v-for="(tag,index) in form.tags"
                    closable
                    :disable-transitions="false"
                    @close="handleCloseTag(tag)">
                  {{ tag.name }}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else-if="tagsButton" v-show="tagsButton" class="button-new-tag" size="small" @click="showInput">+
                  New Tag
                </el-button>
              </el-form-item>
              <el-form-item label="是否审核" prop="audit" v-if=token style="margin-right: 60px;">
                <el-select v-model="form.audit" placeholder="请选择" style="width: 120px;">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="92px" label="上传者(可选)" prop="other" style="white-space: nowrap;">
                <el-input    v-model="form.other"></el-input>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :disabled="submitFormDis" @click="submit">确 定</el-button>
          </span>
          </el-dialog>
          <div class="manage-header">
            <el-button @click="handleAdd" type="primary">
              + 新增
            </el-button>
            <!-- form搜索区域 -->
            <el-form :inline="true" :model="userForm">
              <el-form-item>
                <el-input placeholder="请输入Tag" v-model="userForm.name"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="common-tabel">
            <el-table
                stripe
                height="90%"
                @sort-change="sortTable"
                :data="tableData"
                style="width: 100%">
              <el-table-column
                  prop="fileList"
                  label="表情">
                <template slot-scope="scope">
                  <el-badge :value="scope.row.fileList.length" class="item" type="primary" >
                    <el-image
                        style="width: 80px; height: 80px; background-color:rgb(245,247,250); "
                        ref="myImg"
                        :src="scope.row.fileList[0]"
                        :zoom-rate="1.2"
                        fit="fill"
                        :preview-src-list=
                            'scope.row.fileList'
                    >
                    </el-image>
                  </el-badge>
                </template>
              </el-table-column>
              <el-table-column
                  prop="tags"
                  width='420'
                  label="TAG">
                <template slot-scope="scope">
                  <el-tag
                      v-for="(tag,index) in scope.row.tags"
                      :key="tag+index"
                      closable:false
                      :type="tag.type"
                      style="margin-right: 5px;margin-bottom: 6px;"
                  >
                    {{ tag.name }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column
                  prop="audit"
                  label="是否审核"
                  sortable="custom">
                <template slot-scope="scope">
                  <span :style="{color:scope.row.audit === 1 ?'green' : 'red'}">{{ scope.row.audit == 1 ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                  prop="scale"
                  label="大小(MB)">
              </el-table-column>
              <el-table-column
                  prop="upTime"
                  label="上传日期">
              </el-table-column>
              <el-table-column
                  prop="other"
                  label="上传者">
              </el-table-column>
              <el-table-column
                  prop=""
                  label="操作"
                  v-if="token">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.row)">审核/编辑</el-button>
                  <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pager">
              <el-pagination
                  layout="prev, pager, next"
                  :total="total"
                  @current-change="handlePage">
              </el-pagination>
            </div>
          </div>
        </div>
      </template>
      <script>
      import {getUser, addUser, editUser, delUser} from '../api'
      import Cookie from "js-cookie";
      import { debounce } from '@/utils'

      export default {
        data() {
          return {
            submitFormDis:false,
            token:!(Cookie.get('token')==='undefined'),
            typeList: ['', 'success', 'info', 'warning', 'danger'],
            inputVisible: false,
            inputValue: '',
            tagsButton: true,
            dialogVisible: false,
            form: {
              fileList: [], // 存储上传的图片列表
              // imageUrl: '',
              tags: [],
              scale: '',
              audit: '',
              upTime: '',
              other: '',
            },
            rules: {
              fileList: [{required: true, message: '请上传表情'}],
              tags: [
                {required: true, message: '请至少选择一个标签'}
              ],
              audit: [
                {required: true, message: '请选择是否审核'}
              ],
            },
            tableData: [],
            modalType: 0, // 0表示新增的弹窗， 1表示编辑
            total: 0, //当前的总条数
            pageData: {
              page: 1,
              limit: 7
            },
            userForm: {
              name: '',
              sortname: '',
              sortorder: '',
            }
          }
        },
        methods: {
          onUpload() {
            this.$refs.uploadInput.click();
          },

          // 选择文件后上传
          uploadFiles(files) {
            console.log(this.form.fileList,files)
            // 最多上传9张图片
            if (this.form.fileList.length + files.length > 9) {
              this.$message.error("最多只能上传9张图片");
              return;
            }
            // 遍历选择的文件并上传
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              // let temp=['image/jpeg','image/png','image/gif','image/bmp','image/svg']
              const isLt2M = file.size / 1024 / 1024 < 10;
              // if (!temp.includes(file.type)) {
              //   this.$message.error('图片格式只能为JPEG、PNG、GIF、BMP、SVG！');
              //   return ;
              // }
              if (!isLt2M) {
                this.$message.error('上传表情图片大小不能超过 10MB!');
                return ;
              }
              const reader = new FileReader();

              // 读取文件内容并转成Base64编码
              reader.readAsDataURL(file);
              reader.onload = () => {
                const url = reader.result;

                // 添加到图片列表中
                this.form.fileList.push(url);
              };
            }
          },

          // 删除图片
          deleteItem(index) {
            this.form.fileList.splice(index, 1);
          },
          //排序
          sortTable(name){       //排序
            console.log(this.token)
            if(name.order!=null){
              this.userForm.sortorder=name['order']=='descending'?'desc':'asc';
              this.userForm.sortname=name['prop'];
            }else{
              this.sortorder=''
              this.sortname=''
            }
            this.getList()
          },
          //标签管理
          handleCloseTag(tag) {
            this.form.tags.splice(this.form.tags.indexOf(tag), 1);
            this.tagsButton = this.form.tags.length < 5
          },

          showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
            });
          },
          handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
              this.form.tags.push({name: inputValue, type: this.typeList[this.form.tags.length]});
            }
            this.tagsButton = this.form.tags.length < 5
            this.inputVisible = false;
            this.inputValue = '';
          },
          // 提交用户表单
          submit(){ // 优先执行第一次点击事件
          {
            this.$refs.form.validate((valid) => {
      // console.log(valid, 'valid')
              if (valid) {
                this.submitFormDis = true;
                // 后续对表单数据的处理
                if (this.modalType === 0) {
                  addUser(this.form).then((res) => {
                    if(res.status===200){
                      // 清空表单的数据
                      this.$refs.form.resetFields()
                      this.form.tags = []
                      this.form.fileList = []
                      // 关闭弹窗
                      this.dialogVisible = false
                      this.$message({
                        showClose: true,
                        message: '新增成功',
                        type: 'success'
                      });
                    }
                    // 重新获取列表的接口
                    this.getList()
                    this.submitFormDis = false;
                  })
                  //编辑
                } else {
                  editUser(this.form).then((res) => {
                    if(res.status===200){
                      // 清空表单的数据
                      this.$refs.form.resetFields()
                      this.form.tags = []
                      this.form.fileList = []
                      // 关闭弹窗
                      this.dialogVisible = false
                      this.$message({
                        showClose: true,
                        message: '审核/编辑成功',
                        type: 'success'
                      });
                    }
                    // 重新获取列表的接口
                    this.getList()
                    this.submitFormDis = false;
                  })
                }
              }
            })
            //解锁
          }},
          // 弹窗关闭的时候
          handleClose() {
            this.$refs.form.resetFields()
            this.form.fileList = []
            this.dialogVisible = false
          },
          cancel() {
            this.handleClose()
          },
          handleEdit(row) {
            this.modalType = 1
            this.dialogVisible = true
      // 注意需要对当前行数据进行深拷贝，否则会出错
      //       this.form = JSON.parse(JSON.stringify(row))
      this.$nextTick(()=>{
        this.form = JSON.parse(JSON.stringify(row))
      })
          },
          handleDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              delUser({id: row.id}).then(() => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                // 重新获取列表的接口
                this.getList()
              })

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
          handleAdd() {
            this.modalType = 0
            this.dialogVisible = true
            this.tagsButton = true
          },
          // 获取列表的数据
          getList() {
      // 获取的列表的数据
            getUser({params: {...this.userForm, ...this.pageData}}).then(({data}) => {
              console.log(data)
              this.tableData = data.list

              this.total = data.count || 0
            })
          },
          // 选择页码的回调函数
          handlePage(val) {
      // console.log(val, 'val')
            this.pageData.page = val
            this.getList()
          },
          // 列表的查询
          onSubmit(){ // 优先执行第一次点击事件
            this.getList()
          },
        mounted() {
          this.getList()
        }
      }}
      </script>
      <style lang="less" scoped>
      .el-tag + .el-tag {
        margin-left: 10px;
      }

      .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }

      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }

      .manage {
        height: 90%;

        .manage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .common-tabel {
          position: relative;
          height: calc(100% - 62px);

          .pager {
            position: absolute;
            bottom: 0;
            right: 40%;
          }
        }
      }
      //图片样式
      .uploader {
        display: flex;
        flex-direction: column;
        align-items: normal;
        margin-top: 20px;
        /deep/.el-button--medium{
          margin:0 auto;
          padding:10px 40px;
        }
      }

      .grid-container {
        align-items: normal;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 20px;
      }

      .grid-item {
        position: relative;
        margin: 10px auto;
        width: 150px;
        height: 150px;
        overflow: hidden;
        border-radius: 5px;
        box-shadow: 0 0 5px #ccc;
      }

      .grid-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .delete-btn {
        position: absolute;
        top: 5px;
        right: 5px;
      }

      /deep/.el-badge__content.is-fixed{
        top:10px;
      }
      </style>
