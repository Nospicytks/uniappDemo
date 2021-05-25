import {Get,Post, Upload} from "./http.js"
// 登录
export const login = params => Post(params,'/v1/wechat/login')
// 跟新用户微信信息
export const saveInfo = params => Post(params,'/v1/user/saveInfo')
// 跟新用户手机号
export const savePhone = params => Post(params,'/v1/user/savePhone')
// 获取用户信息
export const userInfo = params => Get(params,'/v1/user/info')
// 添加车辆接口
export const addCar = params => Post(params,'/v1/car/add')
// 首页获取停车场信息
export const parkInfo = params => Get(params,'/v1/park/info')
// 获取停车场商圈接口
export const parkBusinessDistrict = params => Get(params,'/v1/park/businessDistrict')
// 获取附近停车场
export const parkNearby = params => Get(params,'/v1/park/nearby')
// 获取可能是用户车辆
export const carSimilar = params => Get(params,'/v1/car/similar')
// 获取历史和认证车辆
export const car = params => Get(params,'/v1/car')
// 认证车辆
export const carCertification = params => Post(params,'/v1/car/certification')
// 获取附近停车场详情
export const parkDetail = params => Get(params,'/v1/park/detail')
// 获取车辆入场订单
export const orderEntered = params => Get(params,'/v1/order/entered')
// 获取停车订单详情
export const orderDetails = params => Get(params,'/v1/order/details')
// 获取爱车列表接口
export const carList = params => Get(params,'/v1/car/list')
//解除车辆
export const carRelieve = params => Post(params,'/v1/car/relieve')
//获取车辆信息接口
export const carInfo = params => Get(params,'/v1/car/info')
//获取地区
export const area = params => Get(params,'/v1/area')
//根据城市获取停车场
export const parkProvince = params => Get(params,'/v1/park/province')
//获取包时卡
export const card = params => Get(params,'/v1/card')
//购买包时卡
export const orderCard = params => Post(params,'/v1/order/card')
//获取具体位置
export const locationDes = params => Get(params,'/v1/location')
//获取弹出优惠券接口
export const couponNew = params => Get(params,'/v1/coupon/eject')
//获取优惠券接口
export const couponUser = params => Get(params,'/v1/coupon/user')
//获取充值金额
export const configRechargeAmount = params => Get(params,'/v1/config/rechargeAmount')
//获取余额明细
export const userAccount = params => Get(params,'/v1/user/account')
//获取用户积分记录接口
export const pointsRecord = params => Get(params,'/v1/points/record')
//获取积分商城列表
export const pointsShop = params => Get(params,'/v1/points/shop')
//获取兑换物品信息
export const pointsExchangeInfo = params => Get(params,'/v1/points/exchangeInfo')
//获取积分商城列表
export const pointsExchange = params => Post(params,'/v1/points/exchange')
//获取用户订单
export const orderUser = params => Get(params,'/v1/order/user')
//获取用户系统消息
export const msgUser = params => Get(params,'/v1/msg/user')
//意见反馈
export const opinionIssue = params => Post(params,'/v1/opinion/issue')
// 上传图片
export const uploadImage = params => Upload(params,'/v1/upload/image')
// 识别身份证信息
export const userAnalyse = params => Post(params,'/v1/user/analyse')
// 用户认证
export const userCertification = params => Post(params,'/v1/user/certification')
//获取签到信息
export const signInfo = params => Get(params,'/v1/sign/info')
//签到
export const sign = params => Post(params,'/v1/sign')
//支付
export const pay = params => Post(params,'/v1/order/pay')
// 包时卡计算价格
export const calculation = params => Get(params,'/v1/card/calculation')
// 余额充值
export const recharge = params => Post(params,'/v1/order/recharge')
// 获取中奖记录
export const record = params => Get(params,'/v1/lottery/record')
// 获取抽奖活动信息
export const info = params => Get(params,'/v1/lottery/info')
// 抽奖接口
export const draw = params => Post(params,'/v1/lottery/draw')
// 获取使用优惠券后金额
export const money = params => Get(params,'/v1/order/money')
// 广告
export const banner = params => Get(params,'/v1/banner')
// 查看配置
export const config = params => Get(params,'/v1/config')
// 获取积分任务接口
export const task = params => Get(params,'/v1/points/task')
// 获取启动加载图片接口
export const startImage = params => Get(params,'/v1/config/startImage')