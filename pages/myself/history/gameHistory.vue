<template>
	<view class="gameHistory">
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<view class="title">
			<view class="title-item" :class="active == index?'active':''" v-for="(item,index) in title" :key="index" @click="change(index)"> 
				{{item}}
			</view>
		</view>
		<!-- 优惠卷 -->
		<view v-if="active == 0">
			<scroll-view 
			class="scroll-view" 
			:scroll-top="scrollTop"
			:show-scrollbar="true" 
			scroll-y
			@scrolltolower="handletolower">
				<div class="couponlist-box" v-for="(item,index) in list" :key="index">
					<!-- 简介 -->
					<div class="couponlist-item" :style="{'border-left':item.status == 1?'3px dotted rgb(255,154,110)':'3px dotted rgb(219,224,227)'}">
						<div :class="item.status == 1?'couponlist-item-a':'couponlist-item-a-no'" :style="">
							<div>
								<text style="font-size: 32rpx;" v-if="item.coupon_type == 2">&yen;</text>
								<text style="font-size: 50rpx;" v-if="item.coupon_type == 1">{{item.deduction_time}}小时</text>
								<text style="font-size: 50rpx;" v-else-if="item.coupon_type == 2">{{item.deduction_amount}}</text>
								<text style="font-size: 50rpx;" v-else-if="item.coupon_type == 3">{{item.discount}}折</text>
								<text style="font-size: 50rpx;" v-else-if="item.coupon_type == 4">{{item.discount}}折</text>
								<text style="font-size: 50rpx;" v-else>{{item.deduction_amount}}</text>
							</div>
							<!-- <div>{{item.roule}}</div> -->
						</div>
						<div :class="item.status == 1?'couponlist-item-b':'couponlist-item-b-no'">
							<div class="couponlist-item-b-child">
								<div class="couponlist-item-b-child-top">
									<div class="couponlist-item-b-child-top-left">
										<div>{{item.coupon_name}}</div>
										<div><text>{{item.effective_time}}</text><text>到期</text></div>
									</div>
									<div class="couponlist-item-b-child-top-right" @click="isUse(item)">
										{{item.status == 1?'立即使用':(item.status == 2?'已使用':'已过期')}}
									</div>
								</div>
								<div class="couponlist-item-b-child-bottom" @click="looDetail(index)">
									<div>详细信息</div>
									<div >
										<u-icon :name="select == index?'arrow-up':'arrow-down'" color="#fff" size="20"></u-icon>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- 简介end -->
					<!-- 详细信息 -->
					<div class="couponlist-info" :class="[select !== index?'couponlist-info-hidden':'couponlist-info-block',active != 0?'activeback':'']">
						<div><text>1.可用停车场:</text><text>{{item.park}}</text></div>
						<div><text>2.可用时间段限制:</text><text>{{item.restricted_period}}</text></div>
						<div><text>3.可用节假日限制:</text><text>{{item.is_restricted_period == 1?'是':'否' }}</text></div>
						<div><text>4.与其他优惠卷共同使用:</text><text>{{item.is_public == 1?'是':'否'}}</text></div>
						<div><text>5.优惠券使用有效期:</text><text>{{item.start_valid_period}}~{{item.end_valid_period}}</text></div>
					</div>
					<!-- 详细信息end -->
				</div>
			</scroll-view>
			<u-loadmore v-if="list.length >= 15" :status="status" />
		</view>
		<!-- 积分 -->
		<view v-if="active == 1">
			<scroll-view 
			:scroll-top="scrollTop"
			:show-scrollbar="true" 
			@scrolltolower="handletolower"
			class="scroll-view" scroll-y>
				<view class="jfList" v-for="(item,index) in list" :key="index">
					<div>+{{item.earn_points}}</div>
					<div>
						<span>中奖时间</span>
						<span>{{item.created_at.substring(0,10)}}</span>
						<span>{{item.created_at.substring(10)}}</span>
					</div>
				</view>
			<u-loadmore v-if="list.length >= 15" :status="status" />
			</scroll-view>	
		</view>
		<!-- 包时卡 -->
		<view v-if="active == 2">
			<scroll-view 
			:scroll-top="scrollTop"
			:show-scrollbar="true" 
			@scrolltolower="handletolower"
			class="scroll-view" scroll-y>
				<view class="cardList" v-for="(item,index) in list" :key="index">
					<div class="cardList-left">
						<div>
							{{item.name}}
						</div>
						<div>
							<span>请于</span>
							<span>{{item.activate_time.substring(0,10)}}</span>
							<span>{{item.activate_time.substring(10)}}</span>
						</div>
						<div>前激活使用过期包时卡作废</div>
					</div>
					<div class="cardList-right" @click="jihuo(item.id,item.is_activate)">
						<span>{{is_activate == 1?'已激活':(is_activate == 2?'激活':'已过期')}}</span>
					</div>
				</view>
			<u-loadmore v-if="list.length >= 15" :status="status" />
			</scroll-view>	
		</view>
		
	</view>
</template>

<script>
	import { record } from '@/pages/api/request.js'
	export default{
		data(){
			return {
				active:0,
				select:-1,
				title:['优惠卷','积分','包时卡'],
				status: 'loadmore',
				currPage:1,
				pagesize:15,
				hasMore:true,
				isShow:true,
				list:[],
				scrollTop:0
			}
		},
		created() {
		  this.getList()	
		},
		destroyed() {
			clearTimeout()
		},
		methods:{
			changeScrollView(){
			    this.scrollTop = 0;//回到最顶部
			},
			handletolower(page){
				if(this.hasMore){
					this.status = 'loading'
					this.currPage += 1
					this.getList()
				}else{
					this.status = 'nomore'
				}
			},
			// 使用优惠卷
			isUse(item){
				if(item.status == 1){
					let routes = getCurrentPages();
					let curRoute = routes[routes.length - 1].route
					if(curRoute == 'pages/myself/history/gameHistory'){
						uni.reLaunch({
							url:'../../home/index'
						})
					}else{
						this.$emit('getInfo',item)
					}
				}else{
					return false
				}
			},
			looDetail(index){
				if(this.select == index){
					this.select = -1
				}else{
					this.select = index
				}
			},
			// 激活
			jihuo(id,is_activate){
				console.login(is_activate)
				if(is_activate == 2 || is_activate == '2'){
					uni.navigateTo({
						url:'./jihuo'
					})
				}else{
					uni.showToast({
						title:'无法激活',
						icon:'none'
					})
				}
			},
			getList(){
				setTimeout(time =>{
				var that = this
				record({
					type:that.active+1,
					page:that.currPage,
					pagesize:that.pagesize
				}).then(res=>{
					if (res.data.code == 200) {
						if (that.currPage === 1){
							that.list = res.data.data
							that.status = 'loadmore'
						}else{
							that.list = [...that.list, ...res.data.data]
							that.changeScrollView()
							that.status = 'loadmore'
						}
						if(res.data.data.length < that.pagesize){
							that.status= 'noMore'
							that.changeScrollView()
							that.hasMore = false
						}
						that.isShow = false
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
						this.isShow = false
					}
				})
				},1000)
			},
		
			change(index){
				this.isShow = true
				this.active = index
				this.currPage = 1
				this.list = []
				this.hasMore = true
				this.getList()
			}
		}
	}
</script>

<style lang="scss">
	.gameHistory{
		
		.title{
			width: 75%;
			margin: 0 auto;
			display:flex;
			margin-top:3%;
			margin-bottom:5%;
			height:90rpx;
			line-height:90rpx;
			
			.title-item{
				width: 33.3%;
				text-align: center;
				color: rgba(0,0,0,0.4);
			}
			.active{
				color: #333;
				border-bottom: 2px solid rgb(99,133,247);
			}
		}
		.scroll-view{
			width: 100%;
			height: 85vh;
			
			.jfList{
				height: 150rpx;
				border-radius: 30rpx;
				background-color: #fff;
				padding-left: 5%;
				width: 90%;
				margin: 0 auto;
				margin-top: 3%;
				margin-bottom: 3%;
				
				div:nth-child(1){
					height: 90rpx;
					line-height: 90rpx;
					color: #333;
					font-size: 42rpx;
					font-weight: bold;
				}
				div:nth-child(2){
					font-size: 25rpx;
					
					span:nth-child(2){
						margin-left: 5%;
					}
					span:nth-child(3){
						margin-left: 2%;
					}
				}
			}
			.cardList{
				height: 300rpx;
				width: 90%;
				margin: 0 auto;
				margin-top: 3%;
				margin-bottom: 3%;
				display: flex;
				
				.cardList-left{
					border-radius: 20rpx 0 0 20rpx;
					background-color: #fff;
					width: 80%;
					border-left: 1px solid rgb(255,154,110);
					border-top: 1px solid rgb(255,154,110);
					border-bottom: 1px solid rgb(255,154,110);
					border-right: 3px dotted rgb(255,154,110);
					padding-left: 5%;
					
					div:nth-child(1){
						height: 140rpx;
						line-height: 140rpx;
						color: rgb(240,81,81);
						font-size: 40rpx;
						font-weight: bold;
					}
					div:nth-child(2){
						height: 60rpx;
						line-height: 60rpx;
						color: rgba(0,0,0,0.4);
						font-size: 25rpx;
						
						span:nth-child(2){
							margin-left: 5%;
							color: #333;
						}
						span:nth-child(3){
							margin-left: 3%;
							color: #333;
						}
					}
					div:nth-child(3){
						height: 80rpx;
						line-height: 80rpx;
						color: rgba(0,0,0,0.4);
						font-size: 25rpx;
					}
				}
				.cardList-right{
					border-radius:  0 20rpx 20rpx 0;
					background-color: rgb(255,154,110);
					width: 20%;
					text-align: center;
					line-height: 300rpx;
					color: #fff;
				}
			}
			.couponlist-box{
				background-color: rgb(250,251,253);
				margin: 0 auto;
				margin-top: 3%;
				margin-bottom:3%;
				width:90%;
				
				.couponlist-item{
					display: flex;
					height: 200rpx;
					
					.couponlist-item-a{
						width: 35%;
						height: 100%;
						background-color: rgb(255,154,110);
						color: #fff;
						
						div:nth-child(1){
							height: 100rpx;
							line-height: 150rpx;
							font-weight: bold;
							text-align:left;
							margin-left: 15%;
						}
						div:nth-child(2){
							margin-top: 5%;
							color: #e6e6e6;
							text-align:center;
						}
					}
					.couponlist-item-a-no{
						width: 35%;
						height: 100%;
						background-color: rgb(219,224,227);
						color: rgb(154,154,154);
						
						div:nth-child(1){
							height: 100rpx;
							line-height: 150rpx;
							font-weight: bold;
							text-align:left;
							margin-left: 15%;
						}
						div:nth-child(2){
							margin-top: 5%;
							color: #e6e6e6;
							text-align:center;
						}
					}
					.couponlist-item-b{
						width: 65%;
						background-color: #fff;
						
						.couponlist-item-b-child{
							width: 90%;
							height: 100%;
							margin-left: 5%;
							
							.couponlist-item-b-child-top{
								display: flex;
								height: 140rpx;
								border-bottom:1px solid #d6d6d6;
								
								.couponlist-item-b-child-top-left{
									width: 60%;
									
									div{
										height: 60rpx;
										line-height: 60rpx;
									}
									div:nth-child(1){
										color: #333;
										font-weight: bold;
										font-size: 28rpx;
									}
									div:nth-child(2){
										color: rgba(0, 0, 0, 0.447058823529412);
										font-size: 25rpx;
									}
								}
								
								.couponlist-item-b-child-top-right{
									width: 35%;
									height: 45rpx;
									line-height: 45rpx;
									cursor: pointer;
									text-align: center;
									border:1px solid rgb(255,154,110);
									border-radius: 49rpx;
									font-size: 24rpx;
									margin-top: 8%;
									color: rgb(255,154,110);
								}
							}
							.couponlist-item-b-child-bottom{
								height: 60rpx;
								line-height: 60rpx;
								color: #d6d6d6;
								display:flex;
								
								div:nth-child(1){
									width: 90%;
								}
								div:nth-child(2){
									width: 8%;
									height: 30rpx;
									border-radius: 50%;
									margin-top: 5%;
									background-color: rgb(204,204,204);
									line-height: 25rpx;
									text-align: center;
									cursor: pointer;
								}
							}
						}
					}
					.couponlist-item-b-no{
						width: 65%;
						background-color: rgb(240,241,245);
						color: rgba(0, 0, 0, 0.447058823529412);
						
						.couponlist-item-b-child{
							width: 90%;
							height: 100%;
							margin-left: 5%;
							
							.couponlist-item-b-child-top{
								display: flex;
								height: 140rpx;
								border-bottom:1px solid #d6d6d6;
								
								.couponlist-item-b-child-top-left{
									width: 60%;
									
									div{
										height: 60rpx;
										line-height: 60rpx;
									}
									div:nth-child(1){
										font-weight: bold;
										font-size: 28rpx;
									}
									div:nth-child(2){
										
										font-size: 25rpx;
									}
								}
								
								.couponlist-item-b-child-top-right{
									width: 35%;
									height: 45rpx;
									line-height: 45rpx;
									cursor: pointer;
									text-align: center;
									border:1px solid rgb(219,224,227);
									border-radius: 49rpx;
									font-size: 24rpx;
									margin-top: 8%;
								}
							}
							.couponlist-item-b-child-bottom{
								height: 60rpx;
								line-height: 60rpx;
								display:flex;
								
								div:nth-child(1){
									width: 90%;
								}
								div:nth-child(2){
									width: 8%;
									height: 30rpx;
									border-radius: 50%;
									margin-top: 5%;
									background-color: rgb(204,204,204);
									line-height: 25rpx;
									text-align: center;
									cursor: pointer;
								}
							}
						}
					}
				}
				.activeback{
					background-color: rgb(240,241,245);
				}
				
				.couponlist-info{
					color: rgba(0, 0, 0, 0.447058823529412);
					
					div{
						font-size: 26rpx;
						text:nth-child(2){
							margin-left: 3%;
						}
					}
				}
				.couponlist-info-hidden{
					height:0rpx;
					visibility: hidden;
					opacity: 0;position: absolute;
				}
				// @keyframes couponlistanima {
				//   0%   { height:200rpx;}
				//   10%  { height:180rpx;}
				//   20%  { height:160rpx;}
				//   30%  { height:140rpx;}
				//   40%  { height:120rpx;}
				//   50%  { height:100rpx;}
				//   60%  { height:80rpxrpx;}
				//   70% { height:60rpxrpx;}
				//   80% { height:40rpx;}
				//   90% { height:20rpx;}
				//   100% { height:0rpx;visibility: hidden;opacity: 0;position: absolute;}
				// }
				// .couponlist-info-block{
				// 	animation-name: couponlistanimabl;
				// 	animation-duration: 0.5s;
				// 	animation-fill-mode:forwards;
				// }
				// @keyframes couponlistanimabl {
				//   0%   { height:0rpx;}
				//   10%  { height:20rpx;}
				//   20%  { height:40rpx;}
				//   30%  { height:60rpx;}
				//   40%  { height:80rpx;}
				//   50%  { height:100rpx;}
				//   60%  { height:120rpxrpx;}
				//   70% { height:140rpxrpx;}
				//   80% { height:160rpx;}
				//   90% { height:180rpx;}
				//   100% { height:200rpx;}
				// }
			}
		}
	}
</style>
