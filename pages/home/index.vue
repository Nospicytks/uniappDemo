<template>
	<view class="homeindex">
		<!-- 加载动画 -->
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<!-- 头部获取停车场 -->
		<view class="head">
			<div class="head-top">
				<div>
					<image :src="dw" mode=""></image>
				</div>
				<div><text>{{currParkInfo.park_name}}</text></div>
				<div @click="getLocalPark">点击切换</div>
			</div>
			<div class="head-bottom">
				<div class="head-bottom-item">
					<div><text>总车位</text></div>
					<div><text>{{currParkInfo.park_num}}</text></div>
				</div>
				<div class="head-bottom-item">
					<div><text>停车费</text></div>
					<div><text>{{currParkInfo.charges}}</text>
						<text style="font-size: 26rpx;color: rgba(0, 0, 0, 0.447058823529412)">
							元/小时
						</text>
					</div>
				</div>
			</div>
		</view>
		<!-- 头部获取停车场 -->
		<!-- 添加车辆 -->
		<!-- 未绑定临时车 -->
		<view class="addcar" v-if="currOrderStatus === 0">
			<div class="addcar-btn" @click="addcar">临停缴费</div>
		</view>
		<!-- 添加车辆end -->
		<!-- 绑定临时车未入场 -->
		<view class="addcar2" v-else-if="currOrderStatus === 1">
			<!-- 	<div class="addcar2-img">
				<image :src="noordercar" alt="">
			</div> -->
			<div class="addcar2-item">
				<div>
					<span>{{temporaryCar.substr(0,2)}}</span>
					<span>·</span>
					<span>{{temporaryCar.substr(2)}}</span>
				</div>
				<div v-if="temporaryCarType !== '' && temporaryCarType">{{classify}}</div>
			</div>
			<div class="addcar2-mes">
				您尚未驶入停车场
			</div>
			<div class="addcar-btn" @click="addcar">临停缴费</div>
		</view>
		<!-- 添加车辆 -->
		<!-- 车辆入场生成订单 -->
		<view v-else-if="currOrderStatus === 2" class="goOrder">
			<div @click="addcar" class="tianjia">
				<div style="width: 30%;text-align: center;">+</div>
				<div style="width: 70%;">临停缴费</div>
			</div>
			<div class="goOrder-item">
				<div class="goOrder-item-car">
					<image :src="carImg" mode=""></image>
				</div>
				<div class="goOrder-item-carNum">
					{{orderEntered.car_number}}
				</div>
				<div class="goOrder-item-xny" v-if="temporaryCarType !== '' && temporaryCarType">
					{{classify}}
				</div>
			</div>
			<div class="goOrder-item">
				<div style="width: 30%;">入场时间</div>
				<div style="width: 70%;">{{orderEntered.in_time}}</div>
			</div>
			<div class="goOrder-item">
				<div style="margin-right: auto;">停车时长</div>
				<div style="margin-left:auto;font-weight: bold;">{{orderEntered.stop_time}}</div>
			</div>
			<div @click="goOrder">结算订单</div>
		</view>
		<!-- 添加车辆end -->
		<!-- icon菜单 -->
		<v-menu></v-menu>
		<!-- icon菜单end -->
		<!-- 大然智慧停车 -->
		<view class="zhtc">
			<swiper v-if="bannerList.length !== 0" class="swiper" indicator-dots="true" indicator-color='#d6d6d6'
			 indicator-active-color="#fff" autoplay="true" circular="true">
				<swiper-item @click="goBanner(item)" v-for="(item,index) in bannerList" :key="index">
					<image :src="item.pic" mode=""></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 大然智慧停车end -->
		<tab-bar v-if="token !== '' && token !== null" :current-page="1"></tab-bar>
		<!-- 弹出广告 -->
		<u-mask :show="showadv">
			<v-adv :pic="pic" @close="updateShowadv"></v-adv>
		</u-mask>
	</view>
</template>

<script>
	import {
		parkInfo,
		userInfo,
		carCertification,
		orderEntered,
		couponNew,
		banner
	} from '@/pages/api/request.js'
	import {
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				isShow: true,
				showadv: false,
				parkId: '',
				location: null,
				currParkInfo: null,
				orderEntered: null,
				currOrderStatus: 0,
				classify: '',
				temporaryCarType: uni.getStorageSync('temporaryCar').length > 7 ? '新能源' : '普通牌照',
				temporaryCar: uni.getStorageSync('temporaryCar'), //临时车
				currUserMobile: '',
				carImg: this.$store.state.login.url + '/static/mini/static/home/car.png',
				dw: this.$store.state.login.url + '/static/mini/static/home/dw.png',
				noordercar: '../../static/home/noordercar.jpg',
				pic: '',
				bannerList: []

			}
		},
		watch: {
			temporaryCar: {
				handler(temporaryCar) {
					if (temporaryCar.length > 7) {
						this.classify = '新能源'
					} else {
						this.classify = '普通牌照'
					}
				},
				deep: true,
				immediate: true
			},
			// 对token进行监听如果token不为空暂停加载动画
			token: {
				handler(token) {
					if (token !== '' && token !== null) {
						this.getCouponNew()
						this.upData()
						this.getBanner()
						this.getLocation()
						// this.getUserInfo()
						this.checkTemporary()
						this.isShow = false
						console.log('已获取token')
					} else {
						console.log('未获取token开始获取')
						this.getopenid()
					}
				},
				deep: true,
				immediate: true,
			},
			orderStatus: {
				handler(orderStatus) {
					this.currOrderStatus = orderStatus
				},
				deep: true,
				immediate: true,
			},
			userMobile: {
				handler(userMobile) {
					this.currUserMobile = userMobile
				},
				deep: true,
				immediate: true,
			},
		},
		computed: {
			token: {
				get() {
					return this.$store.state.login.token
				},
				set(val) {
					this.$store.state.login.token = val
				}
			},
			orderStatus() {
				return this.$store.state.login.orderStatus
			},
			userMobile() {
				return this.$store.state.login.userMobile
			}
		},
		methods: {
			upData() {
				var that = this
				uni.$on('update_park', (res) => {
					that.parkId = res
					that.getParkInfo()
				})
			},
			// 在store/modules/login中的方法用来获取token
			...mapMutations([
				'getopenid'
			]),
			goBanner(item) {
				if (item.url == '' || item.url == '#') {
					return false
				} else {
					uni.navigateTo({
						url: './waibu?url=' + item.url
					})
				}
			},
			// bannerList
			getBanner() {
				banner({})
					.then(res => {
						if (res.data.code == 200) {
							this.bannerList = res.data.data
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					})
			},
			getCouponNew() {
				couponNew({})
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.data) {
								this.showAdv(res.data.data.pic)
							}
						}
					})
			},
			checkTemporary() {
				if (uni.getStorageSync('temporaryCar') !== '' && this.$store.state.login.token !== '' && this.$store.state.login.token !==
					null) {
					this.temporaryCar = uni.getStorageSync('temporaryCar')
					this.$store.state.login.orderStatus = 1
					this.getOrderEntered()
				}
			},
			getOrderEntered() {
				var that = this
				that.isShow = true;
				
				orderEntered({
					camera_id: this.currCameraId,
					car_number: this.currCameraId ? '' : that.temporaryCar
				}).then((res) => {
					that.isShow = false
					if (res.data.code == 200) {
						if (res.data.data) {
							that.orderEntered = res.data.data
							this.$store.state.login.orderStatus = 2
						}
						if (that.orderEntered) {
							that.orderEntered.sz_car_type = this.temporaryCar.length > 7 ? '新能源' : ''
						}
					}
				})
			},
			getParkInfo() {
				if (!this.location) {
					this.addSure()
					return
				}
				var that = this
				that.isShow = true;
				parkInfo({
					location: that.location.longitude + ',' + that.location.latitude,
					park_id: that.parkId //停车场id 根据手动切换停车场获取信息
				}).then((res) => {
					that.isShow = false
					if (res.data.code == 200) {
						that.currParkInfo = res.data.data.park
					}
				})
			},
			updateShowadv(val) {
				this.showadv = val
			},
			// 获取用户地理位置
			getLocation() {
				var that = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: res => {
						this.location = res
						this.getParkInfo()
					},
					fail: res => {
						uni.showToast({
							content: '地理位置加载失败，请尝试重新进入界面！',
							icon: 'none',
							duration: 2000
						})
					}
				});
			},
			addcar() {
				if (uni.getStorageSync('userMobile') == '' || uni.getStorageSync('userMobile') == 'undefind' || uni.getStorageSync(
						'userMobile') == null) {
					uni.reLaunch({
						url: '../login/index'
					})
				} else {
					uni.navigateTo({
						url: './addCars/addCars'
					})
				}
			},
			// 前往订单详情页
			goOrder() {
				if (this.$store.state.login.token == '' || this.$store.state.login.userMobile == '' || this.currCameraId) {
					uni.reLaunch({
						url: '../login/index?cameraId=' + this.currCameraId + '&orderSn=' + this.orderEntered.order_sn
					})
				} else {
					uni.navigateTo({
						url: './Order/order?orderSn=' + this.orderEntered.order_sn
					})
				}
			},
			// 弹出广告
			showAdv(pic) {
				// 弹出
				this.pic = pic
				setTimeout(() => {
					this.showadv = true
				}, 100)
				clearTimeout()
			},
			// 切换位置
			getLocalPark() {
				if (this.location) {
					uni.navigateTo({
						url: '../nearby/index?type=1' + '&' + 'location=' + this.location.longitude + ',' + this.location.latitude
					})
				} else {
					this.addSure()
				}

			},
			getUserInfo() {
				let that = this;
				userInfo({}).then((res) => {
					that.isShow = false
					if (res.data.code == 200) {
						that.$store.state.login.userMobile = res.data.data.phone
						if (res.data.data.is_member === 1) {
							that.$store.state.login.isVip = true
						} else {
							that.$store.state.login.isVip = false
						}

					} else {
						uni.showToast({
							title: res.data.msg,
							duration: 2000
						})
					}
				})
			},
			addSure() {
				var that = this
				uni.showModal({
					title: "",
					content: "找不到您的位置，请开启定位",
					showCancel: true,
					cancelText: '取消',
					confirmText: '去开启',
					cancelColor: '#333',
					confirmColor: '#FF6365',
					success: res => {
						if (res.confirm) {
							// 用户点击确定
							uni.openSetting({
								withSubscriptions: true,
								success(res) {
									that.getLocation()
								},
								fail(res) {
									console.log('getSetting - fail' + res)
								}
							})
						} else {

						}
					}
				})
			}
		},
		onLoad(options) {
			this.$store.state.login.nickName = 'cscs'
			this.currCameraId = options.gate_id
			 // || 2
			uni.setStorageSync('referral_code', options.referral_code)
		}
	}
</script>

<style lang="scss">
	.homeindex {
		padding-bottom: 10%;

		.head {
			width: 92%;
			background-color: #fff;
			height: 200rpx;
			border-radius: 12rpx;
			margin: 0 auto;
			padding-top: 3%;

			.head-top {
				width: 95%;
				height: 50rpx;
				line-height: 50rpx;
				margin: 0 auto;
				display: flex;

				div:nth-child(1) {
					width: 8%;

					image {
						width: 100%;
						height: 100%;
					}
				}

				div:nth-child(2) {
					margin-left: 2%;
					font-size: 26rpx;
					width: 65%;
				}

				div:nth-child(3) {
					width: 20%;
					border: 1px solid #d6d6d6;
					font-size: 22rpx;
					text-align: center;
					color: #d6d6d6;
					border-radius: 20rpx;
					height: 35rpx;
					line-height: 33rpx;
					margin-top: 1%;
				}
			}

			.head-bottom {
				width: 70%;
				height: 100rpx;
				margin: 0 auto;
				margin-top: 3%;
				display: flex;

				.head-bottom-item {
					width: 50%;
					text-align: center;

					div {
						height: 50rpx;
					}

					div:nth-child(1) {
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.4);
					}

					div:nth-child(2) {
						font-size: 30rpx;
						color: #333;
						font-weight: bold;
					}


				}
			}
		}

		.addcar {
			width: 92%;
			height: 600rpx;
			margin-top: 3%;
			position: relative;
			margin-bottom: 15%;
			background: url(http://daranzhibojiekou.daranjituan.com/static/mini/static/home/nocar.png) no-repeat;
			background-size: 100% 100%;
			margin-left: 6%;

			.addcar-item {
				width: 80%;
				margin: 0 auto;
				height: 100rpx;
				line-height: 100rpx;
				display: flex;
				color: #fff;

				.addcar-item-car {
					width: 14%;
					height: 70rpx;
					margin-top: 15rpx;
					margin-left: 10%;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.addcar-item-carNum {
					letter-spacing: 3rpx;
					font-weight: 500;
					font-size: 40rpx;
					margin-left: 5%;
				}

				.addcar-item-xny {
					background-color: rgb(212, 244, 220);
					width: 15%;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 22rpx;
					text-align: center;
					border-radius: 4rpx;
					color: rgb(84, 161, 8);
					margin-left: 5%;
					margin-top: 30rpx;
				}
			}

			.addcar-btn {
				width: 60%;
				height: 80rpx;
				line-height: 75rpx;
				position: absolute;
				background-color: rgb(238, 242, 245);
				text-align: center;
				color: rgb(82, 112, 274);
				box-shadow: 0 0 5px rgb(82, 112, 274);
				border-radius: 30rpx;
				top: 93%;
				left: 20%;
				font-weight: bold;
				cursor: pointer;
				letter-spacing: 8rpx;
			}
		}

		.addcar2 {
			width: 92%;
			height: 600rpx;
			margin-top: 3%;
			position: relative;
			margin-bottom: 15%;
			background: url(http://daranzhibojiekou.daranjituan.com/static/mini/static/home/noorderback.png) no-repeat;
			background-size: 100% 100%;
			padding-top: 13%;
			margin-left: 6%;

			.addcar2-img {
				width: 60%;
				height: 220rpx;
				margin-left: 20%;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.addcar-btn {
				width: 60%;
				height: 80rpx;
				line-height: 75rpx;
				position: absolute;
				background-color: rgb(238, 242, 245);
				text-align: center;
				color: rgb(82, 112, 274);
				box-shadow: 0 0 5px rgb(82, 112, 274);
				border-radius: 30rpx;
				top: 93%;
				left: 20%;
				font-weight: bold;
				cursor: pointer;
				letter-spacing: 8rpx;
			}

			.addcar2-item {
				margin: 0 auto;
				display: flex;
				color: #fff;
				text-align: center;
				margin-top: 35%;

				div:nth-child(1) {
					letter-spacing: 8rpx;
					font-size: 42rpx;
					margin-left: 20%;
				}

				div:nth-child(2) {
					padding-left: 3%;
					padding-right: 3%;
					border-radius: 4rpx;
					margin-left: 5%;
					font-size: 22rpx;
					height: 50rpx;
					line-height: 50rpx;
					background: linear-gradient(right, rgb(101, 221, 123), rgb(25, 197, 51));
					margin-top: 1%;
				}
			}

			.addcar2-mes {
				width: 60%;
				margin: 0 auto;
				text-align: center;
				color: #fff;
				margin-top: 5%;
				font-size: 23rpx;
			}
		}

		.goOrder {
			width: 92%;
			margin: 0 auto;
			height: 600rpx;
			border-radius: 12rpx;
			margin-top: 3%;
			position: relative;
			margin-bottom: 15%;
			padding-top: 1%;
			background: url(http://daranzhibojiekou.daranjituan.com/static/mini/static/home/haveorder.jpg) no-repeat;
			background-size: 100% 100%;

			.tianjia {
				width: 25%;
				height: 60rpx;
				line-height: 55rpx;
				background-color: rgb(67, 99, 246);
				margin-top: 5%;
				margin-left: 75%;
				color: #fff;
				border-radius: 25rpx 0 0 25rpx;
				letter-spacing: 1rpx;
				cursor: pointer;
				margin-bottom: 6%;
				display: flex;
				font-size: 26rpx;
			}

			.goOrder-item:nth-child(2) {
				background-color: rgba(0, 0, 0, 0.1);
				border-radius: 40rpx;
			}

			.goOrder-item {
				width: 80%;
				margin: 0 auto;
				height: 100rpx;
				line-height: 100rpx;
				display: flex;
				color: #fff;

				.goOrder-item-car {
					width: 14%;
					height: 70rpx;
					margin-top: 15rpx;
					margin-left: 10%;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.goOrder-item-carNum {
					letter-spacing: 3rpx;
					font-weight: 500;
					font-size: 40rpx;
					margin-left: 5%;
				}

				.goOrder-item-xny {
					background-color: rgb(212, 244, 220);
					padding-left: 3%;
					padding-right: 3%;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 22rpx;
					text-align: center;
					border-radius: 4rpx;
					color: rgb(84, 161, 8);
					margin-left: 5%;
					margin-top: 30rpx;
				}
			}

			div:nth-child(5) {
				width: 60%;
				height: 80rpx;
				line-height: 75rpx;
				position: absolute;
				background-color: rgb(238, 242, 245);
				text-align: center;
				color: rgb(82, 112, 274);
				box-shadow: 0 0 5px rgb(82, 112, 274);
				border-radius: 30rpx;
				top: 93%;
				left: 20%;
				font-weight: bold;
				cursor: pointer;
				letter-spacing: 8rpx;
			}
		}

		.zhtc {
			width: 92%;
			margin: 0 auto;
			height: 200rpx;
			margin-bottom: 25%;
			margin-top: 5%;
			border-radius: 90rpx;

			.swiper {
				width: 100%;
				height: 100%;
				border-radius: 90rpx;

				image {
					border-radius: 90rpx;
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
