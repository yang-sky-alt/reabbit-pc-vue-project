<template>
    <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
        <ul class="carousel-body">
            <li class="carousel-item" v-for="(item, i) in sliders" :key="i" :class="{ fade: index === i }">
                <!-- 图片 -->
                <RouterLink to="/" v-if="item.imgUrl">
                    <img :src="item.imgUrl" alt="">
                </RouterLink>
                <!-- 商品列表 -->
                <div v-else class="slider">
                    <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
                        <img :src="goods.picture" alt="">
                        <p class="name ellipsis">{{ goods.name }}</p>
                        <p class="price">&yen;{{ goods.price }}</p>
                    </RouterLink>
                </div>
            </li>
        </ul>
        <a href="javascript:;" @click="toggle(-1)" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
        <a href="javascript:;" @click="toggle(1)" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
        <div class="carousel-indicator">
            <span v-for="i in 5" :key="i" @click="index = i"></span>
        </div>
    </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    // 定时器时间
    duration: {
      type: Number,
      default: 3000
    },
    // 是否开始自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    }
  },

  setup (props) {
    const index = ref(0)
    let timer = null
    const autoPlayFn = () => {
      clearInterval(timer)
      timer = setInterval(() => {
        index.value
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 需要监听sliders数据的变化,判断有数据且autoPlay为true
    watch(() => props.sliders, (newValue) => {
      if (newValue.length && props.autoPlay) {
        autoPlayFn()
      }
    }, { immediate: true })
    // 鼠标进入定时器关闭
    const stop = () => {
      if (timer) clearInterval(timer)
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }
    // 点击切换上一张 下一章
    const toggle = (step) => {
      const newIndex = index.value + step
      if (newIndex > props.sliders.length - 1) {
        index.value = 0
        return
      }
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      index.value = newIndex
    }
    // 组件消耗，清理定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { index, start, stop, toggle }
  }
}
</script>
<style scoped lang="less">
@import '@/assets/style/variables.less';

.xtx-carousel {
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 150px;
    position: relative;

    .carousel {
        &-body {
            width: 100%;
            height: 100%;
        }

        &-item {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            transition: opacity 0.5s linear;

            &.fade {
                opacity: 1;
                z-index: 1;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }

        &-indicator {
            position: absolute;
            left: 0;
            bottom: 20px;
            z-index: 2;
            width: 100%;
            text-align: center;

            span {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                cursor: pointer;

                ~span {
                    margin-left: 12px;
                }

                &.active {
                    background: #fff;
                }
            }
        }

        &-btn {
            width: 44px;
            height: 44px;
            background: rgba(0, 0, 0, .2);
            color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 228px;
            z-index: 2;
            text-align: center;
            line-height: 44px;
            opacity: 0;
            transition: all 0.5s;

            &.prev {
                left: 20px;
            }

            &.next {
                right: 20px;
            }
        }
    }

    &:hover {
        .carousel-btn {
            opacity: 1;
        }
    }
}

// 轮播商品
.slider {
    display: flex;
    justify-content: space-around;
    padding: 0 40px;

    >a {
        width: 240px;
        text-align: center;

        img {
            padding: 20px;
            width: 230px !important;
            height: 230px !important;
        }

        .name {
            font-size: 16px;
            color: #666;
            padding: 0 40px;
        }

        .price {
            font-size: 16px;
            color: @priceColor;
            margin-top: 15px;
        }
    }
}
</style>
