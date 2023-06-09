<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img v-if="val.picture" @click="changeSku(val, item)"
            :class="{ selected: val.selected, disabled: val.disabled }" :src="val.picture" :title="val.name">
          <span v-else @click="changeSku(val, item)" :class="{ selected: val.selected, disabled: val.disabled }">{{
            val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'
const spliter = '☆'
// 得到一个路径字典对象
// 04_ 根据子集往字典对象中存储key-value
const pathMap = {}
const getPathMap = (skus) => {
  // 02_ 从所有的sku中筛选出有效的sku
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算当前库存的sku子集
      const valueArr = sku.specs.map(val => val.valueName)
      // 03_ 根据有效的sku使用power-set算法得到子集
      const valueArrPowerSet = getPowerSet(valueArr)
      // 遍历子集 往pathMap中插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串key 约定key是:['蓝色','美国'] ==='蓝色☆美国'
        const key = arr.join(spliter)
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }

      })
    }
  })
  return pathMap
}
// 更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 约定每一个按钮状态有本身的disable数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 判断当前是否选中 是选中不用判断
      if (val.disabled) return
      // 拿着当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 去除undefined数据 按照分隔符拼接数据 filter过滤
      const key = selectedValues.filter(value => value).join(spliter)
      // 去字典路径查找是否有数据 有可以点击,没有就禁用
      val.disabled = !pathMap[key]
    })
  })
}
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中的按钮对象
    const seletedVal = item.values.find(val => val.selected)
    arr.push(seletedVal ? seletedVal.name : undefined)
  })
  return arr
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1. 找出sku的信息
  // 2. 遍历每一个按钮，按钮的值和sku记录的值相同，就选中。
  const sku = goods.skus.find(sku => sku.id === skuId)
  console.log(sku);
  // goods.specs.forEach((item, i) => {
  //   const val = item.values.find(val => val.name === sku.specs[i].valueName)
  //   val.selected = true
  // })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // 01_ 得到所有sku集合 props.goods.skus
    const pathMap = getPathMap(props.goods.skus)
    // 根据skuId初始化选中
    // if (props.skuId) {
    //   initDefaultSelected(props.goods, props.skuId)
    // }
    // 组件初始化,更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 选中与取消选中,约定在每一个按钮都拥有自己的选中状态数据:selected
    const changeSku = (val, item) => {
      // 当按钮是禁用的 阻止程序运行
      if (val.disabled) return
      // 点击的是已选中,只需要取消当前选中
      if (val.selected) {
        val.selected = false
      } else {
        // 点击的是未选中,把同一个规格的按钮改成未选中,当前点击改成选中
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮时,更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将你选择的sku信息传递给父组件 {skuId,price,oldPrice,inventory,specsText}
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(j => j)
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      } else {
        emit('change', {})
      }
    }

    return { changeSku }
  }
}
</script>
<style scoped lang="less">
@import '@/assets/style/variables.less';
@import '@/assets/style/mixins.less';

.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: @xtxColor;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      >img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }

      >span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
