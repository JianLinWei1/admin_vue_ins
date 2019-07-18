import request from '@/utils/request'

export function getAdminList(params) {
  return request({
    url: '/sys/getAdminList',
    method: 'get',
    params
  })
}

export function editAdmin(params) {
  const data = {
    userName: params.userName,
    password: params.password,
    faceImg: params.faceImg

  }
  return request({
    url: '/sys/editAdmin',
    method: 'post',
    data
  })
}
