<!-- 面包屑组件 -->

<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // 02_获取默认插槽默认
    const items = this.$slots.default()
    // 03_ 去除xtx-bread-item组件的i标签 因此由render函数来组织
    const dymanicItems = []
    // 04_ 遍历插槽中的item 得到一个动态创建的节点 最后一个item不加i标签
    items.forEach((item, i) => {
      dymanicItems.push(item)
      if (i < (items.length - 1)) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    // 01_ 创建xtx-bread父容器
    // 返回值就是组件内容
    // 第一个参数 元素 第二个参数 标签属性对象 第三个参数 子节点
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  }
}
</script>

<style lang='less'>
@import '@/assets/style/variables.less';

.xtx-bread {
    display: flex;
    padding: 25px 10px;

    &-item {
        a {
            color: #666;
            transition: all .4s;

            &:hover {
                color: @xtxColor;
            }
        }
    }

    i {
        font-size: 12px;
        margin-left: 5px;
        margin-right: 5px;
        line-height: 22px;
    }
}
</style>
