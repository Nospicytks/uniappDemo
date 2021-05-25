<template>
	<view class="GOAuthenticate">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" text="loading..." />
		<!-- 提示 -->
		<view class="title">
			车辆认证需要完成身份信息认证,智慧停车平台不会将此信息用于其他途径!
		</view>
		<!-- 照片 -->
		<view class="takePhoto">
			<div>
				<v-ImgUpload-Back buttonTitle="正面照片" @sendAvatar="getImgZ"></v-ImgUpload-Back>
			</div>
			<div>
				<v-ImgUpload-Back buttonTitle="反面照片" @sendAvatar="getImgback"></v-ImgUpload-Back>	
			</div>
			
		</view>
		<!-- 提示 -->
		<view class="title" style="font-size: 32rpx;color: #333;margin-bottom: 5%;">
			认证后有如下特权
		</view>
		<!-- 特权列表 -->
		<view class="list">
			<div v-for="(item,index) in tqList" :key="index" class="list-item">
				<div><image :src="iconPath" mode=""></image></div>
				<div >{{item.content}}</div>
			</div>
		</view>
		<!-- 下一步 -->
		<view class="next" @click="uploadImage()">
			下一步
		</view>
	</view>
</template>

<script>
	import { userAnalyse } from '@/pages/api/request.js'
	export default{
		data(){
			return{
				isShow:false,
				getImg:'',
				getImgBack:'',
				avatarPath:'',
				backAvatarPath:'',
				avatarPlace:this.$store.state.login.url+'/static/mini/static/components/noPic.png',
				iconPath:this.$store.state.login.url+'/static/mini/static/myself/icon.png',
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
		methods:{
			getImgZ(val){
				this.getImg = val
			},
			getImgback(val){
				this.getImgBack = val
			},
			sendAvatarChange(path){
				console.log('sendAvatarChange',path)
				this.avatar = path;
			},
			sendAvatarChangeBack(path){
				console.log('sendAvatarChangeBack',path)
				this.backAvatar = path;
			},
			uploadImage(){
				if (this.getImg == ''){
					uni.showToast({
					    title: '请选择身份证正面',
					    duration: 2000
					});
					return
				}
				if (this.getImgBack == ''){
					uni.showToast({
					    title: '请选择身份证反面',
					    duration: 2000
					});
					return
				}
				var that = this;
				that.isShow = true
				userAnalyse({
					card_positive_pic: that.getImg,
					card_back_pic: that.getImgBack,
				}).then((res)=>{
					console.log(res)
					if (res.data.code == 200){
						that.isShow = false
						uni.navigateTo({
							url:'./messagesSure?card_positive=' + JSON.stringify(res.data.data) 
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
			},
		created() {
			
		},
		onUnload() {
			uni.$off('sendAvatar')
		},
	}
</script>

<style lang="scss">
	.GOAuthenticate{
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
			}
		}
		.list{
			background-color: #fff;
			padding-bottom:5%;
			padding-top:5%;
			
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
		}
	}
</style>
