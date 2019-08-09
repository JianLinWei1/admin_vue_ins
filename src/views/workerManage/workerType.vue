
<template>
  <div class="app-container ">
    <el-button v-if="checkPermission(['depart:add'])" type="primary" @click="dialogFormVisible = true">添加部门</el-button>
    <el-button style="float:right" type="primary" icon="el-icon-refresh" @click="reload()">刷新</el-button>

    <el-dialog title="添加部门" :visible.sync="dialogFormVisible" center="" @close="closeDialog()">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="workTypeName">
          <el-input v-model="form.workTypeName" />
        </el-form-item>
        <el-form-item label="部门描述" :label-width="formLabelWidth" prop="workTypeDescription">
          <el-input v-model="form.workTypeDescription" type="textarea" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </span>

    </el-dialog>

    <el-table
      :data="workTypes"
      border=""
      style="width: 60% ;margin-top:20px"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="180"
      />
      <el-table-column
        prop="workTypeName"
        label="部门名称"
        width="180"
      />
      <el-table-column
        prop="workTypeDescription"
        label="部门描述"
        width="200"
      />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['depart:edit'])" type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-if="checkPermission(['depart:del'])" type="text" size="small" @click="delClick(scope.row ,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">

      <el-pagination
        :current-page="pageNation.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="编辑部门" :visible.sync="editType" center="" @close="closeDialog()">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="workTypeName">
          <el-input v-model="form.workTypeName" />
        </el-form-item>
        <el-form-item label="部门描述" :label-width="formLabelWidth" prop="workTypeDescription">
          <el-input v-model="form.workTypeDescription" type="textarea" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('form')">立即更新</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </span>

    </el-dialog>

  </div>
</template>
<script>
import { insertWorkType, getWorkTypes, delWorkType, updateWorkType } from '@/api/worker'
import checkPermission from '@/utils/permission'

export default {

  data() {
    return {
      dialogFormVisible: false,
      editType: false,
      form: {
        id: '',
        workTypeName: '',
        workTypeDescription: ''
      },
      workTypes: null,
      formLabelWidth: '120px',
      pageNation: {
        page: 1,
        limit: 10
      },

      totalCount: 0,
      action: false,

      rules: {
        workTypeName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        workTypeDescription: [
          { max: 100, message: '字数小于100', trigger: 'blur' }
        ]
      }
    }
  },
  created: function() {
    this.getWorkTypes()
  },
  inject: ['reload'],
  methods: {
    checkPermission,
    editClick(val) {
      this.editType = true
      this.form.id = val.id
      this.form.workTypeName = val.workTypeName
      this.form.workTypeDescription = val.workTypeDescription
    },
    updateForm(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateWorkType(this.form).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
              this.action = true
            }
          }).catch((e) => {
            this.$message.error('发生错误')
            console.log(e)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delClick(val, val2) {
      delWorkType(val.id).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.workTypes.splice(val2, 1)
        }
      }).catch((e) => {
        console.log(e)
        this.$message.error('发生错误')
      })
    },
    getWorkTypes() {
      getWorkTypes(this.pageNation).then(res => {
        if (res.code === 0) {
          this.workTypes = res.data
          this.totalCount = res.count
        }
      }).catch((e) => {
        console.log(e)
        this.$message.error('发生错误')
      })
    },
    handleSizeChange(val) {
      this.pageNation.limit = val
      this.getWorkTypes()
    },
    handleCurrentChange(val) {
      this.pageNation.page = val
      this.getWorkTypes()
    },
    submitForm(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          insertWorkType(this.form).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '创建成功！',
                type: 'success'
              })
              this.action = true
            }
          }).catch((e) => {
            this.$message.error('发生错误')
            console.log(e)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.form.resetFields()
    },
    closeDialog() {
      if (this.action) {
        this.reload()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" >

</style>
