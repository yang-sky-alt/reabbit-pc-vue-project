<template>
    <div class="goods-comment">
        <!-- 评价头部 -->
        <div class="head" v-if="commentInfo">
            <div class="data">
                <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
                <p><span>99.99%</span><span>好评率</span></p>
            </div>
            <div class="tags">
                <div class="dt">大家都在说：</div>
                <div class="dd">
                    <a href="javascript:;" v-for="(item, i) in commentInfo.tags" :key="item.title" @click="changeTag(i)"
                        :class="{ active: currTagIndex === i }">{{ item.title
                        }}{{ item.tagCount }}
                    </a>
                </div>
            </div>
        </div>
        <div class="sort">
            <span>排序：</span>
            <a href="javascript:;" @click="changeSort(null)" :class="{ active: reqParams.sortField === null }">默认</a>
            <a href="javascript:;" @click="changeSort('createTime')"
                :class="{ active: reqParams.sortField === 'createTime' }">最新</a>
            <a href="javascript:;" @click="changeSort('praiseCount')"
                :class="{ active: reqParams.sortField === 'praiseCount' }">最热</a>
        </div>
        <!-- 评价列表 -->
        <div class="list" v-if="commentList">
            <div class="item" v-for="item in commentList" :key="item.id">
                <div class="user">
                    <img :src="item.member.avatar" alt="">
                    <span>{{ formatNickname(item.member.nickname) }}</span>
                </div>
                <div class="body">
                    <div class="score">
                        <i class="iconfont icon-wjx01" v-for="i in item.score" :key="i + 's'"></i>
                        <i class="iconfont icon-wjx02" v-for="i in 5 - item.score" :key="i + 'k'"></i>
                        <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
                    </div>
                    <div class="text">{{ item.content }}</div>
                    <!-- 评论图片 -->
                    <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"></GoodsCommentImage>
                    <div class="time">
                        <span>{{ item.createTime }}</span>
                        <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue'
import { findCommentInfoByGoods, findGoodsCommentList } from '@/api/product'
import GoodsCommentImage from './goods-comment-image'

export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup () {
    // 评价信息
    const commentInfo = ref(null)
    const goods = inject('goods')
    // 获取头部数据
    findCommentInfoByGoods(goods.value.id).then(data => {
      // 设置数据之前 在tags数组之前追加 有图tags和全部评价
      data.result.tags.unshift({ title: '有图', tagCount: data.result.hasPictureCount, type: 'img' })
      data.result.tags.unshift({ title: '全部评价', tagCount: data.result.evaluateCount, type: 'all' })
      commentInfo.value = data.result
    })
    // 激活tag
    const currTagIndex = ref(0)
    const changeTag = (i) => {
      currTagIndex.value = i
      // 点击tag的时候修改筛选条件
      const tag = commentInfo.value.tags[i]
      if (tag.type == 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type == 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = true
        reqParams.tag = tag.title
      }
      // 将页码重置为1
      reqParams.page = 1
    }
    // 点击排序
    const changeSort = (sort) => {
      reqParams.sortField = sort
      // 将页码重置为1
      reqParams.page = 1
    }
    // 准备筛选条件数据
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 排序方式 praiseCount热度 createTime最新
      sortField: null
    })
    // 初始化需要发送请求 筛选条件发生改变发送请求
    const commentList = ref([])
    watch(reqParams, async () => {
      const data = await findGoodsCommentList(goods.id, reqParams)
      commentList.value = data.result.items
    }, { immediate: true })
    // 定义转换数据的函数(对应vue2的过滤器)
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}:${c.nameValue}`, '').trim()
    }
    // 呢称处理
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }
    return { commentInfo, currTagIndex, changeTag, reqParams, changeSort, commentList, formatSpecs, formatNickname }
  }
}
</script>
<style scoped lang="less">
@import '@/assets/style/variables.less';

.goods-comment {
    .head {
        display: flex;
        padding: 30px 0;

        .data {
            width: 340px;
            display: flex;
            padding: 20px;

            p {
                flex: 1;
                text-align: center;

                span {
                    display: block;

                    &:first-child {
                        font-size: 32px;
                        color: @priceColor;
                    }

                    &:last-child {
                        color: #999;
                    }
                }
            }
        }

        .tags {
            flex: 1;
            display: flex;
            border-left: 1px solid #f5f5f5;

            .dt {
                font-weight: bold;
                width: 100px;
                text-align: right;
                line-height: 42px;
            }

            .dd {
                flex: 1;
                display: flex;
                flex-wrap: wrap;

                >a {
                    width: 132px;
                    height: 42px;
                    margin-left: 20px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    border: 1px solid #e4e4e4;
                    background: #f5f5f5;
                    color: #999;
                    text-align: center;
                    line-height: 40px;

                    &:hover {
                        border-color: @xtxColor;
                        background: lighten(@xtxColor, 50%);
                        color: @xtxColor;
                    }

                    &.active {
                        border-color: @xtxColor;
                        background: @xtxColor;
                        color: #fff;
                    }
                }
            }
        }
    }

    .sort {
        height: 60px;
        line-height: 60px;
        border-top: 1px solid #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
        margin: 0 20px;
        color: #666;

        >span {
            margin-left: 20px;
        }

        >a {
            margin-left: 30px;

            &.active,
            &:hover {
                color: @xtxColor;
            }
        }
    }

    .list {
        padding: 0 20px;

        .item {
            display: flex;
            padding: 25px 10px;
            border-bottom: 1px solid #f5f5f5;

            .user {
                width: 160px;

                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    overflow: hidden;
                }

                span {
                    padding-left: 10px;
                    color: #666;
                }
            }

            .body {
                flex: 1;

                .score {
                    line-height: 40px;

                    .iconfont {
                        color: #ff9240;
                        padding-right: 3px;
                    }

                    .attr {
                        padding-left: 10px;
                        color: #666;
                    }
                }
            }

            .text {
                color: #666;
                line-height: 24px;
            }

            .time {
                color: #999;
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
            }
        }
    }
}
</style>
