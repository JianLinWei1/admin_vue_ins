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
      <el-table-column
        prop="roleId"
        :label="$t('roleManage.roleId')"
        width="180"
      />
      <el-table-column
        prop="roleName"
        :label="$t('roleManage.roleName')"
        width="180"
      />
      <el-table-column
        prop="roleDescription"
        :label="$t('roleManage.roleDescription')"
      />
      <!-- <el-table-column
        prop="hasPermission"
        label="拥有权限"
      /> -->
      <el-table-column
        :label="$t('roleManage.action')"
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
  </div>
</template>
<script>
import { getRoleList } from '@/api/role'

export default {

  data() {
    return {
      tableData: null,
      totalCount: 0,
      listLoading: false,
      pagination: {
        page: 1,
        limit: 10
      }
    }
  },
  created: function() {
    this.getRoleList()
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
    getRoleList() {
      this.listLoading = true
      getRoleList(this.pagination).then(data => {
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
      if (data.roleId === 1) {
        this.$message(this.$t('roleManage.tips1'))
      }
    },
    delClick(data) {
      if (data.roleId === 1) {
        this.$message(this.$t('roleManage.tips2'))
      }
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
