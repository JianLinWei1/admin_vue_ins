import { setTimeout } from 'timers'

export function callCamera(the) {
  // H5调用电脑摄像头API
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(success => {
    // 摄像头开启成功
    the.stream = success
    the.$refs['video'].srcObject = success
    // 实时拍照效果
    the.$refs['video'].play()
  // eslint-disable-next-line handle-callback-err
  }).catch(function(error) {
    console.log(error)

    console.log('打开摄像头失败')
  })
}
/**
 * 截取图片
 * @param {} the
 */
export function photograph(the) {
  const ctx = the.$refs['canvas'].getContext('2d')
  // 把当前视频帧内容渲染到canvas上
  ctx.drawImage(the.$refs['video'], 0, 0, 320, 240)
  // 转base64格式、图片格式转换、图片质量压缩
  const imgBase64 = the.$refs['canvas'].toDataURL('image/jpeg', 0.7)

  the.form.faceImg = imgBase64

  the.imageUrl = imgBase64

  // 由字节转换为KB 判断大小
  const str = imgBase64.replace('data:image/jpeg;base64,', '')
  const strLength = str.length
  const fileLength = parseInt(strLength - (strLength / 8) * 2)
  // 图片尺寸  用于判断
  const size = (fileLength / 1024).toFixed(2)
  console.log(size)

  // 上传拍照信息  调用接口上传图片 .........

  // 保存到本地
  // const ADOM = document.createElement('a')
  // ADOM.href = this.headImgSrc
  // ADOM.download = new Date().getTime() + '.jpeg'
  // ADOM.click()
}

export function photograph2(the) {
  return new Promise(function(resolve, reject) {
    const ctx = the.$refs['canvas'].getContext('2d')
    // 把当前视频帧内容渲染到canvas上
    ctx.drawImage(the.$refs['video'], 0, 0, 640, 480)
    // 转base64格式、图片格式转换、图片质量压缩
    const imgBase64 = the.$refs['canvas'].toDataURL('image/jpeg', 0.7)

    resolve(imgBase64)

    // 由字节转换为KB 判断大小
    const str = imgBase64.replace('data:image/jpeg;base64,', '')
    const strLength = str.length
    const fileLength = parseInt(strLength - (strLength / 8) * 2)
    // 图片尺寸  用于判断
    const size = (fileLength / 1024).toFixed(2)
    console.log(size)
  })

  // 上传拍照信息  调用接口上传图片 .........

  // 保存到本地
  // const ADOM = document.createElement('a')
  // ADOM.href = this.headImgSrc
  // ADOM.download = new Date().getTime() + '.jpeg'
  // ADOM.click()
}
export function recoderVideo(the) {
  return new Promise(function(resolve, reject) {
    let chunks = []; var recorderFile

    const recorder = new MediaRecorder(the.stream)
    recorder.ondataavailable = function(e) {
      chunks.push(e.data)
    }
    recorder.onstop = function(e) {
      recorderFile = new Blob(chunks, { 'type': recorder.mimeType })
      const reader = new FileReader()
      reader.onload = function(e) {
        resolve(e.target.result)
      }
      reader.readAsDataURL(recorderFile)
      chunks = []
    }
    recorder.start()

    setTimeout(() => {
      recorder.stop()
    }, 3000)
  })
}

export function closeCamera(the) {
  if (!the.$refs['video'].srcObject) return
  const stream = the.$refs['video'].srcObject
  const tracks = stream.getTracks()
  tracks.forEach(track => {
    track.stop()
  })
  the.$refs['video'].srcObject = null
}
