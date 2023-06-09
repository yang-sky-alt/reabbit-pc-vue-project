<template>
    <div class="app-header-sticky" :class="{ show: y >= 78 }">
        <div class="container">
            <RouterLink class="logo" to="/" />
            <AppHeaderNav />
            <div class="right">
                <RouterLink to="/">品牌</RouterLink>
                <RouterLink to="/">专题</RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import AppHeaderNav from './app-header-nav'
export default {
  name: 'AppHeaderSticky',
  components: { AppHeaderNav },
  setup () {
    // 记录Y轴卷曲的高度
    const y = ref(0)
    // 当你页面滚动的时候更新它
    onMounted(() => {
      window.onscroll = () => {
        const scrollTop = document.documentElement.scrollTop
        y.value = scrollTop
      }
    })
    // 提供给模版使用
    return { y }
  }
}
</script>

<style scoped lang='less'>
@import '../assets/style/variables.less';

.app-header-sticky {
    transform: translateY(-100%);
    opacity: 0;
    width: 100%;
    height: 80px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;

    &.show {
        transform: none;
        opacity: 1;
        transition: all 0.3s linear;
    }

    .container {
        display: flex;
        align-items: center;
    }

    .logo {
        width: 200px;
        height: 80px;
        background: url(../assets/images/logo.png) no-repeat right 2px;
        background-size: 160px auto;
    }

    .right {
        width: 220px;
        display: flex;
        text-align: center;
        padding-left: 40px;
        border-left: 2px solid @xtxColor;

        a {
            width: 38px;
            margin-right: 40px;
            font-size: 16px;
            line-height: 1;

            &:hover {
                color: @xtxColor;
            }
        }
    }
}
</style>
