<template>
  <!-- 顶部通栏 -->
  <AppTopnav />
  <!-- 吸顶头部组件 -->
  <AppHeaderSticky></AppHeaderSticky>
  <!-- 头部组件 -->
  <AppHeader />
  <!-- 内容容器 -->
  <div class="main">
    <!-- 二级路由 -->

    <RouterView />
  </div>
  <!-- 底部组件 -->
  <AppFooter></AppFooter>
</template>

<script>
import { useStore } from 'vuex'
import AppTopnav from '@/components/app-topnav'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
export default {
  name: 'VueLayout',
  components: { AppTopnav, AppHeader, AppFooter, AppHeaderSticky },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 600px;
}
</style>
