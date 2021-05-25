<template>
	<view class="coupon">
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		
	<!-- <view class="coupon"> -->
		<!-- 选择 -->
		<view class="couponchange">
			<div @click="change(index)" class="couponchange-child" v-for="(item,index) in couponTitle" :key="index">
				<div :style="{'color':active == index?'#007AFF':''}">{{item.name}}</div>
				<div class="couponchange-child-div" :class="active == index?'active':''"></div>
			</div>
		</view>
		<!-- 兑换券列表 -->
		<!-- @scroll="scroll" -->
		<!-- :scroll-anchoring="true" -->
		<scroll-view
		 :scroll-anchoring="true"
		 :scroll-top="scrollTop"
		:show-scrollbar="true" 
		:style="{'height':height}"  class="couponlist"  
		scroll-y @scrolltolower="handletolower">
		<view>
			<div class="couponlist-box" v-for="(item,index) in couponlist" :key="index">
				<!-- 简介 -->
				<div class="couponlist-item"  :style="{'border-left':index%2 == 0?'3px dotted rgb(255,154,110)':'3px dotted rgb(243,180,64)'}">
					<div class="couponlist-item-a" :style="{'background-color':index%2 == 0?'rgb(255,154,110)':'rgb(243,180,64)'}">
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
					<div class="couponlist-item-b" :class="active != 0?'activeback':''">
						<div class="couponlist-item-b-child">
							<div class="couponlist-item-b-child-top">
								<div class="couponlist-item-b-child-top-left">
									<div>{{item.coupon_name}}</div>
									<div><text>{{item.effective_time}}</text><text>到期</text></div>
								</div>
								<div :class="index%2 == 0?'couponlist-item-b-child-top-right':'couponlist-item-b-child-top-right2'" @click="isUse(item)">
									{{active == 0?'立即使用':(active == 1?'已使用':'已过期')}}
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
				<div class="couponlist-info" :class="[select !== index?'couponlist-info-hidden':'',active != 0?'activeback':'']">
					<div><text>1.可用停车场:</text><text>{{item.park}}</text></div>
					<div><text>2.可用时间段限制:</text><text>{{item.restricted_period}}</text></div>
					<div><text>3.可用节假日限制:</text><text>{{item.info3}}</text></div>
					<div><text>4.与其他优惠卷共同使用:</text><text>{{item.is_public == 1?'是':'否'}}</text></div>
					<div><text>5.优惠券使用有效期:</text><text>{{item.start_valid_period}}~{{item.end_valid_period}}</text></div>
				</div>
				<!-- 详细信息end -->
			</div>
		</view>
		<u-loadmore v-if="couponlist.length >= 15" :status="status" />
	</scroll-view>
	</view>
</template>

<script>
	import { couponUser } from '@/pages/api/request.js'
	export default{
		data(){
			return{
				currPage:1,
				hasMore:true,
				isShow:true,
				pagesize:15,
				status: 'loadmore',
				active:0,
				select:-1,
				infodetail:0,
				couponTitle:[
					{
						name:'未使用'
					},
					{
						name:'已使用'
					},
					{
						name:'已过期'
					}
				],
				couponlist:[],
				scrollTop:0
			}
		},
		props:{
			height:{
			  type:String,
			  required:false,
			  default:"85vh"
			},
		},
		computed: {
		    
		},
		created() {
			this.getCouponUser()
		},
		destroyed() {
			clearTimeout()
		},
		methods:{
			changeScrollView(){
			    this.scrollTop = 0;//回到最顶部
			},
			// 使用优惠卷
			isUse(item){
				let routes = getCurrentPages();
				let curRoute = routes[routes.length - 1].route
				if(curRoute == 'pages/myself/couponpage/couponpage'){
					if(this.active == 0){
						uni.reLaunch({
							url:'../../home/index'
						})
					}else{
						uni.showToast({
							title:'该优惠卷无法使用',
							icon:'none'
						})
					}
				}else{
					this.$emit('getInfo',item)
				}
			},
			handletolower(page){
				if(this.hasMore){
				 this.status = 'loading'
				 this.currPage += 1
				 this.getCouponUser()
				}else{
					this.status = 'nomore'
				}
			},
			looDetail(index){
				if(this.select == index){
					this.select = -1
				}else{
					this.select = index
				}
			},
			change(index) {
				this.isShow = true
				this.active = index;
				this.currPage = 1
				this.couponlist = []
				this.hasMore = true
				this.getCouponUser()
			},
			getCouponUser(){
				setTimeout(time=>{
					var that = this
					couponUser({
						status:that.active + 1,
						page:that.currPage,
						pagesize: that.pagesize
					}).then(res=>{
						if (res.data.code == 200) {
							if (that.currPage === 1){
								that.couponlist = res.data.data
								that.status = 'loadmore'
							}else{
								that.couponlist = [...that.couponlist, ...res.data.data]
								that.changeScrollView()
								that.status = 'loadmore'
							}
							if(res.data.data.length < that.pagesize){
								that.status = 'nomore'
								that.changeScrollView()
								that.hasMore = false
							}
							that.isShow = false
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
							that.isShow = false
						}
					})
				},1000)
				
			}
		}
	}
</script>

<style lang="scss">
	.coupon{
		width: 100%;
		
		.couponchange{
			width: 80%;
			margin: 0 auto;
			color:rgba(0, 0, 0, 0.447058823529412);
			justify-content: center;
			display:flex;
			height:70rpx;
			line-height:70rpx;
			
			.couponchange-child{
				width: 100%;
				text-align: center;
			}
			.couponchange-child-div{
				width: 35%;
				margin: 0 auto;
				
			}
			.active{
				border-bottom: 2px solid #007AFF;
				animation-name: activeanima;
				animation-duration: 0.2s;
				animation-fill-mode:forwards;
			}
			@keyframes activeanima {
			  0%   { width:3.5%;}
			  10%  { width:7%;}
			  20%  { width:10.5%;}
			  30%  { width:14%;}
			  40%  { width:17.5%;}
			  50%  { width:21%;}
			  60%  { width:24.5%;}
			  70%  { width:28%;}
			  80%  { width:31.5%;}
			  90%  { width:34%;}
			  100% { width:35%;}
			}
		}
		
		.couponlist{
			width: 90%;
			margin: 0 auto;
			height: 85vh;
		}
		.couponlist-box{
			background-color: rgb(250,251,253);
			margin-top: 3%;
			
			.couponlist-item{
				display: flex;
				height: 200rpx;
				
				
				.couponlist-item-a{
					width: 35%;
					height: 100%;
					
					color: #fff;
					
					div:nth-child(1){
						height: 100rpx;
						line-height: 150rpx;
						font-weight: bold;
						text-align:left;
						margin-left: 20%;
						margin-top:10%;
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
							.couponlist-item-b-child-top-right2{
								width: 35%;
								height: 45rpx;
								line-height: 45rpx;
								cursor: pointer;
								text-align: center;
								border:1px solid rgb(243,180,64);
								border-radius: 49rpx;
								font-size: 24rpx;
								margin-top: 8%;
								color: rgb(243,180,64);
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
				// animation-name: couponlistanima;
				// animation-duration: 0.5s;
				// animation-fill-mode:forwards;
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
			//   60%  { height:120rpx;}
			//   70% { height:140rpx;}
			//   80% { height:160rpx;}
			//   90% { height:180rpx;}
			//   100% { height:200rpx;}
			// }
		}
	}
</style>
