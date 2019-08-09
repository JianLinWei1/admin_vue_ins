
<template>
  <div class="app-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      label-width="150px"
      class="from_class"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="registerForm.name" />
      </el-form-item>
      <el-form-item label="身份证" prop="idCard">
        <el-input v-model="registerForm.idCard" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">

        <el-radio-group v-model="registerForm.gender">
          <el-radio v-model="registerForm.gender" label="1">男</el-radio>
          <el-radio v-model="registerForm.gender" label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="民族" prop="nation">
        <el-input v-model="registerForm.nation" />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-input v-model="registerForm.birthday" />
      </el-form-item>
      <el-form-item label="身份证地址" prop="address">
        <el-input v-model="registerForm.address" />
      </el-form-item>
      <el-form-item label="签发机关" prop="idissue">
        <el-input v-model="registerForm.idissue" />
      </el-form-item>

      <el-form-item label="有效开始日期" prop="idBeginDate">
        <el-input v-model="registerForm.idBeginDate" />
      </el-form-item>

      <el-form-item label="有效结束日期" prop="idEndDate">
        <el-input v-model="registerForm.idEndDate" />
      </el-form-item>
      <el-form-item label="人员类型">
        <el-select v-model="registerForm.userType">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value " /></el-select>
      </el-form-item>

      <el-form-item label="部门类型" prop="workTypeId">
        <el-select v-model="registerForm.workTypeId" placeholder="请选择部门类型">
          <el-option v-for="item in workTpes" :key="item.id" :label="item.workTypeName" :value="item.id" /></el-select>
      </el-form-item>

      <div style="display:inline-flex">
        <el-form-item label="身份证照片" prop="idPhoto">

          <img v-if="registerForm.idPhoto" :src="registerForm.idPhoto">
          <svg-icon v-else icon-class="card_circle" class-name="card_svg" style="width:20% ;height:20%" />
        </el-form-item>
        <el-form-item label="现场照片" prop="visiblePhoto">
          <svg-icon v-if="take === false" icon-class="live_face" class-name="card_svg" style="width:20% ;height:20%" />
          <img v-if="take === true" :src="registerForm.visiblePhoto" width="320" height="240">
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registerForm')">立即创建</el-button>
        <el-button @click="resetForm('registerForm')">重置</el-button>
        <el-button type="primary" icon="el-icon-camera" @click="takePhoto">拍照</el-button>
        <el-button type="primary" icon="el-icon-postcard" @click="getIdCard">读身份证卡</el-button>
        <el-button v-if="checkPermission(['ocr'])" type="primary" icon="el-icon-picture-outline" @click="ocrDialog">OCR身份证识别</el-button>
      </el-form-item>
    </el-form>
    <div class="img-class">
      <div class="camreaStyle">
        <video ref="video" width="640" height="480" autoplay />
        <div v-if="isSvg2 === true" class="svgCam">
          <svg-icon icon-class="camrea" style="width:60px;height:60px" @click="openCamrea" />
          <div class="el-text">点击图标打开摄像头</div>
        </div>
      </div>
    </div>
    <canvas ref="canvas" style="display:none" width="640" height="480" />
    <el-dialog ref="ocr" title="OCR识别身份证" :visible.sync="IDCardOCR" center="">

      <span style="float: left;">点击图标上传身份证正面照</span>
      <el-upload

        action="7777"
        :show-file-list="false"
        :on-change="imageOnchange"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false"
      >
        <img v-if="idcardFontImg" width="20%" height="20%" :src="idcardFontImg">
        <svg-icon v-else icon-class="idcarc_font" style="width:150px;height:150px" />

      </el-upload>

      <span style="float: left;">点击图标上传身份证背面照</span>
      <el-upload

        action="7777"
        :show-file-list="false"
        :on-change="imageOnchange2"
        :before-upload="beforeAvatarUpload2"
        :auto-upload="false"
      >
        <img v-if="idcardBackImg" width="20%" height="20%" :src="idcardBackImg">
        <svg-icon v-else icon-class="card_back" style="width:150px;height:150px" />

      </el-upload>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" round @click="uploadOCRImg">立即识别</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
// import { getAdminList, editAdmin } from '@/api/admin'
import { callCamera, closeCamera, photograph2 } from '@/utils/camrea'
import { getWorkTypesAll, uploadIdCard, addWorkerInfo } from '@/api/worker'
import { getIDCardInfo, initWs } from '@/utils/idCardInfo'
import { compressImg_bak2 } from '@/utils/compressImg'
import checkPermission from '@/utils/permission'

export default {
  data() {
    return {
      registerForm: {
        name: '',
        idCard: '',
        gender: '1',
        nation: '',
        visiblePhoto: '',
        userType: 1,
        workTypeId: '',
        birthday: '',
        address: '',
        idissue: '',
        idBeginDate: '',
        idEndDate: '',
        idPhoto: ''

      },
      isSvg2: true,
      take: false,
      workTpes: '',
      ws: null,
      IDCardOCR: false,
      idcardFontImg: '',
      idcardBackImg: '',
      options: [{
        value: 1,
        label: '劳务人员'
      }, {
        value: 2,
        label: '岗位人员'
      }],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCard: [
          { required: true, message: '请填写证件号码', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }
        ],
        workTypeId: [{ required: true, message: '请选择一个类型', trigger: 'blur' }],
        visiblePhoto: [{ required: true, message: '必须拍一张人脸照片', trigger: 'blur' }]
      }
    }
  },
  created: function() {
    this.getWorkTypes()
    initWs(this).then(ws => {
      this.ws = ws
    })
  },
  beforeDestroy: function() {
    if (!this.isSvg2) {
      closeCamera(this)
    }
  },
  methods: {
    checkPermission,
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在创建中...请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          addWorkerInfo(this.registerForm).then(res => {
            loading.close()
            if (res.code === 0) {
              this.$message({
                message: '创建成功！',
                type: 'success'
              })
            } else if (res.code === -2) {
              this.$message({
                duration: 10000,
                showClose: true,
                message: '创建成功！但有警告：' + res.msg,
                type: 'warning'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getIdCard() {
      if (this.ws === null) {
        this.$message.error('连接读卡服务失败')
        return
      }
      getIDCardInfo(this, this.ws).then(res => {
        this.registerForm.idCard = res.cardno

        this.registerForm.name = res.name
        if (res.sex === '男') {
          this.registerForm.gender = '1'
        } else {
          this.registerForm.gender = '2'
        }

        this.registerForm.nation = res.nation
        this.registerForm.birthday = res.birthday
        this.registerForm.address = res.address
        this.registerForm.idissue = res.idissue
        this.registerForm.idBeginDate = res.idBeginDate
        this.registerForm.idEndDate = res.idEndDate
        this.registerForm.idPhoto = 'data:image/jpeg;base64,' + res.idpoto
      })
    },
    getWorkTypes() {
      getWorkTypesAll().then(res => {
        this.workTpes = res.data
      }).catch((e) => {
        console.log(e)
        //  this.$message.error()
      })
    },
    takePhoto() {
      if (this.isSvg2 || this.$refs['video'].srcObject === null) {
        this.$message({
          message: '未打开摄像头',
          type: 'warning'
        })
        return
      }
      photograph2(this).then(str => {
        this.take = true
        this.registerForm.visiblePhoto = str
      }).catch((e) => {
        console.log(e)
        this.$message.error('发生错误')
      })
    },
    openCamrea() {
      callCamera(this)
      this.isSvg2 = false
    },
    ocrDialog() {
      this.IDCardOCR = true
    },
    puloadOCRImg() {

    },
    imageOnchange(file) {
      var the = this
      if (file) {
        compressImg_bak2(file.raw).then(function(res) {
          the.idcardFontImg = 'data:image/jpeg;base64,' + res
        })
        // this.idcardFontImg = URL.createObjectURL(file.raw)
      }
    },
    beforeAvatarUpload(file) {
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
    },

    imageOnchange2(file) {
      var the = this
      if (file) {
        compressImg_bak2(file.raw).then(function(res) {
          the.idcardBackImg = 'data:image/jpeg;base64,' + res
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
    },
    uploadOCRImg() {
      const loading = this.$loading({
        lock: true,
        text: '正在进行识别...请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      uploadIdCard(this.idcardFontImg, this.idcardBackImg).then(res => {
        console.log(res)
        loading.close()
        if (res.code === 0) {
          this.IDCardOCR = false
          this.registerForm.idCard = res.data.idCard

          this.registerForm.name = res.data.name
          this.registerForm.gender = res.data.gender + ''
          this.registerForm.nation = res.data.nation
          this.registerForm.birthday = res.data.birthday
          this.registerForm.address = res.data.address
          this.registerForm.idissue = res.data.idissue
          this.registerForm.idBeginDate = res.data.idBeginDate
          this.registerForm.idEndDate = res.data.idEndDate
          this.registerForm.idPhoto = res.data.idPhoto
        }
      }).catch((e) => {
        console.log(e)
        this.$message.error('异常')
      })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.app-container {
  padding: 20px;
  display: table;
  width: 100%;
}
.from_class {
  display: table-cell;
  width: 50%;
}
.img-class {
  border: 1px dashed gainsboro;
  /* display: table-cell */
}
.card_svg {
  width: 20%;
}
.camreaStyle {
  border: 1px powderblue dashed;
  position: relative;
}
.svgCam {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
