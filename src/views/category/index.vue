<template>
    <div class="top-category">
        <div class="container">
            <!-- 面包屑 -->
            <transition name="fade-right" mode="out-in">
                <XtxBread>
                    <XtxBreadItem to="/">首页</XtxBreadItem>
                    <Transition name="fade-right" mode="out-in">
                        <XtxBreadItem :key="topCategory.id">{{ topCategory.name }}</XtxBreadItem>
                    </Transition>
                </XtxBread>
            </transition>
            <!-- 轮播图 -->
            <XtxCarousel :sliders="sliders" style="height:500px" />
            <!-- 所有二级分类 -->
            <div class="sub-list" v-if="topCategory && topCategory.children">
                <h3>全部分类</h3>
                <ul>
                    <li v-for="item in topCategory.children" :key="item.id">
                        <a href="javascript:;">
                            <img :src="item.picture">
                            <p>{{ item.name }}</p>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 不同分类商品 -->
            <div class="ref-goods" v-for="item in subList" :key="item.id">
                <div class="head">
                    <h3>- {{ item.name }} -</h3>
                    <p class="tag">{{ item.desc }}</p>
                    <XtxMore :path="`/category/sub/${subList.id}`"></XtxMore>
                </div>
                <div class="body">
                    <GoodsItem v-for="goods in item.goods" :key="goods.id" :goods="goods" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
import { findBanner } from '@/api/home'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
name: 'TopCategory'
export default {
  components: {
    GoodsItem
  },
  setup () {
    // 获取轮播图数据
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    // 面包屑+所有分类
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      // 当前顶级分类 === 根据路由上的id去vuex中category模块的list中查找
      let cate = {}
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    // 获取各个自己目录下的推荐商品
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    watch(() => route.params.id, (newVal) => {
      newVal && getSubList()
    }, { immediate: true })
    return {
      sliders,
      topCategory,
      subList
    }
  }

}
</script>

<style lang="less" scoped>
@import '@/assets/style/variables.less';
@import '@/assets/style/common.less';

.top-category {
    h3 {
        font-size: 28px;
        color: #666;
        font-weight: normal;
        text-align: center;
        line-height: 100px;
    }

    .sub-list {
        margin-top: 20px;
        background-color: #fff;

        ul {
            display: flex;
            padding: 0 32px;
            flex-wrap: wrap;

            li {
                width: 168px;
                height: 160px;

                a {
                    text-align: center;
                    display: block;
                    font-size: 16px;

                    img {
                        width: 100px;
                        height: 100px;
                    }

                    p {
                        line-height: 40px;
                    }

                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }

    .ref-goods {
        background-color: #fff;
        margin-top: 20px;
        position: relative;

        .head {
            .xtx-more {
                position: absolute;
                top: 20px;
                right: 20px;
            }

            .tag {
                text-align: center;
                color: #999;
                font-size: 20px;
                position: relative;
                top: -20px;
            }
        }

        .body {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding: 0 65px 30px;
        }
    }
}
</style>
