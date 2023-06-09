<template>
    <Form class="xtx-form" ref="formCom" autocomplete="off" :validation-schema="mySchema" v-slot="{ errors }">
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-user"></i>
                <Field class="input" :class="{ err: errors.account }" type="text" name="account" v-model="form.account"
                    placeholder="请输入用户名" />
            </div>
            <div class="error" v-if="errors.account">{{ errors.account }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-phone"></i>
                <Field class="input" :class="{ err: errors.mobile }" type="text" name="mobile" v-model="form.mobile"
                    placeholder="请输入手机号" />
            </div>
            <div v-if="errors.mobile">{{ errors.mobile }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-code"></i>
                <Field class="input" name="code" type="text" :class="{ err: errors.code }" v-model="form.code"
                    placeholder="请输入验证码" />
                <span class="code" @click="send()">
                    {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
                </span>
            </div>
            <div class="error" v-if="errors.code">{{ errors.code }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field class="input" type="password" :class="{ err: errors.password }" name="password"
                    v-model="form.password" placeholder="请输入密码" />
            </div>
            <div class="error" v-if="errors.password">{{ errors.password }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field class="input" type="password" :class="{ err: errors.password }" name="password"
                    v-model="form.repassword" placeholder="请确认密码" />
            </div>
            <div class="error" v-if="errors.password">{{ errors.password }}</div>
        </div>
        <a href="javascript:;" class="submit" @click="submit()">立即提交</a>
    </Form>
</template>
  
<script>
import { Form, Field } from 'vee-validate'
import { reactive, ref, onUnmounted } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQPatchCode } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'CallbackPatch',
    components: { Form, Field },
    props: {
        unionId: {
            type: String,
            default: ''
        }
    },
    setup() {
        // 表单校验 校验规则 用户名是否存在,再次输入密码是否一致 输入验证码 完善信息
        // 表单数据对象
        const form = reactive({
            mobile: null,
            code: null,
            password: null,
            repassword: null,
            account: null
        })
        // 校验规则
        const mySchema = {
            mobile: schema.mobile,
            code: schema.code,
            password: schema.password,
            repassword: schema.rePassword,
            account: schema.accountApi
        }
        // 发送短信验证码
        // start 开始 stop 结束
        // useIntervalFn(回调函数,执行间隔,是否立即开启)
        const formCom = ref(null)
        const time = ref(0)
        const { start, stop } = useIntervalFn(() => {
            time.value--
            if (time.value <= 0) {
                stop()
            }
        }, 1000, false)
        // 销毁定时器
        onUnmounted(() => {
            stop()
        })
        // 发送短信
        // 手机号登录
        // 1.发送验证码
        // 1.1 绑定发送验证码按钮点击事件
        // 1.2检验验证码 如果成功才去发送验证码 (定义api) 请求成功开启60秒倒计时 不能再次点击
        // 1.3 如果失败 失败的校验样式显示出来
        const send = async () => {
            const valid = mySchema.mobile(form.mobile)
            // 通过
            if (valid === true) {
                // 没有倒计时才可以发送
                if (time.value === 0) {
                    await userQQPatchCode(form.mobile)
                    Message({ type: 'success', text: '发送成功' })
                    time.value = 60
                    start()
                }
            } else {
                // 失败 使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
                formCom.value.setFieldError('mobile', valid)
            }
        }
        // 立即提交
        const store = useStore()
        const router = useRouter()
        const submit = async () => {
            const valid = formCom.value.validate()
            if (valid) {
                userQQPatchLogin({
                    unionId: props.unionId,
                    ...form
                }).then(data => {
                    // 实现和之前登录一样的逻辑
                    // 1. 存储用户信息
                    const { id, account, avatar, mobile, nickname, token } = data.result
                    store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
                    store.dispatch('cart/mergeCart').then(() => {
                        // 2. 跳转到来源页或者首页
                        router.push(store.state.user.redirectUrl)
                        // 3. 成功提示
                        Message({ type: 'success', text: 'QQ完善信息成功' })
                    })

                }).catch(e => {
                    Message({ type: 'error', text: '完善信息失败' })
                })
            }
        }
        return { form, mySchema, send, time, formCom, submit }
    }
}
</script>
  
<style scoped lang='less'>
.code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;

    &:hover {
        cursor: pointer;
    }
}
</style>
  