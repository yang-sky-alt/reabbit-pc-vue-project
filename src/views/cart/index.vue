<template>
    <div class="xtx-cart-page">
        <div class="container">
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem>购物车</XtxBreadItem>
            </XtxBread>
            <div class="cart">
                <table>
                    <thead>
                        <tr>
                            <th width="120">
                                <XtxCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选
                                </XtxCheckbox>
                            </th>
                            <th width="400">商品信息</th>
                            <th width="220">单价</th>
                            <th width="180">数量</th>
                            <th width="180">小计</th>
                            <th width="140">操作</th>
                        </tr>
                    </thead>
                    <!-- 有效商品 -->
                    <tbody>
                        <tr v-if="$store.getters['cart/validList'].length === 0">
                            <td colspan="6">
                                <CartNone />
                            </td>
                        </tr>
                        <tr v-for="item in $store.getters['cart/validList']" :key="item.skuId">
                            <td>
                                <XtxCheckbox @change="($event) => checkOne(item.skuId, $event)"
                                    :modelValue="item.selected" />
                            </td>
                            <td>
                                <div class="goods">
                                    <RouterLink :to="`/product/${item.id}`"><img :src="item.picture" alt=""></RouterLink>
                                    <div>
                                        <p class="name ellipsis">{{ item.name }}</p>
                                        <!-- 选择规格组件 -->
                                        <CartSku :attrsText="item.attrsText" :skuId="item.skuId"
                                            @change="$event => updateCartSku(item.skuId, $event)" />
                                    </div>
                                </div>
                            </td>
                            <td class="tc">
                                <p>&yen;{{ item.nowPrice }}</p>
                                <p v-if="item.price - item.nowPrice > 0">比加入时降价 <span class="red">&yen;{{ item.price -
                                    item.nowPrice }}</span></p>
                            </td>
                            <td class="tc">
                                <XtxNumbox :modelValue="item.count" :max="item.stock"
                                    @change="$event => updataCount(item.skuId, $event)" />
                            </td>
                            <td class="tc">
                                <p class="f16 red">&yen;{{ item.nowPrice * item.count }}</p>
                            </td>
                            <td class="tc">
                                <p><a href="javascript:;">移入收藏夹</a></p>
                                <p><a class="green" href="javascript:;" @click="deleteCart(item.skuId)">删除</a></p>
                                <p><a href="javascript:;">找相似</a></p>
                            </td>
                        </tr>
                    </tbody>
                    <!-- 无效商品 -->
                    <tbody v-if="$store.getters['cart/invalidList'].length">
                        <tr>
                            <td colspan="6">
                                <h3 class="tit">失效商品</h3>
                            </td>
                        </tr>
                        <tr v-for="item in $store.getters['cart/invalidList']" :key="item.skuId">
                            <td>
                                <XtxCheckbox style="color:#eee;" />
                            </td>
                            <td>
                                <div class="goods">
                                    <RouterLink :to="`/product/${item.id}`">
                                        <img :src="item.picture" alt="">
                                    </RouterLink>
                                    <div>
                                        <p class="name ellipsis">{{ item.name }}</p>
                                        <p class="attr">{{ item.attrsText }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="tc">
                                <p>&yen;{{ item.nowPrice }}</p>
                            </td>
                            <td class="tc">{{ item.count }}</td>
                            <td class="tc">
                                <p>&yen;{{ item.nowPrice * item.count }}</p>
                            </td>
                            <td class="tc">
                                <p><a class="green" href="javascript:;" @click="deleteCart(goods.skuId)">删除</a></p>
                                <p><a href="javascript:;">找相似</a></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 操作栏 -->
            <div class="action">
                <div class="batch">
                    <XtxCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</XtxCheckbox>
                    <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
                    <a href="javascript:;">移入收藏夹</a>
                    <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
                </div>
                <div class="total">
                    共 {{ $store.getters['cart/validTotal'] }} 件商品，已选择 {{ $store.getters['cart/selectedTotal'] }} 件，商品合计：
                    <span class="red">¥{{
                        $store.getters['cart/selectedAmount'] }}</span>
                    <XtxButton type="primary" @click="checkout()">下单结算</XtxButton>
                </div>
            </div>
            <!-- 猜你喜欢 -->
            <GoodRelevant />
        </div>
    </div>
</template>

<script>
import GoodRelevant from '@/views/goods/components/goods-relevant.vue'
import CartSku from './components/cart-sku'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import CartNone from './components/cart-none.vue'
import Confirm from '@/components/library/confirm'
import { useRouter } from 'vue-router'
export default {
    name: 'XtxCartPage',
    components: { GoodRelevant, CartNone, CartSku },
    setup() {
        const store = useStore()
        const router = useRouter()
        // 单选
        const checkOne = (skuId, selected) => {
            store.dispatch('cart/updateCart', { skuId, selected })
        }

        // 全选
        const checkAll = (selected) => {
            store.dispatch('cart/checkAllCart', selected)
        }
        // 删除
        const deleteCart = (skuId) => {
            Confirm({ text: '亲,您是否确认删除商品' }).then(() => {
                store.dispatch('cart/deleteCart', skuId).then(() => {
                    Message({ type: 'success', text: '删除成功' })
                })
            }).catch(e => {
                console.log(e);
            })
        }
        // 删除选中
        const batchDeleteCart = (isClear) => {
            Confirm({ text: `亲,您是否删除${isClear ? '失效' : '选中'}商品` }).then(() => {
                store.dispatch('cart/batchDeleteCart', isClear).then(() => {
                    Message({ type: 'success', text: '删除成功' })
                })
            }).catch(e => {
                console.log(e);
            })
        }
        // 修改数量
        const updataCount = (skuId, count) => {
            store.dispatch('cart/updateCart', { skuId, count })
        }
        // 规格修改
        const updateCartSku = (oldSkuId, newSku) => {
            store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
        }
        // 结算
        const checkout = () => {
            // 判断选中商品且提示
            if (store.getters['cart/selectedList'].length === 0) return Message({ text: "至少勾选一件商品进行结算" })
            // 弹出一个确认框 提示:下单结算需要登录

            if (!store.state.user.profile.token) {
                Confirm({ text: "下单结算需要登录,现在去登录吗?" }).then(() => {
                    router.push('/member/checkout')
                }).catch(e => {

                })
            } else {
                router.push('/member/checkout')
            }
            // 准备一个登录拦截 遇见一个需要登录的路由跳转 拦截到登录的页面



        }
        return { checkOne, checkAll, deleteCart, batchDeleteCart, updataCount, updateCartSku, checkout }
    }
}
</script>

<style lang="less" scoped>
@import '@/assets/style/variables.less';

.tc {
    text-align: center;

    .xtx-numbox {
        margin: 0 auto;
        width: 120px;
    }
}

.red {
    color: @priceColor;
}

.green {
    color: @xtxColor
}

.f16 {
    font-size: 16px;
}

.goods {
    display: flex;
    align-items: center;

    img {
        width: 100px;
        height: 100px;
    }

    >div {
        width: 280px;
        font-size: 16px;
        padding-left: 10px;

        .attr {
            font-size: 14px;
            color: #999;
        }
    }
}

.action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;

    .xtx-checkbox {
        color: #999;
    }

    .batch {
        a {
            margin-left: 20px;
        }
    }

    .red {
        font-size: 18px;
        margin-right: 20px;
        font-weight: bold;
    }
}

.tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
}

.xtx-cart-page {
    .cart {
        background: #fff;
        color: #666;

        table {
            border-spacing: 0;
            border-collapse: collapse;
            line-height: 24px;

            th,
            td {
                padding: 10px;
                border-bottom: 1px solid #f5f5f5;

                &:first-child {
                    text-align: left;
                    padding-left: 30px;
                    color: #999;
                }
            }

            th {
                font-size: 16px;
                font-weight: normal;
                line-height: 50px;
            }
        }
    }
}
</style>