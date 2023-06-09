<template>
    <div class="home-entry">
        <div class="container">
            <div class="home_entry">
                <!-- 左侧 -->
                <HomeCategory></HomeCategory>
                <!-- 轮播图 -->
                <HomeBanner></HomeBanner>
            </div>
        </div>
    </div>
    <!-- 新鲜好物 -->
    <HomeNew />
    <!-- 人气推荐 -->
    <HomeHot></HomeHot>
    <!-- 热门品牌 -->
    <HomeBrand></HomeBrand>
    <!-- 产品区块 -->
    <HomeProduct />
    <!-- 最新专题 -->
    <HomeSpecial></HomeSpecial>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial

  },
  setup () {

  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/mixins.less';
@import '../../assets/style/variables.less';
</style>
