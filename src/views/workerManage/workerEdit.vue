
<template>
  <div class="app-container ">
    <el-button style="float:right" type="primary" icon="el-icon-refresh" @click="reload()">刷新</el-button>
    <div class="searchStyle">
      <el-select v-model="value" placeholder="请选择搜索关键词">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="searchInput" style="width:30%" placeholder="请输入内容" />
      <el-button type="primary" icon="el-icon-search" circle @click="searchClick" />
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 80%"
    >
      <el-table-column
        prop="idCard"
        label="身份证号"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>民族: {{ scope.row.nation }}</p>
            <p v-if=" scope.row.gender === 1">性别: 男 </p>
            <p v-else>性别: 女 </p>
            <p>生日: {{ scope.row.birthday }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <p>签发机关: {{ scope.row.idissue }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="workTypeName"
        label="部门"
        width="100"
      />
      <el-table-column
        prop="idPhoto"
        label="身份证照片"
        width="180"
      >
        <template slot-scope="scope">
          <viewer>
            <img :src=" baseURL+scope.row.idPhoto " alt="" style="width:100px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column
        prop="visiblePhoto"
        label="现场照片"
        width="180"
      >   <template slot-scope="scope">
        <viewer>
          <img :src=" baseURL+scope.row.visiblePhoto" alt="" style="width:150px">
        </viewer>
      </template> </el-table-column>
      <el-table-column
        prop="upload"
        label="上传市平台是否成功"
        width="100"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.upload === 1" style="color:#67C23A">上传成功</div>
          <div v-if="scope.row.upload === 2" style="color:#67C23A">平台下发</div>
          <div v-if="scope.row.upload === -1" style="color:#F56C6C">上传失败</div>

        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['real:edit'])" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-if="checkPermission(['real:del'])" type="danger" size="small" @click="delClick(scope.row,scope.$index)">删除</el-button>
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

    <el-dialog title="编辑工人信息" :visible.sync="dialogFormVisible">
      <p>若需要修改身份证信息，请删除重新注册</p>
      <el-form :model="editFrom">
        <el-form-item label="身份证" :label-width="formLabelWidth">
          <el-input v-model="editFrom.idCard" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="editFrom.name" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="部门类型" :label-width="formLabelWidth">
          <el-select v-model="editFrom.workTypeId" placeholder="请选择部门类型">
            <el-option v-for="item in workTpes" :key="item.id" :label="item.workTypeName" :value="item.id" /></el-select>
        </el-form-item>
        <el-form-item label="现场照片" :label-width="formLabelWidth">
          <el-upload
            action="7777"
            :show-file-list="false"
            :on-change="imageOnchange2"
            :before-upload="beforeAvatarUpload2"
            :auto-upload="false"
          >
            <img v-if="editFrom.visiblePhoto" :src="editFrom.visiblePhoto">

          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFromSubmit">立即更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getWorkerInfos, getWorkTypesAll, addWorkerInfo, getWorkerInfosReload, delWokerInfoByIdcard } from '@/api/worker'
import { compressImg_bak2 } from '@/utils/compressImg'
import checkPermission from '@/utils/permission'

export default {

  data() {
    return {
      tableData: null,
      pageNation: {
        page: 1,
        limit: 10
      },
      totalCount: 0,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      editFrom: {
        idCard: '',
        name: '',
        workTypeId: '',
        visiblePhoto: ''
      },
      workTpes: '',
      value: 'idCard',
      searchInput: '',
      options: [{
        value: 'idCard',
        label: '身份证'
      }, {
        value: 'name',
        label: '姓名'
      }],
      isSearched: false,
      baseURL: process.env.BASE_API
    }
  },
  created: function() {
    this.getWorkerInfos()
  },
  inject: ['reload'],
  methods: {
    checkPermission,
    editClick(val) {
      this.dialogFormVisible = true

      this.editFrom.idCard = val.idCard
      this.editFrom.name = val.name
      this.editFrom.workTypeId = val.workTypeId
      this.editFrom.visiblePhoto = this.baseURL + val.visiblePhoto

      getWorkTypesAll().then(res => {
        if (res.code === 0) {
          this.workTpes = res.data
        }
      })
    },
    editFromSubmit() {
      const loading = this.$loading({
        lock: true,
        text: '正在更新中...请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      addWorkerInfo(this.editFrom).then(res => {
        loading.close()

        if (res.code === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.reload()
        }
      })
    },
    searchClick() {
      if (!this.isSearched) {
        Object.assign(this.$data.pageNation, this.$options.data().pageNation)
      }
      const data = {
        key: this.value,
        value: this.searchInput,
        page: this.pageNation.page,
        limit: this.pageNation.limit
      }
      this.isSearched = true
      getWorkerInfosReload(data).then(res => {
        if (res.code === 0) {
          this.tableData = res.data
          this.totalCount = res.count
        }
      })
    },
    delClick(val, val2) {
      const data = {
        idCard: val.idCard
      }
      delWokerInfoByIdcard(data).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.tableData.splice(val2, 1)
        }
      })
    },
    getWorkerInfos() {
      getWorkerInfos(this.pageNation).then(res => {
        if (res.code === 0) {
          this.tableData = res.data
          this.totalCount = res.count
        }
      })
    },
    handleSizeChange(val) {
      this.pageNation.limit = val
      if (!this.isSearched) {
        this.getWorkTypes()
      } else {
        this.searchClick()
      }
    },
    handleCurrentChange(val) {
      this.pageNation.page = val
      if (!this.isSearched) {
        this.getWorkTypes()
      } else {
        this.searchClick()
      }
    },
    submitForm(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('')
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
    },
    imageOnchange2(file) {
      var the = this
      if (file) {
        compressImg_bak2(file.raw).then(function(res) {
          the.editFrom.visiblePhoto = 'data:image/jpeg;base64,' + res
        })
        // this.idcardBackImg = URL.createObjectURL(file.raw)
      }
    },
    beforeAvatarUpload2(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      console.log('dd' + file)
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss"  scoped>
.searchStyle{
padding:  10px 0 20px
}
</style>
