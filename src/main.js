import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import '@/assets/style/common.less'
// 导入自己的组件库
import Ui from './components/library'
createApp(App).use(store).use(router).use(Ui).mount('#app')
