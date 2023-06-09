<template>
    <div class="checkout-address">
        <div class="text">
            <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
            <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ showAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') }}</li>
                <li><span>收货地址：</span>{{ showAddress.fullLocation }} {{ showAddress.address }}</li>
            </ul>
            <a href="javascript:;" @click="openAddressEdit(showAddress)" v-if="showAddress">修改地址</a>
        </div>
        <div class="action">
            <XtxButton class="btn" @click="openDialog()">切换地址</XtxButton>
            <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
        </div>
        <!-- 切换收货地址 -->
        <XtxDialog title="添加地址" v-model:visible="visibleDialog">
            <div class="text item" @click="selectedAddress = item"
                :class="{ action: selectedAddress && selectedAddress.id === item.id }" v-for="item in list" :key="item.id">
                <ul>
                    <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
                    <li><span>联系方式：</span>{{ item.contact }}</li>
                    <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '') + item.address }}</li>
                </ul>
            </div>
            <template v-slot:footer>
                <XtxButton type="gray" style="margin-right:20px" @click="visibleDialog = false">取消</XtxButton>
                <XtxButton type="primary" @click="confirmAddressFn()">确认</XtxButton>
            </template>
        </XtxDialog>
        <!-- 添加修改收货地址 -->
        <AddressEdit ref="addressEditCom" @on-success="successHandler"> </AddressEdit>
    </div>
</template>
<script>
import { ref } from 'vue';
import AddressEdit from './address-edit.vue'
export default {
    name: 'CheckoutAddress',
    props: {
        // 收货地址列表
        list: {
            type: Array,
            default: () => []
        },
    },
    components: {
        AddressEdit
    },
    setup(props, { emit }) {
        // 切换地址对话框显示隐藏
        const visibleDialog = ref(false)
        const showAddress = ref(null)
        // 记录当前你选中地址的ID
        const selectedAddress = ref(null)
        // 找到默认收货地址
        const defaultAddress = props.list.find(item => item.isDefault === 0)
        // 没有默认收货地址 使用第一条数据
        if (defaultAddress) {
            showAddress.value = defaultAddress
        } else {
            if (props.list.length) {
                // 加上一个注释：忽略下面代码的检查eslint
                // eslint-disable-next-line vue/no-setup-props-destructure
                showAddress.value = props.list[0]
            }
        }
        // 默认通知父组件一个收货地址ID
        emit('change', showAddress.value && showAddress.value.id)
        const confirmAddressFn = () => {
            // 显示的地址换成选中的地址
            showAddress.value = selectedAddress.value
            // 把选中的地址ID通知给结算组件
            emit('change', selectedAddress.value?.id)
            visibleDialog.value = false
        }
        const openDialog = () => {
            // 将之前选中地址置为空
            selectedAddress.value = null
            visibleDialog.value = true
        }
        // 打开添加修改收货地址组件
        const addressEditCom = ref(null)
        const openAddressEdit = (address) => {
            // 添加空对象 修改传数据
            addressEditCom.value.open(address)
        }
        const successHandler = (formData) => {
            // 根据formData中的ID去当前地址列表中查找 有就是修改 否则是添加
            const address = props.list.find(item => item.id === formData.id)
            if (address) {
                for (const key in address) {
                    address[key] = formData[key]
                }
            } else {
                const json = JSON.stringify(formData)  // 需要克隆下，不然使用的是对象的引用
                // 如果是添加 往list追加一条
                props.list.unshift(JSON.parse(json))
            }

        }
        return { showAddress, visibleDialog, selectedAddress, confirmAddressFn, openDialog, addressEditCom, openAddressEdit, successHandler }
    }
}
</script>
<style scoped lang="less">
@import '@/assets/style/variables.less';

.checkout-address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;

    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;

        .none {
            line-height: 90px;
            color: #999;
            text-align: center;
            width: 100%;
        }

        >ul {
            flex: 1;
            padding: 20px;

            li {
                line-height: 30px;

                span {
                    color: #999;
                    margin-right: 5px;

                    >i {
                        width: 0.5em;
                        display: inline-block;
                    }
                }
            }
        }

        >a {
            color: @xtxColor;
            width: 160px;
            text-align: center;
            height: 90px;
            line-height: 90px;
            border-right: 1px solid #f5f5f5;
        }
    }

    .action {
        width: 420px;
        text-align: center;

        .btn {
            width: 140px;
            height: 46px;
            line-height: 44px;
            font-size: 14px;

            &:first-child {
                margin-right: 10px;
            }
        }
    }
}
</style>