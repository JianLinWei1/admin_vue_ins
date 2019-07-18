/* eslint-disable vue/html-self-closing */
/* eslint-disable vue/no-parsing-error */
<template>
  <div class="app-container ">
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <!-- <el-table-column
        prop="roleId"
        :label="$t('adminManage.id')"
        width="180"
      /> -->
      <el-table-column
        prop="userName"
        :label="$t('adminManage.username')"
        width="180"
      />
      <el-table-column
        prop="role"
        :label="$t('adminManage.role')"
      />
      <el-table-column
        prop="faceImg"
        :label="$t('adminManage.face')"
      >
        <template slot-scope="scope">
          <img :src=" '/api'+scope.row.faceImg" alt="" style="width:100px">
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('adminManage.action')"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editClick(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="delClick(scope.row)" />

        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="pagination.page"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :page-size="pagination.limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog :title="$t('edit')" :visible.sync="showDialog1" @close="dialogClose">
      <edit-admin ref="soc" />
    </el-dialog>
  </div>
</template>
<script>
import { getAdminList, editAdmin } from '@/api/admin'
import EditAdmin from './editAdmin'
export default {
  name: 'AdminList',
  components: { EditAdmin },
  inject: ['reload'],
  data() {
    return {
      tableData: null,
      totalCount: 0,
      listLoading: false,
      pagination: {
        page: 1,
        limit: 10
      },
      showDialog1: false,
      editForm: {
        userName: '',
        password: '',
        faceImg: ''
      }
    }
  },
  created: function() {
    this.getAdminList()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagination.limit = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagination.page = val
      this.getRoleList()
    },
    getAdminList() {
      this.listLoading = true
      getAdminList(this.pagination).then(data => {
        this.listLoading = false

        if (data.code === 0) {
          this.totalCount = data.count
          this.tableData = data.data
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    editClick(data) {
      // if (data.roleId === 1) {
      //   this.$message(this.$t('roleManage.tips1'))
      //   return
      // }
      sessionStorage.setItem('username', data.userName)
      this.showDialog1 = true
    },
    delClick(data) {
      if (data.roleId === 1) {
        this.$message(this.$t('roleManage.tips2'))
        return
      }
    },
    onSubmit1() {
      console.log(EditAdmin.form)
      editAdmin(EditAdmin.form).then(res => {
        console.log(res)
      })
    },
    dialogClose() {
      this.$refs.soc.closeCamrea()
      this.reload()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
