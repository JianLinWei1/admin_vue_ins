import request from '@/utils/request'

export function loginByUsername(userName, password) {
  const data = {
    userName,
    password
  }
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/sys/getUserInfo',
    method: 'post',
    params: { token }
  })
}

export function faceLogin(str) {
  const data = {
    str: str
  }
  return request({
    url: '/sys/faceLogin',
    method: 'post',
    data
  })
}

