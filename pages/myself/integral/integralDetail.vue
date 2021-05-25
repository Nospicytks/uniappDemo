<template>
	<view class="integralDetail">
		<view class="center">
			<div class="center-a">
				<span>兑换价:</span>
				<span>{{exchangeInfo.exchange_unit_points}}</span>
				<span>积分</span>
			</div>
			<div class="center-b">
				<span>【积分兑换】</span>
				<span>停车场五元立减优惠卷</span>
			</div>
			<div class="center-c">
				兑换后可在对应的停车场使用,使用后即获得停车优惠
			</div>
			<div class="center-d">
				<span>优惠卷有效期:</span>
				<span>{{exchangeInfo.exchange_end_date}}</span>
			</div>
			<div class="center-e">
				<span>剩余数量:</span>
				<span>{{exchangeInfo.stock}}</span>
			</div>
			<div class="center-items">
				<span>可用停车场:</span>
				<span>{{exchangeInfo.coupon.park}}</span>
			</div>
			<div class="center-items">
				<span>可用节假日限制:</span>
				<span>无限制</span>
			</div>
			<div class="center-items">
				<span>可用时间段限制:</span>
				<span>{{exchangeInfo.coupon.restricted_period}}</span>
			</div>
			<div class="center-items">
				<span>与其他优惠卷混用限制:</span>
				<span>{{exchangeInfo.coupon.is_public == 1?'无限制':'限制'}}</span>
			</div>
			<div class="center-items">
				<span>单次停车结算张数限制:</span>
				<span>无限制</span>
			</div>
		</view>
		<!-- 结算 -->
		<view class="bottom">
			<!-- 计数器 -->
			<div class="nums">
				<div class="nums-left">
					<input v-model="number" type="number"  />
				</div>
				<div class="nums-right">
					<div @click="add" class="nums-right-add">
						<u-icon size="20" name="arrow-up"></u-icon>
					</div>
					<div @click="sub" class="nums-right-sub">
						<u-icon size="20" name="arrow-down"></u-icon>
					</div>
				</div>
			</div>
			<!-- 按钮 -->
			<div @click="show = true" class="button">
				立即兑换
			</div>
		</view>
		<!-- 模态框 -->
		<u-modal v-model="show" 
		title="兑换提醒"
		confirm-text="立即兑换"
		confirm-color="rgb(254,104,107)"
		cancel-text="返回" 
		@confirm="confirm"
		:show-cancel-button="true">
			<view class="slot-content">
				<div class="slot-content-item">
					<div>兑换礼品</div>
					<div>积分兑换{{exchangeInfo.exchange_name}}</div>
				</div>
				<div class="slot-content-item">
					<div>积分消耗</div>
					<div>{{exchangeInfo.exchange_unit_points}}积分兑换{{exchangeInfo.coupon.coupon_name}}</div>
				</div>
				<div class="slot-content-item">
					<div>兑换数量</div>
					<div>{{number}}</div>
				</div>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { pointsExchangeInfo } from '@/pages/api/request.js'
	import { pointsExchange } from '@/pages/api/request.js'
	export default{
		data(){
			return {
				number:1,
				show:false,
				exchangeId:'',
				exchangeInfo:null,
			}
		},
		onLoad(options) {
			this.exchangeId = options.exchangeId
			this.getPointsExchangeInfo()
		},
		methods:{
			confirm() {
				this.getPointsExchange()
			},
			add(){
				this.number ++
				console.log(this.number)
			},
			sub(){
				if(this.number > 1 ){
					this.number --
				console.log(this.number)
				}else{
					return false
				}
			},
			getPointsExchangeInfo(){
				var that = this
				pointsExchangeInfo({
					exchange_id:that.exchangeId
				}).then(res=>{
					if (res.data.code == 200){
						that.exchangeInfo = res.data.data
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			getPointsExchange(){
				var that = this
				pointsExchange({
					exchange_id:that.exchangeId,
					exchange_num: that.number
				}).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
					if (res.data.code == 200){
					uni.$emit('update_list','1')
					this.getPointsExchangeInfo()
						uni.navigateBack({
							delta: 1
						})
					}
				})
			},
			
		}
	}
</script>

<style lang="scss">
	.integralDetail{
		width: 90%;
		margin: 0 auto;
		
		.center{
			border-radius: 24rpx;
			background-color: #fff;
			margin-top: 5%;
			padding-left: 5%;
			padding-bottom:5%;
			
			.center-a{
				height: 80rpx;
				line-height: 80rpx;
				color: rgb(100,100,99);
				
				span:nth-child(2){
					font-size: 42rpx;
					font-weight: bold;
					color: rgb(241,81,81);
					margin-left: 5%;
				}
				span:nth-child(3){
					margin-left: 1%;
				}
			}
			.center-b{
				margin-top: 2%;
				color: rgba(0,0,0,0.4);
			}
			.center-c{
				color: rgba(0,0,0,0.4);
				margin-top: 2%;
			}
			.center-d{
				color: rgba(0,0,0,0.4);
				margin-top: 2%;
				span:nth-child(2){
					margin-left: 2%;
				}
				span:nth-child(3){
					margin-left: 3%;
				}
			}
			.center-e{
				margin-top: 2%;
				font-weight: bold;
				margin-top:5%;
				span:nth-child(2){
					margin-left: 3%;
				}
			}
			.center-items{
				margin-top: 2%;
				color: rgba(0,0,0,0.4);
				span:nth-child(2){
					margin-left: 3%;
				}
			}
		}
		.bottom{
			position: fixed;
			width: 90%;
			bottom: 3%;
			display: flex;
			
			.nums{
				width: 28%;
				height: 70rpx;
				display: flex;
				
				.nums-left{
					width: 70%;
					color:rgba(0,0,0,0.4);
					border-radius:12rpx 0 0 12rpx;
					border:1px solid #d6d6d6;
					
					input{
						width: 100%;
						height: 100%;
						padding-left: 10%;
					}
				}
				.nums-right{
					width: 30%;
					border:1px solid #d6d6d6;
					border-radius: 0 12rpx 12rpx 0;
					
					.nums-right-add{
						height: 35rpx;
						line-height: 35rpx;
						text-align: center;
						color: rgba(0,0,0,0.4);
						
						cursor: pointer;
					}
					.nums-right-sub{
						height: 35rpx;
						line-height: 35rpx;
						text-align: center;
						color: rgba(0,0,0,0.4);
						
						cursor: pointer;
					}
				}
			}
			.button{
				width: 60%;
				height: 80rpx;
				background:linear-gradient(to right,rgb(255,144,101),rgb(255,180,138));
				line-height: 80rpx;
				text-align: center;
				color: #fff;
				margin-left: 10%;
				border-radius: 12rpx;
				font-weight: bold;
				cursor: pointer;
			}
		}
		.slot-content{
			width: 90%;
			margin: 0 auto;
			padding-top:5%;
			padding-bottom:5%;
			.slot-content-item{
				margin-top: 5%;
				display:flex;
				font-size:24rpx;
				
				div:nth-child(1){
					color: rgba(0,0,0,0.4);
				}
				div:nth-child(2){
					text-align: right;
					margin-left: auto;
				}
			}
		}
	}
</style>
