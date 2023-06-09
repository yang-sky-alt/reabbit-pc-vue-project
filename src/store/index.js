import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'

export default createStore({
  modules: {
    cart,
    user,
    category
  },
  // 配置插件 默认存储在localStorage
  plugins: [createPersistedState({
    // 本地存储的名字
    key: 'reabbit-pc-vue-project',
    // 指定需要存储的名字
    paths: ['user', 'cart']
  })]
})
