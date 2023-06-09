<template>
    <Form class="xtx-form" ref="formCom" :validation-schema="mySchema" v-slot="{ errors }">
        <div class="user-info">
            <img :src="avatar" alt="" />
            <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-phone"></i>
                <Field class="input" :class="{ err: errors.mobile }" type="text" name="mobile" v-model="from.mobile"
                    placeholder="绑定的手机号" />
            </div>
            <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-code"></i>
                <Field class="input" type="text" :class="{ err: errors.code }" name="code" v-model="from.code"
                    placeholder="短信验证码" />
                <span class="code" @click="send()">
                    {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
                </span>
            </div>
            <div class="error" v-if="errors.code">{{ errors.code }}</div>
            <div class="error"></div>
        </div>
        <a href="javascript:;" class="submit" @click="submit()">立即绑定</a>
    </Form>
</template>
  
<script>
import QC from 'qc'
import { reactive, ref, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindLogin, userQQBindCode } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'CallbackBind',
    components: { Form, Field },
    props: {
        unionId: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const nickname = ref('null')
        const avatar = ref('null')
        // 准备下信息 nuionId QQ头像 呢称
        // 完成表单检验
        // 发送验证码
        // 进行绑定（绑定成功就是登录成功）
        if (QC.Login.check()) {
            QC.api('get_user_info').success(res => {
                avatar.value = res.data.figureurl_qq_1
                nickname.value = res.data.nickname
            })
        }
        // 表单数据对象
        const from = reactive({
            mobile: null,
            code: null
        })
        // 检验规则
        const mySchema = {
            mobile: schema.mobile,
            code: schema.code
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
            const valid = mySchema.mobile(from.mobile)
            // 通过
            if (valid === true) {
                // 没有倒计时才可以发送
                if (time.value === 0) {
                    await userQQBindCode(from.mobile)
                    Message({ type: 'success', text: '发送成功' })
                    time.value = 60
                    start()
                }
            } else {
                // 失败 使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
                formCom.value.setFieldError('mobile', valid)
            }
        }
        // 立即绑定
        const store = useStore()
        const router = useRouter()
        const submit = async () => {
            const valid = formCom.value.validate()
            if (valid) {
                userQQBindLogin({
                    unionId: props.unionId,
                    ...from
                }).then(data => {
                    // 实现和之前登录一样的逻辑
                    // 1. 存储用户信息
                    const { id, account, avatar, mobile, nickname, token } = data.result
                    store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
                    store.dispatch('cart/mergeCart').then(() => {
                        // 2. 跳转到来源页或者首页
                        router.push(store.state.user.redirectUrl)
                        // 3. 成功提示
                        Message({ type: 'success', text: 'QQ绑定成功' })
                    })

                }).catch(e => {
                    Message({ type: 'error', text: '绑定失败' })
                })
            }
        }
        return { nickname, avatar, from, mySchema, send, time, formCom, submit }
    }
}
</script>
  
<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;

    img {
        background: #f2f2f2;
        width: 50px;
        height: 50px;
    }

    p {
        padding-left: 10px;
    }
}

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