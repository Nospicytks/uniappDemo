<template>
	<view class="history">
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<scroll-view 
		class="scroll-view" 
		:scroll-top="scrollTop"
		:show-scrollbar="true" 
		scroll-y 
		@scrolltolower="handletolower">
				<div v-for="(item,index) in historyList" :key="index" class="scroll-view-item">
					<div class="scroll-view-item-left">
						<div>&yen;{{item.cost}}</div>
						<br>
						<div>支付类型</div>
						<div>车牌号</div>
						<div>停车场</div>
						<div>付费时间</div>
					</div>
					<div class="scroll-view-item-right">
						<div v-if="item.card" class="scroll-view-item-right-child"
						:class="{ 'scroll-view-item-right-a':(index+1)%2 == 0, 'scroll-view-item-right-b':(index+1)%3 == 0}">
							{{item.card.order_name}}
						</div>
						<div v-if="item.account" class="scroll-view-item-right-child"
						:class="{ 'scroll-view-item-right-a':(index+1)%2 == 0, 'scroll-view-item-right-b':(index+1)%3 == 0}">
							{{item.account.order_name}}
						</div>
						<div v-if="item.park" class="scroll-view-item-right-child"
						:class="{ 'scroll-view-item-right-a':(index+1)%2 == 0, 'scroll-view-item-right-b':(index+1)%3 == 0}">
							{{item.park.order_name}}
						</div>
						<br>
						<div>{{item.pay_type}}</div>
						<div>{{item.car_number}}</div>
						<div>{{item.park_name}}</div>
						<div>{{item.created_at}}</div>
					</div>
				</div>
		<u-loadmore v-if="historyList.length >= 15" :status="status" />
		</scroll-view>
	</view>
</template>

<script>
	import { orderUser } from '@/pages/api/request.js'
	export default{
		data(){
			return{
				status: 'loadmore',
				currPage:1,
				pagesize:15,
				hasMore:true,
				historyList:[],
				isShow:true,
				status: 'loadmore',
				scrollTop:0
			}
		},
		created() {
		  this.getOrderUser()	
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
				  this.getOrderUser()
				}else{
					this.status = 'nomore'
				}
			},
			getOrderUser(){
				setTimeout(time =>{
				var that = this
				orderUser({
					page:that.currPage,
					pagesize:that.pagesize
				}).then(res=>{
					if (res.data.code == 200) {
						if (that.currPage === 1){
							that.historyList = res.data.data
							that.status = 'loadmore'
						}else{
							that.historyList = [...that.historyList, ...res.data.data]
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
			},
		}
	}
</script>

<style lang="scss">
	.history{
		width: 90%;
		margin: 0 auto;
		
		.scroll-view{
			width: 100%;
			height: 90vh;
			
			.scroll-view-item{
				height: 300rpx;
				background-color: #fff;
				border-radius: 16rpx;
				margin-top: 3%;
				display:flex;
				padding-top:5%;
				
				.scroll-view-item-left{
					margin-right: auto;
					padding-left: 5%;
					div{
						height: 50rpx;
						line-height: 50rpx;
						color: rgba(0,0,0,0.4);
						font-size: 22rpx;
					}
					div:nth-child(1){
						font-weight: bold;
						color: #333;
						font-size: 42rpx;
						height: 50rpx;
						line-height: 50rpx;
					}
				}
				.scroll-view-item-right{
					padding-right: 5%;
					text-align:right;
					margin-left:auto;
					div{
						height: 50rpx;
						line-height: 50rpx;
						color: rgba(0,0,0,0.4);
						font-size: 22rpx;
					}
					.scroll-view-item-right-child{
						color: #fff;
						font-size: 24rpx;
						height: 50rpx;
						width: 100%;
						line-height: 50rpx;
						text-align: center;
						border-radius: 12rpx;
						background: linear-gradient(right,rgb(47,194,90),rgb(107,222,128));
					}
					.scroll-view-item-right-a{
						background: linear-gradient(right,rgb(32,130,255),rgb(2,178,254));
					}
					.scroll-view-item-right-b{
						background: linear-gradient(right,rgb(255,158,1),rgb(246,178,17));
					}
				}
				
			}
			
		}
		
	}
</style>
