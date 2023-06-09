import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/views/Layout.vue')
import store from '@/store'
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index.vue')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback.vue')
const Cart = () => import('@/views/cart/index.vue')
const Result = () => import('@/views/member/pay/result')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    // 二级路由
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/category/:id',
        component: TopCategory
      },
      {
        path: '/category/sub/:id',
        component: SubCategory
      },
      {
        path: '/product/:id', component: Goods
      },
      {
        path: '/cart', component: Cart
      },
      { path: '/member/checkout', component: PayCheckout },
      { path: '/member/pay', component: PayIndex },
      { path: 'pay/callback', component: Result }
    ]
  },
  { path: '/login', component: Login },
  {
    path: '/login/callback', component: LoginCallback
  }


]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候滚动到页面的顶部
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})
// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})
export default router
