<template>
	<view class="loginindex">
		<!-- 加载动画 -->
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<!-- 上方图片 -->
		<view class="head">
			<image :src="imgPath" alt="" />
		</view>
		<!-- 上方图片end -->
		<!-- 申请授权 -->
		<view class="sqsq"><text>申请授权您的手机号码, 享福利</text></view>
		<!-- 福利列表 -->
		<view class="fllist">
			<ul>
				<li v-for="(item,index) in flList" :key="index">{{item}}</li>
			</ul>
		</view>
		<!-- 登录按钮 -->
		<view class="button">
			<div @click="goback">暂不登录</div>
			<button style="border: none;" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"><text>立即登录</text></button>
		</view>
		<!-- 协议 -->
		<view class="xy">
			<text>登录代表您已同意</text>
			<text>用户服务协议和隐私政策</text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from "vuex"
	// 引用封装好的请求
	import {
		login
	} from '@/pages/api/request.js'
	import {
		savePhone
	} from '@/pages/api/request.js'
	export default {
		data() {
			return {
				imgPath: this.$store.state.login.url + '/static/mini/static/login/login.png',
				flList: ['停车券领不停', '提前交费更省钱', '检车有优惠', '全程洗车免处置', '机油保真工时低'],
				// userMobile:this.$store.state.login.userMobile,
				isphone: false,
				isShow: false,
				userMobile: uni.getStorageSync('userMobile'),
				tuserMobile: '',
				prevpage: '',
				haveToken: false,
				// currCameraId: null,
				currOrderSn: ''
			}
		},
		onLoad(options) {
			console.log(this.$store.state.login.token)
			console.log(this.$store.state.login.nickName)
			this.getCheckSession()
			let pages = getCurrentPages();
			let prevpage = pages[pages.length - 2];
			this.prevpage = prevpage
			this.currCameraId = options.cameraId
			this.currOrderSn = options.orderSn
			console.log(options, 'login')
			this.isPay = options.isPay
		},
		watch: {
			// 对token进行监听如果token不为空暂停加载动画
			token: {
				handler(token) {
					if (token !== '' && token !== null) {
						this.haveToken = true
					}
				},
				deep: true,
				immediate: true,
			},
			userMobile: {
				handler(userMobile) {
					if (userMobile) {
						this.tuserMobile = userMobile
						this.isphone = true
					}
				},
				deep: true,
				immediate: true
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
			}
		},
		methods: {
			// 获取用户信息
			getPhoneNumber(e) {
				if (this.haveToken == true) {
					this.isShow = true
					savePhone({
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					}).then(res => {
						if (res.data.code == '200') {
							uni.setStorageSync('userMobile', res.data.data.phone)
							setTimeout(res => {
								this.isShow = false
								if (this.currCameraId) {
									uni.navigateTo({
										url: './../home/Order/order?orderSn=' + this.currOrderSn
									})
								} else if (this.isPay === '1') {
									uni.navigateTo({
										url: '/pages/myself/account/account'
									})
								} else {
									this.goback()
								}
							}, 500)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							this.isShow = false
						}
					})
				}
			},
			getCheckSession() {
				wx.checkSession({
					success: function() {
						console.log('session_key 未过期，并且在本生命周期一直有效')
						//session_key 未过期，并且在本生命周期一直有效
					},
					fail: function() {
						console.log('session_key 已经失效，需要重新执行登录流程')
						// session_key 已经失效，需要重新执行登录流程
					}
				});
			},
			// 返回首页
			goback() {
				uni.reLaunch({
					url: '/' + uni.getStorageSync('currentPage')
				})
			}
		}
	}
</script>

<style lang="scss">
	.loginindex {
		.head {
			width: 39%;
			height: 300rpx;
			margin-left: 27%;
			margin-top: 10%;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.sqsq {
			text-align: center;
			margin-top: 20%;
			letter-spacing: 3px;
			color: rgb(100, 132, 252);
			font-weight: bold;
		}

		.fllist {
			width: 50%;
			margin: 0 auto;
			margin-top: 6%;
			font-size: 28rpx;

			li {
				margin-top: 2%;
				color: rgba(0, 0, 0, 0.447058823529412);
				letter-spacing: 1px;
			}
		}

		.button {
			width: 80%;
			height: 100rpx;
			margin: 0 auto;
			margin-top: 10%;
			display: flex;

			div {
				text-align: center;
				font-size: 30rpx;
				border-radius: 12rpx;
				cursor: pointer;
				width: 35%;
				height: 90rpx;
				margin-top: 5rpx;
				line-height: 90rpx;
				border: 1px solid rgba(0, 0, 0, 0.447058823529412);
			}

			button {
				text-align: center;
				font-size: 30rpx;
				border-radius: 12rpx;
				cursor: pointer;
				width: 35%;
				height: 100rpx;
				line-height: 100rpx;
				width: 55%;
				margin-left: 10%;
				color: #fff;
				background-color: rgb(84, 121, 251);
			}
		}

		.xy {
			font-size: 26rpx;
			text-align: center;
			margin: 0 auto;
			margin-top: 5%;

			text:nth-child(1) {
				color: rgba(0, 0, 0, 0.447058823529412);
			}

			text:nth-child(2) {
				color: rgb(84, 121, 251);
				margin-left: 2%;
				cursor: pointer;
			}
		}
	}
</style>
