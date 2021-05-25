<template>
	<view class="integralHistory">
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<view class="head">
			<div>可用积分</div>
			<div>
				<div>{{point}}</div>
				<div @click="getGoods()">
					<div>
						<image :src="jfPath" mode=""></image>
					</div>
					<div>积分兑换</div>
				</div>
			</div>
			<!-- 规则 -->
			<view class="rules">
				<div class="rules-title">积分规则</div>
				<div class="rules-content">
					登录大然智泊小程序、每日签到、转盘抽奖及推荐新好友等操作都可以获取积分。获得的积分可以在积分商城中兑换优惠券、礼品卡以及大然精选好物等礼品。
				</div>
			</view>
		</view>
		<!-- 标题 -->
		<view class="title">积分记录</view>
		<!-- 记录列表 -->
		<scroll-view class="scroll-view" :scroll-top="scrollTop" :show-scrollbar="true" scroll-y @scrolltolower="handletolower">
			<view v-for="(item,index) in historyList" :key="index" class="scroll-view-item">
				<div class="scroll-view-item-a">
					<div>
						{{item.points_type === 1?'+':'-'}}{{item.points_num}}
					</div>
					<div>
						<span>{{item.created_at.substr(0,10)}}</span>
						<span>{{item.created_at.substr(10)}}</span>
					</div>
				</div>
				<div :class="{ 'scroll-view-item-c':index%2 == 0, 'scroll-view-item-d':index%3 == 0}" class="scroll-view-item-b">
					{{item.reward_type}}
				</div>
			</view>
			<u-loadmore v-if="historyList.length >= 15" :status="status" />
		</scroll-view>
	</view>
</template>

<script>
	import {
		pointsRecord
	} from '@/pages/api/request.js'
	import {
		userInfo
	} from '@/pages/api/request.js'

	export default {
		data() {
			return {
				isShow: true,
				currPage: 1,
				pagesize: 15,
				hasMore: true,
				point: 0,
				status: 'loadmore',
				jfPath: this.$store.state.login.url + '/static/mini/static/home/jficon.png',
				historyList: [],
				scrollTop: 0
			}
		},
		created() {
			this.getPointsRecord()
			this.getUserInfo()

		},
		onLoad() {
			var that = this
			uni.$on('update_list', res => {
				that.getPointsRecord()
				that.getUserInfo()
			})
		},
		onUnload() {
			uni.$off('update_list')
		},
		destroyed() {
			clearTimeout()
		},
		methods: {
			changeScrollView() {
				this.scrollTop = 0; //回到最顶部
			},
			handletolower(page) {
				if (this.hasMore) {
					this.status = 'loading'
					this.currPage += 1
					this.getPointsRecord()
				} else {
					this.status = 'nomore'
				}
			},
			getGoods() {
				uni.navigateTo({
					url: '/pages/myself/integral/integralList'
				})
			},
			getUserInfo() {
				let that = this;
				userInfo({}).then((res) => {
					console.log(res.data)
					if (res.data.code == 200) {
						that.point = res.data.data.points
					} else {
						uni.showToast({
							title: res.data.msg,
							duration: 2000
						})
					}
				})
			},
			getPointsRecord() {
				setTimeout(time => {
					var that = this
					pointsRecord({
						page: that.currPage,
						pagesize: that.pagesize
					}).then(res => {
						if (res.data.code == 200) {
							if (that.currPage === 1) {
								that.historyList = res.data.data
								that.status = 'loadmore'
							} else {
								that.historyList = [...that.historyList, ...res.data.data]
								that.changeScrollView()
								that.status = 'loadmore'
							}
							if (res.data.data.length < that.pagesize) {
								that.status = 'nomore'
								that.changeScrollView()
								that.hasMore = false
							}
							that.isShow = false
						} else {
							uni.showToast({
								title: res.data.msg,
								duration: 2000
							})
							that.isShow = false
						}
					})
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	.integralHistory {

		.head {
			width: 100%;
			height: 300rpx;
			position: relative;
			background: linear-gradient(to right, rgb(255, 152, 109), rgb(255, 156, 114), rgb(255, 176, 133));
			color: #fff;
			padding-left: 5%;
			padding-top: 3%;

			div:nth-child(1) {
				font-size: 22rpx;
				height: 100rpx;
				line-height: 100rpx;
			}

			div:nth-child(2) {
				display: flex;

				div:nth-child(1) {
					font-size: 56rpx;
					font-weight: bold;
					width: 70%;

				}

				div:nth-child(2) {
					width: 25%;
					height: 55rpx;
					border-radius: 30rpx;
					background-color: rgb(254, 249, 246);
					display: flex;
					cursor: pointer;

					div:nth-child(1) {
						width: 25%;
						border-radius: 50%;
						height: 45rpx;
						margin-top: 3%;
						margin-left: 3%;
						background-color: rgb(254, 175, 136);
						text-align: center;
						line-height: 30rpx;

						image {
							width: 70%;
							height: 70%;
						}
					}

					div:nth-child(2) {
						line-height: 55rpx;
						width: 60%;
						font-size: 20rpx;
						color: rgb(255, 136, 88);
						margin-left: 10%;
						font-weight: bold;
					}
				}
			}

			.rules {
				position: absolute;
				width: 90%;
				left: 5%;
				background-color: #fff;
				border-radius: 24rpx;
				box-shadow: 0 0 5rpx rgb(255, 160, 118);
				padding: 3%;

				.rules-title {
					height: 60rpx;
					line-height: 60rpx;
					color: rgb(255, 160, 118);
					font-weight: bold;
					font-size: 28rpx;
				}

				.rules-content {
					color: rgba(0, 0, 0, 0.4);
				}
			}
		}

		.title {
			height: 100rpx;
			line-height: 100rpx;
			font-size: 36rpx;
			font-weight: bold;
			letter-spacing: 2rpx;
			text-align: center;
			color: #333;
			margin-top:26%;
		}

		.scroll-view {
			height: 55vh;

			.scroll-view-item {
				height: 120rpx;
				width: 90%;
				margin: 0 auto;
				margin-bottom: 3%;
				background-color: #fff;
				border-radius: 16rpx;
				display: flex;
				padding-left: 5%;

				.scroll-view-item-a {
					width: 75%;

					div:nth-child(1) {
						height: 70rpx;
						line-height: 70rpx;
						font-size: 36rpx;
						font-weight: bold;
					}

					div:nth-child(2) {
						height: 50rpx;
						line-height: 50rpx;
						font-size: 24rpx;

						span:nth-child(2) {
							margin-left: 2%;
						}
					}
				}

				.scroll-view-item-b {
					height: 50rpx;
					line-height: 45rpx;
					border-radius: 16rpx;
					border: 1px solid rgb(255, 161, 87);
					padding: 1%;
					font-size: 22rpx;
					color: rgb(255, 161, 87);
					margin-top: 3%;
				}

				.scroll-view-item-c {
					border: 1px solid rgb(61, 183, 98);
					color: rgb(61, 183, 98);
				}

				.scroll-view-item-d {
					border: 1px solid rgb(36, 148, 254);
					color: rgb(36, 148, 254);
				}
			}
		}
	}
</style>
