<template>
	<view class="advertisement">
		<div class="top">
			<image :src="pic" mode=""></image>
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
				
			}
		},
		props:{
			pic:{
				type:String,
				required:false,
				default:'http://daranzhibojiekou.daranjituan.com/static/mini/static/home/advtest.png'
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
	.advertisement{
		width: 90%;
		margin: 0 auto;
		margin-top: 20%;
		height: 1000rpx;
		
		.top{
			width: 100%;
			height: 900rpx;
			
			image{
				width: 100%;
				height: 100%;
			}
		}
		.bottom{
			height: 100rpx;
			
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
