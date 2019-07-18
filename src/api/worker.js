import request from '@/utils/request'

export function insertWorkType(params) {
  const data = {
    workTypeName: params.workTypeName,
    workTypeDescription: params.workTypeDescription
  }
  return request({
    url: '/worker/insertWorkType',
    method: 'post',
    data
  })
}

export function getWorkTypes(params) {
  return request({
    url: '/worker/getWorkTypes',
    method: 'get',
    params
  })
}

export function delWorkType(params) {
  return request({
    url: '/worker/delWorkTypeById?id=' + params,
    method: 'post'
  })
}

export function updateWorkType(params) {
  const data = {
    id: params.id,
    workTypeName: params.workTypeName,
    workTypeDescription: params.workTypeDescription

  }
  return request({
    url: '/worker/updateWorkType',
    method: 'post',
    data
  })
}

export function getWorkTypesAll() {
  return request({
    url: '/worker/getWorkTypeALL',
    method: 'get'
  })
}

export function uploadIdCard(params, params2) {
  const data = {
    frontImg: params,
    backImg: params2
  }

  return request({
    url: '/worker/uploadIDcardImg',
    method: 'post',
    data
  })
}

export function addWorkerInfo(data) {
  return request({
    url: '/worker/addWorkerInfo',
    method: 'post',
    data
  })
}
export function getWorkerInfos(params) {
  return request({
    url: '/worker/getWokerInfos',
    method: 'get',
    params
  })
}
export function getWorkerInfosReload(params) {
  return request({
    url: '/worker/getWokerInfosReload',
    method: 'get',
    params
  })
}
export function delWokerInfoByIdcard(params) {
  return request({
    url: '/worker/delWokerInfoByIdcard',
    method: 'post',
    params
  })
}
