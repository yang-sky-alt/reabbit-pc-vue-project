<template>
    <div class=" sub_category">
        <div class="container">
            <!-- 面包屑组件 -->
            <SubBread></SubBread>
            <!-- 筛选区 -->
            <SubFilter></SubFilter>
            <!-- 结果区域 -->
            <div class="goods-list">
                <!-- 排序 -->
                <SubSort @sort-change="sortChange" />
                <!-- 列表 -->
                <ul>
                    <li v-for="item in goodsList" :key="item.id">
                        <GoodsItem :goods="item" />
                    </li>
                </ul>
                <!-- 无线加载组件 -->
                <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
            </div>
        </div>
    </div>
</template>

<script>

import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort'
import { ref, watch } from 'vue'
import GoodsItem from './components/goods-item.vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
    name: ' SubCategory',
    components: { SubBread, SubFilter, SubSort, GoodsItem },
    setup() {
        const route = useRoute()
        // 加载中
        const loading = ref(false)
        // 是否加载完毕
        const finished = ref(false)
        // 商品列表数据
        const goodsList = ref([])
        // 请求参数
        let reqParams = {
            // 当前页
            page: 1,
            // 总页数
            pageSize: 20
        }
        const getData = () => {
            loading.value = true
            // 设置二级分类的Id
            reqParams.categoryId = route.params.id
            findSubCategoryGoods(reqParams).then(({ result }) => {
                // 获取数据成功
                if (result.items.length) {
                    goodsList.value.push(...result.items)
                    // 把页码改成下一页页码
                    reqParams.page++
                } else {
                    finished.value = true
                }
                loading.value = false
            })


        }
        // 在更改二级分类时重新加载数据
        watch(() => route.params.id, (newVal) => {
            if (newVal && `/category/sub/${newVal}` === route.path) {

                goodsList.value = []
                reqParams = {
                    // 当前页
                    page: 1,
                    // 总页数
                    pageSize: 20
                }
                finished.value = false
            }
        })
        // 更改排序组件的筛选条件 重新请求
        const sortChange = (sortParams) => {
            finished.value = false
            // 合并请求参数 保留之前参数
            reqParams = { ...reqParams, ...sortParams }
            reqParams.page = 1
            goodsList.value = []
        }
        return { getData, loading, finished, goodsList, sortChange }
    }

}
</script>

<style lang="less" scoped>
.goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;

    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 5px;

        li {
            margin-right: 20px;
            margin-bottom: 20px;

            &:nth-child(5n) {
                margin-right: 0;
            }
        }
    }
}
</style>
