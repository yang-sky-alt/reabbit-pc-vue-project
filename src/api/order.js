// 订单相关的接口
import request from '@/utils/request'
/**
 * 获取结算信息
 */
export const findCheckoutInfo = () => {
    return request('/member/order/pre', 'get')
}
/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (from) => {
    return request('/member/address', 'post', from)
}
/**
 * 编辑收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (address) => {
    return request(`/member/address${address.id}`, 'put', address)
}
/**
 * 结算页面-提交订单
 * @param {Object} params - 参考接口文档
 * @returns
 */
export const submitOrder = (params) => {
    return request('/member/order', 'post', params)
}
/**
 * 获取订单详情
 * @param {String} orderId - 订单ID
 */
export const findOrder = (orderId) => {
    return request('/member/order/' + orderId, 'get')
}