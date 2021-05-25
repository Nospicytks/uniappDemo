<template>
	<view class="nearbydetail">
		<view class="title">
			<div class="title-left">
				<div>{{parkDetail.park_name}}</div>
				<div><span>{{parkDetail.distance}}米</span><span>|</span><span>总车位</span><span>{{parkDetail.park_num}}</span></div>
			</div>
			<div @click="call" class="title-right">
				<div>
					<image class="phoneImg" :src="phoneImg" mode=""></image>
				</div>
			</div>
		</view>
		<!-- 图片 -->
		<view class="photo">
			<swiper class="swiper"
			indicator-dots="true" 
			indicator-color='#d6d6d6' 
			indicator-active-color="#fff" 
			autoplay="true" 
			circular="true"
			>
			    <swiper-item v-for="(item, index) in parkDetail.image">
			        <image :src="item.url" mode=""></image>
			    </swiper-item>
			 </swiper>
		</view>
		<!-- 图片end -->
		<!-- 相关信息 -->
		<view class="info">
			<div class="info-item">
				<div class="info-item-img">
					<image :src="parkImg" mode=""></image>
				</div>
				<div>空余车位：{{parkDetail.surplus_num}}</div>
			</div>
			<div class="info-item">
				<div class="info-item-img">
					<image :src="timeImg" mode=""></image>
				</div>
				<div>营业时间：{{parkDetail.business_hours_start}}-{{parkDetail.business_hours_end}}</div>
			</div>
			<div class="info-item">
				<div class="info-item-img">
					<image :src="dwImg" mode=""></image>
				</div>
				<div style="width: 70%;white-space: normal;overflow: hidden;text-overflow: ellipsis;">
					{{parkDetail.detail_address}}
			    </div>
				<div  @click="goMap">前往</div>
			</div>
		</view>
		<!-- 相关信息end -->
		<!-- 规则 -->
		<view class="rules">
			<div>收费规则</div>
			<div><span>{{parkDetail.charges}}元</span><span>/小时</span></div>
		</view>
	</view>
</template>

<script>
	import {parkDetail} from "@/pages/api/request.js"
	export default{
		data(){
			return{
				phoneImg:this.$store.state.login.url+'/static/mini/static/nearby/phone.png',
				parkImg:this.$store.state.login.url+'/static/mini/static/nearby/park.png',
				timeImg:this.$store.state.login.url+'/static/mini/static/nearby/time.png',
				dwImg:this.$store.state.login.url+'/static/mini/static/nearby/dw.png',
				park_id:'',
				location:'',
				parkDetail:null
			}
		},
		onLoad(options) {
			this.park_id = options.park_id
			this.location = options.location
			this.getParkDetail()
		},
		methods:{
			getParkDetail(){
				var that = this
				parkDetail({
					location:that.location,
					park_id:that.park_id
				}).then(res=>{
					if (res.data.code == 200){
						this.parkDetail = res.data.data
					}else{
						uni.showToast({
						    title: res.data.msg,
						    duration: 2000
						});
					}
				})
			},
			goMap(){
				console.log('sssssss')
				uni.navigateTo({
					url:'../map/map?parkItem=' + JSON.stringify(this.parkDetail)
				})
			},
			call(){
				var that = this
				uni.makePhoneCall({
						// 手机号
						phoneNumber: that.parkDetail.park_phone,
						// 成功回调
						success: (res) => {
							console.log('调用成功!')
						},
						// 失败回调
						fail: (res) => {
							console.log('调用失败!')
						}
					});
			}
		}
	}
</script>

<style lang="scss">
	.nearbydetail{
		width: 90%;
		margin: 0 auto;
		
		.title{
			height: 150rpx;
			margin-top: 5%;
			background-color: #fff;
			border-radius: 16rpx;
			display: flex;
			
		}
		.title-left{
			width: 75%;
			padding-left:5%;
			
			div:nth-child(1){
				height: 80rpx;
				line-height: 80rpx;
				font-weight: bold;
				font-size: 33rpx;
			}
			div:nth-child(2){
				color: rgba(0,0,0,0.4);
				font-size: 24rpx;
				
				span:nth-child(2){
					margin-left: 3%;
				}
				span:nth-child(3){
					margin-left: 3%;
				}
				span:nth-child(4){
					margin-left: 2%;
				}
			}
		}
		.title-right{
			width: 25%;
			
			div{
				width: 60%;
				margin: 0 auto;
				border-radius: 50%;
				margin-top: 15%;
				height: 95rpx;
				background-color: rgb(255,156,115);
				text-align:center;
				.phoneImg{
					width: 40%;
					height:40%;
					margin-top: 25%;
				}
			}
		}
		
		.photo{
			height: 500rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 3%;
			text-align:center;
			
			.swiper{
				width:100%;
				height:100%;
				border-radius: 8rpx;
				
				image{
					width: 100%;
					height: 100%;
					border-radius: 8rpx;
				}
			}
		}
		.info{
			height: 300rpx;
			background-color: #fff;
			margin-top: 3%;
			border-radius: 16rpx;
			
			.info-item{
				width: 95%;
				margin: 0 auto;
				height: 100rpx;
				line-height: 100rpx;
				border-bottom:1px solid #d6d6d6;
				display: flex;
				
				
				.info-item-img{
					width: 5%;
					height: 35rpx;
					margin-top:1%;
					
					image{
						width: 100%;
						height: 100%;
					}
				}
				div:nth-child(2){
					margin-left: 5%;
					width: 65%;
					color: rgba(0,0,0,0.4);
				}
				div:nth-child(3){
					color: #fff;
					text-align: center;
					width: 25%;
					height: 60rpx;
					line-height: 55rpx;
					border-radius: 30rpx;
					margin-top: 2%;
					background: -webkit-linear-gradient(right,rgb(254,189,151), rgb(255,149,108)); /* Safari 5.1 - 6.0 */
					background: -o-linear-gradient(right,rgb(254,189,151), rgb(255,149,108)); /* Opera 11.1 - 12.0 */
					background: -moz-linear-gradient(right,rgb(254,189,151), rgb(255,149,108)); /* Firefox 3.6 - 15 */
					background: linear-gradient(right,rgb(254,189,151), rgb(255,149,108)); /* 标准的语法（必须放在最后） */
				}
			}
			.info-item:nth-child(3){
				border:none;
			}
		}
		.rules{
			height: 150rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 8%;
			padding-left:7%;
			
			div{
				height: 80rpx;
				line-height: 80rpx;
				font-weight: bold;
				font-size: 32rpx;
			}
			div:nth-child(2){
				height: 50rpx;
				line-height: 50rpx;
				font-size: 26rpx;
				color: rgba(0,0,0,0.4);
			}
		}
	}
</style>
