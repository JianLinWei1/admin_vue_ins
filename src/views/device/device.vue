
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
        prop="deviceSeril"
        label="设备号"
        width="180"
      ><template slot-scope="scope">
        <el-popover trigger="hover" placement="top" @show="getDStatus(scope.row.deviceSeril)">

          <p>状态:{{ dStatus }} </p>
          <div slot="reference" class="name-wrapper">
            <el-tag type="success" size="medium">{{ scope.row.deviceSeril }}</el-tag>
          </div>
        </el-popover>
      </template>
      </el-table-column>
      <el-table-column
        prop="deviceName"
        label="设备名称"
        width="180"
      />
      <el-table-column
        prop="deviceAddress"
        label="设备地址"
        width="180"
      />
      <el-table-column
        prop="tcpIp"
        label="tcp_ip"
        width="120"
      />
      <el-table-column
        prop="tcpPort"
        label="tcp_port"
        width="120"
      />

      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="delClick(scope.row,scope.$index)">删除</el-button>
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

  </div>
</template>
<script>

import { getStatus, getDevices, delDevice, getDevicesReload } from '@/api/device'

export default {

  data() {
    return {
      tableData: null,
      pageNation: {
        page: 1,
        limit: 10
      },
      totalCount: 0,
      dStatus: '',
      value: 'deviceseril',
      searchInput: '',
      options: [{
        value: 'deviceseril',
        label: '设备号'
      }, {
        value: 'devicename',
        label: '设备名称'
      }],
      isSearched: false
    }
  },
  created: function() {
    this.getWorkerInfos()
  },
  inject: ['reload'],
  methods: {

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
      getDevicesReload(data).then(res => {
        if (res.code === 0) {
          this.tableData = res.data
          this.totalCount = res.count
        }
      })
    },
    delClick(val, val2) {
      const data = {
        uuid: val.uuid
      }
      delDevice(data).then(res => {
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
      getDevices(this.pageNation).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.tableData = res.data
          this.totalCount = res.count
        }
      })
    },
    handleSizeChange(val) {
      this.pageNation.limit = val
      if (!this.isSearched) {
        this.getWorkerInfos()
      } else {
        this.searchClick()
      }
    },
    handleCurrentChange(val) {
      this.pageNation.page = val
      if (!this.isSearched) {
        this.getWorkerInfos()
      } else {
        this.searchClick()
      }
    },
    getDStatus(val) {
      const data = {
        deviceseril: val
      }
      getStatus(data).then(res => {
        if (res.code === 0) {
          this.dStatus = '在线'
        } else {
          this.dStatus = '离线'
        }
      })
    }

  }
}
</script>

<style rel="stylesheet/scss"  scoped>
.searchStyle{
padding:  10px 0 20px
}
</style>
