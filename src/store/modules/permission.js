import { asyncRoutes, constantRoutes } from '@/router'
// import Layout from '@/views/layout/Layout'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  debugger
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }

    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data

        let accessedRoutes

        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
        // getRoutes(asyncRoutes, roles)
        // commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
      })
    }
  }
}

// function getRoutes(routes, data) {
//   data.forEach(item => {
//     var childs = new Array(item.children.length - 1)
//     if (item.children) {
//       item.children.forEach(item2 => {
//         const chid = {
//           path: item2.path,
//           component: item2.component === '#' ? Layout : () => import(`${item2.component}`),
//           meta: { title: item2.meta.title, role: item2.meta.role },
//           name: item2.name

//         }
//         childs.push(chid)
//       })
//     }
//     const route = {
//       path: item.path,
//       component: item.component === '#' ? Layout : () => import(`${item.component}`),
//       // hidden: true,

//       children: childs,
//       alwaysShow: true,
//       meta: { title: item.meta.title, icon: item.meta.icon }

//     }
//     console.log(JSON.stringify(route))
//     routes.push(route)
//   })
// }

export default permission
