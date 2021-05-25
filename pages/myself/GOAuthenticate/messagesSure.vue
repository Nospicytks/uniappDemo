<template>
	<view class="messagesSure">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" text="提交中..." />
		<!-- 提示 -->
		<view class="title">
			车辆认证需要完成身份信息认证,智慧停车平台不会将此信息用于其他途径!
		</view>
		<!-- 照片 -->
		<view class="takePhoto">
			<div>
				<image :src="cardPositive.card_positive_pic" alt="">
			</div>
			<div>
				<image :src="cardPositive.card_back_pic" alt="">
			</div>
		</view>
		<!-- 提示 -->
		<view class="title" style="font-size: 32rpx;color: #333;margin-bottom: 5%;">
			确认您的身份信息
		</view>
		<!-- 信息 -->
		<view class="messages">
			<div style="border-bottom:1px solid #d6d6d6;">
				<div>真实姓名</div>
				<div>{{cardPositive.name}}</div>
			</div>
			<div style="border-bottom:1px solid #d6d6d6;">
				<div>身份证号</div>
				<div>{{cardPositive.id_card}}</div>
			</div>
			<div style="border-bottom:1px solid #d6d6d6;">
				<div>起始有效期</div>
				<div>{{cardPositive.start_time}}</div>
			</div>
			<div>
				<div>截止有效期</div>
				<div>{{cardPositive.end_time}}</div>
			</div>
		</view>
		<!-- 提示 -->
		<view class="title" style="font-size: 32rpx;color: #333;margin-bottom: 5%;">
			认证后有如下特权
		</view>
		<!-- 特权列表 -->
		<view class="list">
			<div v-for="(item,index) in tqList" :key="index" class="list-item">
				<div><image :src="imgpath" mode=""></image></div>
				<div>{{item.content}}</div>
			</div>
		</view>
		<!-- 下一步 -->
		<view @click="goErtificationCar()" class="next">
			下一步
		</view>
	</view>
</template>

<script>
	import { userCertification } from '@/pages/api/request.js'
	export default{
		data(){
			return{
				isShow:false,
				cardPositive:null,
				imgpath:'http://park.chinay.work/static/mini/static/myself/icon.png',
				tqList:[
					{
						content:'可查看停车敏感信息:停车记录,缴费记录,停车图片,停车时间等',
					},
					{
						content:'防止恶意绑定泄露隐私,保护个人隐私',
					},
					{
						content:'车辆年检服务提醒',
					}
				]
			}
		},
		onLoad(options) {
			this.cardPositive = JSON.parse(options.card_positive)
		},
		methods:{
			goErtificationCar(){
				var that = this
				that.isShow = true
				userCertification({
					card_positive_pic:this.cardPositive.card_positive_pic,
					card_back_pic:this.cardPositive.card_back_pic,
					name:this.cardPositive.name,
					id_card:this.cardPositive.id_card
				}).then(res => {
					console.log(res)
					if (res.data.code == 200){
						that.isShow = false
						uni.reLaunch({
							url:'./authenticateSuccess?points='+res.data.data.points
						})
					}else{
						that.isShow = false
						uni.showToast({
						    title: res.data.msg,
						    icon:'none'
						});
					}
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.messagesSure{
		width: 90%;
		margin: 0 auto;
		
		.title{
			margin-top: 5%;
			color: rgba(0,0,0,0.4);
		}
		.takePhoto{
			height: 300rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 8%;
			display: flex;
			justify-content:space-around;
			padding-top:2%;
			
			div{
				width: 45%;
				
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.list{
			background-color: #fff;
			padding-top:5%;
			padding-bottom:5%;
			
			.list-item{
				width: 90%;
				margin: 0 auto;
				height: 100rpx;
				background-color: rgb(255,249,249);
				border-radius: 16rpx;
				display: flex;
				margin-top: 3%;
				
				div:nth-child(1){
					width: 15%;
					text-align:center;
					line-height:120rpx;
					image{
						width: 50%;
						height: 55%;
					}
				}
				div:nth-child(2){
					padding-top: 1%;
					width: 85%;
				}
			}
		}
		.next{
			height: 80rpx;
			line-height: 80rpx;
			color: #fff;
			background-color: rgb(77,116,247);
			text-align: center;
			margin-top: 8%;
			border-radius: 12rpx;
			font-weight: bold;
			cursor: pointer;
			margin-bottom: 5%;
		}
		.messages{
			height: 360rpx;
			background-color: #fff;
			border-radius: 16rpx;
			div{
				height: 89rpx;
				line-height: 89rpx;
				width:90%; 
				margin: 0 auto;
				
				div:nth-child(1){
					width: 30%;
					float: left;
					font-weight: bold;
					color: #333;
				}
				div:nth-child(2){
					width: 70%;
					text-align: right;
					float: right;
					color: rgba(0,0,0,0.7);
				}
			}
		}
	}
</style>
