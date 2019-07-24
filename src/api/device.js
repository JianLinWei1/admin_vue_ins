import request from '@/utils/request'

export function getStatus(params) {
  return request({
    url: '/device/getStatus',
    method: 'get',
    params
  })
}
export function getDevices(params) {
  return request({
    url: '/device/getDevices',
    method: 'get',
    params
  })
}

export function delDevice(params) {
  return request({
    url: '/device/delDevice',
    method: 'get',
    params
  })
}
export function getDevicesReload(params) {
  return request({
    url: '/device/getDevicesReload',
    method: 'get',
    params
  })
}
