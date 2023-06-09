<template>
    <XtxDialog :title="`${formData.id ? '修改' : '添加'}收货地址`" v-model:visible="dialogVisible">
        <div class="address-edit">
            <div class="xtx-form">
                <div class="xtx-form-item">
                    <div class="label">收货人：</div>
                    <div class="field">
                        <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">手机号：</div>
                    <div class="field">
                        <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地区：</div>
                    <div class="field">
                        <XtxCity placeholder="请选择所在地区" @change="changeCity" :fullLocation="formData.fullLocation" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">详细地址：</div>
                    <div class="field">
                        <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">邮政编码：</div>
                    <div class="field">
                        <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地址标签：</div>
                    <div class="field">
                        <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <XtxButton type="gray" style="margin-right:20px" @click="dialogVisible = false">取消</XtxButton>
            <XtxButton type="primary" @click="submit()">确认</XtxButton>
        </template>
    </XtxDialog>
</template>
<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/order'
export default {
    name: 'AddressEdit',
    setup(props, { emit }) {
        const dialogVisible = ref(false)
        // 打开函数
        const open = (address) => {
            dialogVisible.value = true
            if (address.id) {
                // 修改
                for (const key in address) {
                    formData[key] = address[key]
                }
            } else {
                // 如果添加 清空表单数据
                for (const key in formData) {
                    if (key === 'isDefault') {
                        formData[key] = 1
                    } else {
                        formData[key] = null
                    }

                }
            }

        }
        // 表单数据
        const formData = reactive({
            receiver: '',
            contact: '',
            provinceCode: '',
            cityCode: '',
            countyCode: '',
            address: '',
            postalCode: '',
            addressTags: '',
            isDefault: 0,
            fullLocation: ''
        })
        // 选择地区
        const changeCity = (data) => {
            formData.provinceCode = data.provinceCode
            formData.cityCode = data.cityCode
            formData.countyCode = data.countyCode
            formData.fullLocation = data.fullLocation
        }
        // 提交数据
        const submit = () => {
            if (formData.id) {
                // 修改请求
                editAddress(formData).then(data => {
                    // 修改成功
                    Message({ text: "修改收货地址成功", type: "success" })
                    // 关闭
                    dialogVisible.value = false
                    // 触发自定义事件
                    emit('on-success', formData)
                })
            } else {
                // 添加请求

                addAddress(formData).then((data) => {
                    // 设置id
                    formData.id = data.result.id
                    // 添加成功
                    Message({ text: "添加收货地址成功", type: "success" })
                    // 关闭
                    dialogVisible.value = false
                    // 触发自定义事件
                    emit('on-success', formData)
                })
            }

        }
        return { dialogVisible, open, formData, changeCity, changeCity, submit }
    }
}
</script>
<style scoped lang="less">
.xtx-dialog {
    :deep(.wrapper) {
        width: 780px;

        .body {
            font-size: 14px;
        }
    }
}

.xtx-form {
    padding: 0;

    input {
        outline: none;

        &::placeholder {
            color: #ccc;
        }
    }
}

.xtx-city {
    width: 320px;

    :deep(.select) {
        height: 50px;
        line-height: 48px;
        display: flex;
        padding: 0 10px;
        justify-content: space-between;

        .placeholder {
            color: #ccc;
        }

        i {
            color: #ccc;
            font-size: 18px;
        }

        .value {
            font-size: 14px;
        }
    }

    :deep(.option) {
        top: 49px;
    }
}
</style>