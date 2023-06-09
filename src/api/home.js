import request from '@/utils/request'
/**
 *
 * @param {Integer} limit --品牌个数
 * @returns promise
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}
/**
 * 获取新鲜好物数据
 * @returns Promise
 */
export const findNew = () => {
  return request('home/new', 'get')
}
/**
 * 获取人气推荐
 * @returns Promise
 */
export const findHot = () => {
  return request('home/hot', 'get')
}

/**
 * 产品区块 数据
 * @returns promise
 */
export const findGoods = () => {
  return request('home/goods', 'get')
}
/**
 * 最新专题
 * @returns promise
 */
export const findSpecial = () => {
  return request('home/special', 'get')
}
