// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import XtxBread from './xtx-bread.vue'
import XtxBreadItem from './xtx-bread-item.vue'
import defaultImg from '@/assets/images/200.png'

export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    app.component(XtxBread.name, XtxBread)
    app.component(XtxBreadItem.name, XtxBreadItem)
    // 定义指令
    defineDirective(app)
  }
}
// 指令
const defineDirective = (app) => {
  // 图片懒加载指令
  // 图片懒加载指令 v-lazyload
  app.directive('lazyload', {
    // vue3.0的指令使用的钩子函数和组件的一样 使用指令的Dom是否创建好 钩子函数:mounted
    mounted (el, binding) {
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
