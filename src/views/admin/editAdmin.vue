<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="修改密码">
        <el-input v-model="form.password" placeholder="不填则不修改" type="password" />
      </el-form-item>
      <el-form-item label="人脸照片">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-change="imageOnchange"
          :before-upload="beforeUpload"
          :auto-upload="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
          <div class="el-text">点击+上传</div>
        </el-upload>
      </el-form-item>

      <div class="camreaStyle">
        <video ref="video" width="296" height="170" autoplay @click="openCamrea" />
        <svg-icon v-if="isSvg === true" icon-class="camrea" style="width:60px;height:60px" class-name="svgCam" />
        <div class="el-text">点击并打开摄像头拍照上传</div>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认提交</el-button>
        <el-button type="success" @click="takePhoto">拍照</el-button>
      </el-form-item>
    </el-form>
    <canvas ref="canvas" style="display:none" width="320" height="240" />
  </div>
</template>
<script>
import { compressImg_bak2 } from '@/utils/compressImg'
import { editAdmin } from '@/api/admin'
import { callCamera, closeCamera, photograph } from '@/utils/camrea'

export default {
  name: 'EditAdmin',
  data() {
    return {
      form: {
        userName: '',
        password: null,
        faceImg: ''
      },
      imageUrl: '',
      isSvg: true,
      fullscreenLoading: false
    }
  },
  created: function() {
    this.form.userName = sessionStorage.getItem('username')
  },

  methods: {
    imageOnchange(file) {
      var the = this
      if (file) {
        compressImg_bak2(file.raw).then(function(res) {
          the.form.faceImg = res
        })
        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onSubmit() {
      if (this.imageUrl === '' || this.imageUrl === null) {
        this.$message('请拍照或上传照片')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '数据提交中，正在进行人脸检测，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      editAdmin(this.form).then(res => {
        loading.close()
        if (res.code === 0) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        } else {
          loading.close()
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      }).catch((e) => {
        loading.close()
        this.$message.error('发生错误')
        console.log(e)
      })
    },
    openCamrea() {
      this.isSvg = false
      callCamera(this)
    },
    closeCamrea() {
      this.isSvg = true
      closeCamera(this)
    },
    takePhoto() {
      if (this.isSvg === true) {
        this.$message('摄像头未打开')
        return
      }

      photograph(this)
    }

  }
}
</script>
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
    width: 200px;
    height: 178px;
    display: block;
  }

</style>
<style scoped>
.camreaStyle {
      margin-left: 300px;
        border: 1px powderblue dashed;
    margin-top: -250px;
    margin-bottom: 60px;
    text-align: center;
    height: 220px;
  }
  .svgCam{

       margin-bottom: 80px;
    margin-top: -200px;
        margin-left: -54%;
  }
</style>

