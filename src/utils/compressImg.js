/**
 *
 */

export function compressImg(file) {
  var img = new Image()
  var canvas = document.createElement('canvas')
  var drawer = canvas.getContext('2d')
  console.log(drawer)
  img.src = file
  console.log(img.width)
}
export function compressImg_bak2(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    var img = new Image()
    var canvas = document.createElement('canvas')
    var drawer = canvas.getContext('2d')
    reader.readAsDataURL(file)
    reader.onload = function(e) {
      img.src = this.result
      img.onload = function() {
        if (this.width > 640) {
          canvas.width = 640
          canvas.height = 640 * (this.height / this.width)
          drawer.drawImage(this, 0, 0, canvas.width, canvas.height)
          this.src = canvas.toDataURL('image/jpeg', 0.8)
          resolve(this.src.split(',')[1])
        } else {
          resolve(this.src.split(',')[1])
        }
      }
    }
  })
}

export function compressImg_bak(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    var img = new Image()
    var canvas = document.createElement('canvas')
    var drawer = canvas.getContext('2d')
    console.log(drawer)
    reader.readAsDataURL(file)
    img.src = reader.result
    reader.onload = function(e) {
      var imgBase = e.target.result
      /* img.src = imgBase;	 */
      console.log(img.width)
      if (img.width > 640) {
        resolve('打印')
        resolve(imgBase.split(',')[1])
      }
      resolve(img.width)
    }
  })
}
