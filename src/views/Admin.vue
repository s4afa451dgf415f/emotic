      <template>
        <div class="manage">
          <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="50%"
              :before-close="handleClose">
            <!-- 用户的表单信息 -->
            <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="80px">
              <el-form-item label="上传表情" prop="imageUrl">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :on-error="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                  <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="Tag" prop="tags">
                <el-tag
                    :key="tag.name"
                    v-for="tag in form.tags"
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
              <el-form-item label="是否审核" prop="audit" v-if=token>
                <el-select v-model="form.audit" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="other">
                <el-input type='textarea' :rows="10" placeholder="请输入备注" v-model="form.other"></el-input>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
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
                  prop="imageUrl"
                  label="表情">
                <template slot-scope="scope">
                  <el-image
                      style="width: 80px; height: 80px; background-color:rgb(245,247,250); "
                      ref="myImg"
                      :src="scope.row.imageUrl"
                      :zoom-rate="1.2"
                      fit="fill"
                      :preview-src-list=
                          '[scope.row.imageUrl]'
                  >
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column
                  prop="tags"
                  width='420'
                  label="TAG">
                <template slot-scope="scope">
                  <el-tag
                      v-for="tag in scope.row.tags"
                      :key="tag.name"
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
                  label="备注">
              </el-table-column>
              <el-table-column
                  prop=""
                  label="操作"
                  v-if="token">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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

      export default {
        data() {
          return {
            token:!(Cookie.get('token')==='undefined'),
            typeList: ['', 'success', 'info', 'warning', 'danger'],
            inputVisible: false,
            inputValue: '',
            tagsButton: true,
            dialogVisible: false,
            form: {
              imageUrl: '',
              tags: [],
              scale: '',
              audit: '',
              upTime: '',
              other: '',
            },
            rules: {
              imageUrl: [{required: true, message: '请上传表情'}],
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
          //上传图片
          handleAvatarSuccess(res, file) {
            this.form.imageUrl = URL.createObjectURL(file.raw);
            this.form.scale = (file.raw.size / 1000000).toFixed(4)
          },
          beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!isLt2M) {
              this.$message.error('上传表情图片大小不能超过 10MB!');
            }
            return isLt2M;
          },
          // 提交用户表单
          submit() {
            this.$refs.form.validate((valid) => {
      // console.log(valid, 'valid')
              if (valid) {
                // 后续对表单数据的处理
                if (this.modalType === 0) {
                  addUser(this.form).then(() => {
      // 重新获取列表的接口
                    this.getList()
                  })
                } else {
                  editUser(this.form).then(() => {
      // 重新获取列表的接口
                    this.getList()
                  })
                }

                // 清空表单的数据
                this.$refs.form.resetFields()
                this.form.tags = []
                // 关闭弹窗
                this.dialogVisible = false
              }
            })
          },
          // 弹窗关闭的时候
          handleClose() {
            this.$refs.form.resetFields()
            this.form.tags = []
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
          onSubmit() {
            this.getList()
          }
        },
        mounted() {
          this.getList()
        }
      }
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

      </style>
      <style>
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }

      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
      </style>
