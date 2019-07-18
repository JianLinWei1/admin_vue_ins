<template>
  <div class="facelogin">
    <!-- <div class="sign-btn" @click="wechatHandleClick('wechat')">
      <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span> 微信
    </div>
    <div class="sign-btn" @click="tencentHandleClick('tencent')">
      <span class="qq-svg-container"><svg-icon icon-class="qq" class="icon" /></span> QQ
    </div> -->
    <!-- <img src="@/assets/images/avatar.png" alt="摄像头" @click="callCamera"> -->
    <!--图片展示-->

    <div>

      <video ref="video" class="viode" width="320" height="240" autoplay />
      <canvas ref="canvas" width="320" height="240" style="display:none" />
    </div>
    <br>
    <br>
    <el-button type="primary" class="loginbutton" @click="photograph">
      {{ $t('login.logIn') }}
    </el-button>
    <div>将拍摄3秒视频进行活体检测,若登录的人脸有多个管理员则取匹配度最高的账号进行登录</div>

  </div>

</template>

<script>
// import openWindow from '@/utils/openWindow'
import { callCamera, recoderVideo, closeCamera } from '@/utils/camrea'

export default {
  name: 'SocialSignin',
  data() {
    return {
      form: {
        faceImg: null
      },
      str: null
    }
  },
  created: function() {
    this.callCamera()
  },
  methods: {
    callCamera() {
      callCamera(this)
    },

    async  photograph() {
      var str2 = await recoderVideo(this)

      const loading = this.$loading({
        lock: true,
        text: '正在进行登录...请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$store.dispatch('LoginByFace', str2).then((res) => {
        loading.close()

        if (res.code === 0) {
          this.closeCamera()
        }

        this.$router.push({ path: this.redirect || '/' })
      }).catch((e) => {
        loading.close()
      })
    },
    // 关闭摄像头
    closeCamera() {
      closeCamera(this)
    }
  }
}
</script>

<style >

    .viode{
       width: 64%;
       margin-top: -50px
    }
    .facelogin{
     text-align: center;
    }
    .loginbutton{
     width: 200px;
    height: 46px

    }

</style>
