import request from '@/utils/request'

export function getWorkerCaptureInfos(params) {
  return request({
    url: '/capture/getWorkerCaptureInfos',
    method: 'get',
    params
  })
}

export function getWorkerCaptureInfosReload(params) {
  return request({
    url: '/capture/getWorkerCaptureInfosReload',
    method: 'get',
    params
  })
}

export function delWorkerCaptureInfosByUUID(params) {
  return request({
    url: '/capture/delWorkerCaptureInfosByUUID',
    method: 'post',
    params
  })
}
export function getStrangerCaptures(params) {
  return request({
    url: '/capture/getStrangerCaptures',
    method: 'get',
    params
  })
}

export function delStrangerCaptureById(params) {
  return request({
    url: '/capture/delStrangerCaptureById',
    method: 'post',
    params
  })
}

