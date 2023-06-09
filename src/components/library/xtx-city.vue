<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle()" :class="{ active: visible }">
      <span class="placeholder" v-if="!fullLocation">{{ placeholder }}</span>
      <span class="value" v-else>{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis" @click="changeItem(item)" v-for="item in currList" :key="item.code">{{ item.name
        }}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup(props, { emit }) {
    // 显示隐藏数据
    const visible = ref(false)
    // 所有省市区数据
    const allCityDate = ref([])
    // 正在加载数据
    const loading = ref(false)
    // 提供打开和关闭函数
    const open = () => {
      // 获取城市数据
      getCityData().then(data => {
        allCityDate.value = data
        loading.value = false
      })
      // 清空之前选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
      visible.value = true
    }
    const close = () => {
      visible.value = false
    }
    // 提供一个切换函数给select使用
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 实现点击组件外部进行关闭操作
    const target = ref(null)
    onClickOutside(target, () => {
      // 参数一 监听那个元素
      // 参数二 点击该元素外的其他地方触发函数
      close()
    })
    // 实现计算属性
    const currList = computed(() => {
      // 默认省一级
      let list = allCityDate.value
      // 市一级
      if (changeResult.provinceCode) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 县一级
      if (changeResult.cityCode) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })
    // 定义选择的 省市区 数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: '',

    })
    // 当点击按钮时记录
    const changeItem = (item) => {
      // 省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      // 地区
      if (item.level === 2) {
        changeResult.countyName = item.code
        changeResult.countyName = item.name
        // 选完最后一级 关闭对话框 通知父组件数据
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}` // 地址完整路径
        close()
        emit('change', changeResult)
      }
    }
    return { toggle, target, visible, loading, currList, changeItem }
  }
}
// 获取省市区数据函数
const getCityData = () => {
  // 数据 https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 返回promise在then获取数据 这里可能是异步操作可能是同步操作
  return new Promise((resolve, reject) => {
    // 约定 数据存储在window上的cityData字段
    // 当本地有存储 就取出数据
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      // 当本地没有存储 发请求获取数据
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        // 缓存
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}

</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;

  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;

    // 加载中
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }

    &.active {
      background: #fff;
    }

    .placeholder {
      color: #999;
    }

    .value {
      color: #666;
      font-size: 12px;
    }

    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }

  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    >span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
