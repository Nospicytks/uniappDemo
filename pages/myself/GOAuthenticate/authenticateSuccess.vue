<template>
	<view class="ertificationCar">
		<!-- 上方图片 -->
		<view class="top" 
		style="background: url(http://daranzhibojiekou.daranjituan.com/static/mini/static/home/loading.png) no-repeat;
		background-size: 100% 100%;">
		</view>
		<!-- 缴费成功 -->
		<view class="success">认证成功，+{{points}}积分</view>
		<!-- 返回 -->
		<view class="goBack" @click="goBack">返回</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				points:''
			}
		},
		methods:{
			goBack(){
				uni.reLaunch({
					url:'../index'
				})
			}
		},
		onLoad(options){
			this.points = options.points
		}
	}
</script>

<style lang="scss">
	.ertificationCar{
		.top{
			width: 33%;
			margin: 0 auto;
			height: 230rpx;
			margin-top: 30%;
			
			
		}
		.success{
			margin-top: 20%;
			width: 100%;
			height: 150rpx;
			font-size:26rpx;
			text-align: center;
			color: rgba(0, 0, 0, 0.447058823529412);
		}
	
		.goBack{
			width: 50%;
			margin: 0 auto;
			text-align: center;
			height: 70rpx;
			line-height: 70rpx;
			font-weight: bold;
			letter-spacing: 2rpx;
			background-color: rgb(195,212,250);
			border-radius: 49rpx;
			font-size: 32rpx;
			cursor: pointer;
			margin-top: 50%;
		}
	}
</style>
