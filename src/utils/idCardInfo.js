
export function initWs(the) {
  return new Promise(function(resolve, reject) {
    var ws = new WebSocket('ws://127.0.0.1:8086/ReadCardServer/ws')
    if (window.WebSocket) {
      ws.onopen = function(evt) {
        console.log('连接成功')
        resolve(ws)
      }
      ws.onclose = function(evt) {
        console.log('连接关闭')
      }

      ws.onerror = function(evt) {
        the.$message({
          message: '未连接到读卡服务',
          type: 'warning'
        })
      }
    } else {
      the.$message({
        message: '浏览器不支持',
        type: 'warning'
      })
    }
  })
}

export function getIDCardInfo(the, ws) {
  return new Promise(function(resolve, reject) {
    ws.send('get')
    ws.onmessage = function(evt) {
      var idInfo = JSON.parse(evt.data)

      resolve(idInfo)
    }
    ws.onerror = function(evt) {
      the.$message({
        message: '与服务服务通信异常',
        type: 'warning'
      })
    }
  })
}
