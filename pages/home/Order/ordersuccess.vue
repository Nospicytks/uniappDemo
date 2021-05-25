<template>
	<view class="ordersuccess">
		<!-- 上方图片 -->
		<view class="top"></view>
		<!-- 缴费成功 -->
		<view class="success">
			<div>恭喜， 缴费成功</div>
			<div>&yen;{{total_money}}</div>
		</view>
		<!-- 提示 -->
		<view class="tishi">
			<div>温馨提示:</div>
			<div>支付后您将有15分钟离场，期间不产生任何费用</div>
		</view>
		<!-- 返回 -->
		<view class="goBack" @click="goBack">返回</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				total_money:''
			}
		},
		
		methods:{
			goBack(){
				uni.reLaunch({
					url:'../index'
				})
			}
		},
		onLoad(option){
			this.total_money = option.total_money
		}
	}
</script>

<style lang="scss">
	.ordersuccess{
		.top{
			width: 33%;
			margin: 0 auto;
			height: 230rpx;
			margin-top: 15%;
			background: url(http://daranzhibojiekou.daranjituan.com/static/mini/static/home/ordersuccess.png) no-repeat;
			background-size: 100% 100%;
		}
		.success{
			margin-top: 5%;
			width: 100%;
			height: 150rpx;
			
			div{
				text-align: center;
				height: 75rpx;
				line-height: 75rpx;
				font-size: 34rpx;
				font-weight: 400;
				letter-spacing: 2rpx;
			}
		}
		
		.tishi{
			width: 90%;
			margin: 0 auto;
			margin-top: 35%;
			height: 150rpx;
			background-color: rgb(244,248,255);
			border-radius: 16rpx;
			padding-left: 5%;
			border:1px solid rgb(207,218,252);
			
			div{
				line-height: 75rpx;
				height: 75rpx;
				letter-spacing: 2rpx;
			}
			div:nth-child(1){
				font-size: 32rpx;
			}
			div:nth-child(2){
				font-size: 26rpx;
				color: rgba(0, 0, 0, 0.447058823529412);
			}
		}
		.goBack{
			width: 95%;
			margin: 0 auto;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			font-weight: bold;
			letter-spacing: 2rpx;
			background-color: rgb(195,212,250);
			border-radius: 49rpx;
			font-size: 36rpx;
			cursor: pointer;
			margin-top: 15%;
		}
	}
</style>
