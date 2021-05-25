<template>
	<view class="integralList">
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<scroll-view 
		class="scroll-view" 
		:scroll-top="scrollTop"
		:show-scrollbar="true" 
		scroll-y 
		@scrolltolower="handletolower">
			<view v-for="(item,index) in list" :key="index" class="scroll-view-item">
				<div class="scroll-view-item-a">
					<span>{{item.exchange_unit_points}}</span>
					<span>积分</span>
				</div>
				<div class="scroll-view-item-b">
					<div>{{item.exchange_name}}</div>
					<div>
						<!-- <span>优惠卷抵扣</span>
						<span>{{item.coupon.deduction_time}}</span>
						<span>小时</span>
						<span>优惠卷</span> -->
						<span v-if="item.coupon.coupon_type == 1">优惠卷 抵时</span>
						<span v-else-if="item.coupon.coupon_type == 2">优惠卷 抵金额</span>
						<span v-else-if="item.coupon.coupon_type == 3">优惠卷 折扣</span>
						<span v-else>优惠卷 全免</span>
						<span v-if="item.coupon.coupon_type == 1">{{item.coupon.deduction_time}}小时</span>
						<span v-if="item.coupon.coupon_type == 2">{{item.coupon.deduction_amount}}元</span>
						<span v-if="item.coupon.coupon_type == 3">{{item.coupon.discount}}折</span>
						<span v-if="item.coupon.coupon_type == 4">全免</span>
					</div>
					<div>
						<span>有效期</span>
						<span>{{item.exchange_end_date.substr(0,10)}}</span>
						<span>{{item.exchange_end_date.substr(10)}}</span>
					</div>
				</div>
				<div @click="lookDetail(item)" class="scroll-view-item-c">
					<div></div>
					<div>查看</div>
					<div>明细</div>
				</div>
			</view>
			<u-loadmore v-if="list.length >= 15" :status="status"  />
		</scroll-view>	
	</view>
</template>

<script>
	import { pointsShop } from '@/pages/api/request.js'
	export default{
		data() {
			return {
				isShow:true,
				currPage:1,
				pagesize:15,
				hasMore:true,
				list:[],
				status: 'loadmore',
				scrollTop:0
			}
		},
		created() {
			this.getPointsShop()
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
				  this.getPointsShop()
				}else{
					this.status = 'nomore'
				}
			},
			lookDetail(item){
				uni.navigateTo({
					url:'/pages/myself/integral/integralDetail?exchangeId=' + item.exchange_id
				})
			},
			getPointsShop(){
				setTimeout(time =>{
				var that = this
				pointsShop({
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
							that.status= 'nomore'
							that.changeScrollView()
							that.hasMore = false
						}
						that.isShow = false
					}else{
						uni.showToast({
							title:res.data.msg,
							duration:2000
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
	.integralList{
		width: 90%;
		margin: 0 auto;
		
		.scroll-view{
			height: 95vh;
			
			.scroll-view-item{
				margin-bottom: 3%;
				border-radius: 16rpx;
				height: 200rpx;
				border:1px solid rgb(255,154,110);
				display: flex;
				
				.scroll-view-item-a{
					width: 30%;
					text-align: center;
					line-height: 200rpx;
					color:rgb(241,82,79);
					
					span:nth-child(1){
						font-size: 42rpx;
						font-weight: bold;
					}
					span:nth-child(2){
						font-size: 24rpx;
						margin-left: 2%;
					}
				}
				.scroll-view-item-b{
					width: 55%;
					font-size: 24rpx;
					
					div{
						height: 66.6rpx;
						line-height: 66.6rpx;
					}
					div:nth-child(2){
						
						span:nth-child(2){
							color:rgb(241,82,79);
							font-weight: bold;
							font-size: 38rpx;
							margin-left: 5%;
						}
						span:nth-child(3){
							color:rgb(241,82,79);
						}
					}
					div:nth-child(3){
						font-size:24rpx;
						
						span:nth-child(2){
							color: rgba(0,0,0,0.4);
							margin-left: 5%;
						}
						span:nth-child(3){
							color: rgba(0,0,0,0.4);
							margin-left: 2%;
						}
					}
				}
				.scroll-view-item-c{
					width: 15%;
					border-left: 3px dotted rgb(255,154,110);
					text-align: center;
					background-color: rgb(255,154,110);
					color: #fff;
					cursor: pointer;
					
					div:nth-child(1){
						height: 60rpx;
					}
				}
			}
		}
	}
</style>
