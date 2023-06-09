<template>
    <div class="account-box">
        <div class="toggle">
            <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
                <i class="iconfont icon-user"></i> 使用账号登录
            </a>
            <a @click="isMsgLogin = true" href="javascript:;" v-else>
                <i class="iconfont icon-msg"></i> 使用短信登录
            </a>
        </div>
        <Form class="form" ref="formCom" :validation-schema="mySchema" v-slot="{ errors }">
            <template v-if="!isMsgLogin">
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field :class="{ error: errors.account }" type="text" placeholder="请输入用户名或手机号"
                            v-model="form.account" name="account" />
                    </div>
                    <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-lock"></i>
                        <Field type="password" placeholder="请输入密码" name="password" :class="{ error: errors.password }"
                            v-model="form.password" />
                    </div>
                    <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
                </div>
            </template>
            <template v-else>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field type="text" placeholder="请输入手机号" name="mobile" v-model="form.mobile"
                            :class="{ error: errors.mobile }" />
                    </div>
                    <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-code"></i>
                        <Field type="text" :class="{ error: errors.code }" placeholder="请输入验证码" name="code"
                            v-model="form.code" />
                        <span class="code" @click="send()">
                            {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
                        </span>
                    </div>
                    <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
                </div>
            </template>
            <div class="form-item">
                <div class="agree">
                    <!-- <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" /> -->
                    <span>我已同意</span>
                    <a href="javascript:;">《隐私条款》</a>
                    <span>和</span>
                    <a href="javascript:;">《服务条款》</a>
                </div>
                <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
            </div>
            <a href="javascript:;" class="btn" @click="login">登录</a>
        </Form>
        <div class="action">
            <a
                href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
                <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
            </a>

            <div class="url">
                <a href="javascript:;">忘记密码</a>
                <a href="javascript:;">免费注册</a>
            </div>
        </div>

    </div>
</template>

<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import QC from 'qc'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
export default {
    name: 'LoginFrom',
    components: {
        Form, Field
    },
    setup() {
        // 切换短信登录
        const isMsgLogin = ref(false)
        // 表单数据对象
        const form = reactive({
            isAgree: true,
            account: null,
            password: 'hm#qd@23!',
            mobile: null,
            code: null
        })
        // 定义field的name属性指定的校验规则函数 form的validation-schema接收定义好的校验规则是对象
        const mySchema = {
            // 校验函数规则 返回true就是检验成功 返回字符串就是失败 字符串就是错误提示
            account: schema.account,
            password: schema.password,
            mobile: schema.mobile,
            code: schema.code,
            isAgree: schema.isAgree
        }
        // 监听isMsgLogin 重置表单(数据+清除验证结果)
        const formCom = ref(null)
        watch(isMsgLogin, () => {
            // 重置函数
            form.isAgree = true,
                form.account = null,
                form.password = null,
                form.mobile = null,
                form.code = null,
                // Form组件提供了resetForm 函数清除校验结果
                formCom.value.resetForm()
        })
        // 在点击登录时对整体表单进行进行校验
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const login = async () => {
            const valid = await formCom.value.validate()

            if (valid) {
                try {
                    let data = null
                    if (isMsgLogin.value) {
                        // 2手机号登录
                        // 2.1.准备一个api账户登录
                        // 2.2.调用api
                        // 2.3.成功 存储用户登录信息 跳转至来源页或者首页+消息提示
                        // 2.4.失败 信息提示
                        const { mobile, code } = form
                        data = await userMobileLogin({ mobile, code })
                    } else {
                        // 账号登陆
                        // 1.准备一个api账户登录
                        // 2.调用api
                        // 3.成功 存储用户登录信息 跳转至来源页或者首页+消息提示
                        // 4.失败 信息提示
                        const { account, password } = form
                        data = await userAccountLogin({ account, password })
                        // userAccountLogin({ account, password }).then(data => {
                        //     console.log(data.result)
                        //     const { id, account, nickname, mobile, token, avatar } = data.result
                        //     // 存储用户信息
                        //     store.commit('user/setUser', { id, account, nickname, mobile, token, avatar })
                        //     // 进行跳转
                        //     router.push(route.query.redirectUrl || '/')
                        //     // 消息提示
                        //     Message({ type: 'success', text: '登录成功' })
                        // }).catch(e => {
                        //     // 失败提示
                        //     console.log(e);
                        //     Message({ type: 'error', text: e.response.data.message || '登录失败' })
                        // })
                    }
                    const { id, account, nickname, mobile, token, avatar } = data.result
                    // 存储用户信息
                    store.commit('user/setUser', { id, account, nickname, mobile, token, avatar })
                    store.dispatch('cart/mergeCart').then(() => {
                        // 进行跳转
                        router.push(route.query.redirectUrl || '/')
                        // 消息提示
                        Message({ type: 'success', text: '登录成功' })
                    })

                } catch (e) {
                    if (e.response.data) {
                        Message({ type: 'error', text: e.response.data.message || '登录失败' })
                    }
                }
            }
        }
        // start 开始 stop 结束
        // useIntervalFn(回调函数,执行间隔,是否立即开启)
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
                    await userMobileLoginMsg(form.mobile)
                    Message({ type: 'success', text: '发送成功' })
                    time.value = 60
                    start()
                }
            } else {
                // 失败 使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
                formCom.value.setFieldError('mobile', valid)
            }
        }
        // 初始化qq登录按钮
        // onMounted(() => {
        //     // 组件渲染完毕，使用QC生成QQ登录按钮
        //     QC.Login({
        //         btnId: 'qqLoginBtn'
        //     })
        // })
        return { isMsgLogin, form, mySchema, formCom, login, send, time }
    }
}
</script>

<style lang="less" scoped>
@import '@/assets/style/variables.less';

// 账号容器
.account-box {
    .toggle {
        padding: 15px 40px;
        text-align: right;

        a {
            color: @xtxColor;

            i {
                font-size: 14px;
            }
        }
    }

    .form {
        padding: 0 40px;

        &-item {
            margin-bottom: 28px;

            .input {
                position: relative;
                height: 36px;

                >i {
                    width: 34px;
                    height: 34px;
                    background: #cfcdcd;
                    color: #fff;
                    position: absolute;
                    left: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 18px;
                }

                input {
                    padding-left: 44px;
                    border: 1px solid #cfcdcd;
                    height: 36px;
                    line-height: 36px;
                    width: 100%;

                    &.error {
                        border-color: @priceColor;
                    }

                    &.active,
                    &:focus {
                        border-color: @xtxColor;
                    }
                }

                .code {
                    position: absolute;
                    right: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 14px;
                    background: #f5f5f5;
                    color: #666;
                    width: 90px;
                    height: 34px;
                    cursor: pointer;
                }
            }

            >.error {
                position: absolute;
                font-size: 12px;
                line-height: 28px;
                color: @priceColor;

                i {
                    font-size: 14px;
                    margin-right: 2px;
                }
            }
        }

        .agree {

            a {
                color: #069;
            }
        }

        .btn {
            display: block;
            width: 100%;
            height: 40px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background: @xtxColor;

            &.disabled {
                background: #cfcdcd;
            }
        }
    }

    .action {
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .url {
            a {
                color: #999;
                margin-left: 10px;
            }
        }
    }
}
</style>
