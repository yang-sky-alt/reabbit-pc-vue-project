// 批量注册组件
// 01_ 使用require提供的函数context加载某一个目录下的所有.vue后缀的文件
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
import defaultImg from '@/assets/images/200.png'
import Message from './Message'
import Confirm from './confirm'
const importFn = require.context('./', false, /\.vue$/)
export default {
  install(app) {
    // 批量注册全局组件
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })
    // 使用指令
    defineDirective(app)
    // 定义一个原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}
// 指令
const defineDirective = (app) => {
  // 图片懒加载指令
  // 图片懒加载指令 v-lazyload
  app.directive('lazyload', {
    // vue3.0的指令使用的钩子函数和组件的一样 使用指令的Dom是否创建好 钩子函数:mounted
    mounted(el, binding) {
      // 创建一个指令 来观察当前使用指令的元素 observer
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 停止观察
          observer.unobserve(el)
          // 处理图片加载失败
          el.onerror = () => {
            // 加载失败 设置默认图
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      // 开启图片观察
      observer.observe(el)
    }
  })
}
