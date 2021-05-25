<template>
	<view class="messages">
		<scroll-view class="scroll-view" scroll-y>
			<div v-for="(item,index) in scrollList" :key="index" class="scroll-view-item">
				<div class="scroll-view-item-top">
					<div>
						<image :src="ldPath" mode=""></image>
						<div :style="{'display':item.status == 'new'?'block':'none'}"></div>
					</div>
					<div>{{item.title}}</div>
					<div><span>{{item.created_at.substr(0,10)}}</span><span>{{item.created_at.substr(10)}}</span></div>
				</div>
				<div class="scroll-view-item-bottom">
					<!-- <div>查看详细</div>
					<div><u-icon name="arrow-right"></u-icon></div> -->
				</div>
			</div>
		<!-- <u-loadmore :status="status" /> -->
		</scroll-view>
	</view>
</template>

<script>
	import {msgUser} from '@/pages/api/request.js'
	export default{
		data(){
			return{
				status: 'loadmore',
				ldPath:this.$store.state.login.url+'/static/mini/static/myself/lingdang.png',
				scrollList:[]
			}
		},
		created() {
		  this.getMsgUser()
		},
		methods:{
			getMsgUser(){
				var that = this
				msgUser({}).then(res=>{
					if (res.data.code == 200) {
						that.scrollList = res.data.data
					}else{
						uni.showToast({
							title:res.data.msg,
							duration:2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.messages{
		width: 90%;
		margin: 0 auto;
		
		.scroll-view{
			width: 100%;
			height: 90vh;
			
			.scroll-view-item{
				background-color: #fff;
				border-radius: 16rpx;
				margin-top: 3%;
				padding-top:5%;
				
				.scroll-view-item-top{
					height: 75rpx;
					line-height: 75rpx;
					width: 90%;
					margin: 0 auto;
					border-bottom: 1px solid #d6d6d6;
					display: flex;
					
					div:nth-child(1){
						width: 8%;
						height: 48rpx;
						margin-top: 2%;
						background-color: #007AFF;
						border-radius: 50%;
						text-align: center;
						line-height:50rpx;
						position:relative;
						
						image{
							width: 50%;
							height: 50%;
						}
						div{
							position: absolute;
							width: 10rpx;
							height: 10rpx;
							border-radius: 50%;
							background-color: red;
							top: 0;
							left: 65%;
						}
					}
					div:nth-child(2){
						width: 45%;
						color: #333;
						text-align: center;
						font-weight: bold;
					}
					div:nth-child(3){
						width: 45%;
						font-size: 22rpx;
						color: rgba(0,0,0,0.4);
						span:nth-child(2){
							margin-left: 2%;
						}
					}
				}
				.scroll-view-item-bottom{
					height: 100rpx;
					line-height: 100rpx;
					display: flex;
					color: rgba(0,0,0,0.4);
					font-size: 24rpx;
					width:90%;
					margin:0 auto;
					div:nth-child(1){
						width: 95%;
					}
				}
			}
		}	
	}
</style>
