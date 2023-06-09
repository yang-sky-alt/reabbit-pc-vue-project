<template>
    <div class="goods-tabs">
        <nav>
            <a :class="{ active: activeName === 'GoodsDetail' }" @click="activeName = 'GoodsDetail'"
                href="javascript:;">商品详情</a>
            <a :class="{ active: activeName === 'GoodsComment' }" @click="activeName = 'GoodsComment'"
                href="javascript:;">商品评价<span>{{ goods.commentCount }}</span>
            </a>
        </nav>
        <!-- 切换内容的地方 -->
        <!-- 在vue中动态切换组件其实可以使用动态组件componet组件  -->
        <!-- <GoodsDetail v-if="activeName === 'GoodsDetial'"></GoodsDetail>
        <GoodsComment v-else></GoodsComment> -->
        <!-- is属性来决定component动态组件渲染为那个组件 组件的名称 -->
        <component :is="activeName"></component>
    </div>
</template>

<script>
import { ref, inject } from 'vue'
import GoodsComment from './goods-comment.vue'
import GoodsDetail from './goods-detail.vue'
export default {
  name: 'GoodsTabs',
  components: {
    GoodsComment, GoodsDetail
  },
  setup () {
    // activeName的值是 GoodsDetial和GoodsComment
    const activeName = ref('GoodsDetail')
    // 详情数据
    const goods = inject('goods')
    return { activeName, goods }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/style/variables.less';

.goods-tabs {
    min-height: 600px;
    background: #fff;

    nav {
        height: 70px;
        line-height: 70px;
        display: flex;
        border-bottom: 1px solid #f5f5f5;

        a {
            padding: 0 40px;
            font-size: 18px;
            position: relative;

            >span {
                color: @priceColor;
                font-size: 16px;
                margin-left: 10px;
            }

            &:first-child {
                border-right: 1px solid #f5f5f5;
            }

            &.active {
                &::before {
                    content: "";
                    position: absolute;
                    left: 40px;
                    bottom: -1px;
                    width: 72px;
                    height: 2px;
                    background: @xtxColor;
                }
            }
        }
    }
}
</style>
