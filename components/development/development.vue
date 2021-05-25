<template>
	<view class="development">
		<div class="devtop">
			<div class="img">
				<image :src="qidai" mode=""></image>
			</div>
			<div class="title">功能正在开发中</div>
			<div class="mess">敬请期待...</div>	
			<br>
		</div>
		<div class="bottom">
			<div class="close" @click="close">
				<u-icon name="close" color="#fff" size="32"></u-icon>
			</div>
		</div>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				qidai:this.$store.state.login.url+'/static/mini/static/components/qidai.png',
			}
		},
		methods:{
			close(){
				this.$emit('close',false)
			}
		}
	}
</script>

<style lang="scss">
	.development{
		width: 90%;
		margin: 0 auto;
		height: 700rpx;
		margin-top: 30%;
		
		.devtop{
			height: 650rpx;
			border-radius: 16rpx;
			background-color: #fff;
			padding-top:15%;
			
			.img{
				width: 70%;
				margin: 0 auto;
				height: 220rpx;
				
				image{
					width: 100%;
					height: 100%;
				}
			}
			.title{
				width: 70%;
				margin: 0 auto;
				margin-top: 15%;
				text-align: center;
				height: 60rpx;
				line-height: 60rpx;
				background-color: rgb(244,247,254);
				border-radius: 30rpx;
				border:1px solid rgb(244,247,254);
				color: rgba(0,0,0,0.4);
			}
			.mess{
				width: 70%;
				margin: 0 auto;
				font-weight: bold;
				color: rgb(112,133,236);
				text-align: center;
				font-size: 42rpx;
				margin-top: 8%;
			}
		}
		.bottom{
			height: 100rpx;
			margin-top:10%;
			.close{
				width: 10%;
				margin: 0 auto;
				height: 70rpx;
				line-height: 65rpx;
				text-align: center;
				border: 3px solid #fff;
				border-radius: 50%;
				font-size: 32rpx;
				font-weight: bold;
				color: #fff;
				cursor: pointer;
			}
		}
	}
</style>
