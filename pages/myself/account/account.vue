<template>
	<view class="account">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" text="支付中" />
		<!-- 订单信息 -->
		<view class="head">
			<div>可用余额（元）</div>
			<div>{{account}}</div>	
			<div @click="getDetail">
				<span>明细</span>
				<u-icon name="arrow-right"></u-icon>
			</div>
		</view>
		<view class="title">充值金额</view>
		<view class="list" >
			<div @click="getActive(index)"
			class="list-item"
			 :style="{'background-color':active == index?'rgb(219,252,234)':''}" 
			 v-for="(item,index) in list" 
			 :key="index">
				<div>
					<span>&yen;</span>
					<span>{{item.recharge_amount}}</span>
				</div>
				<div v-if="item.credit !== '0'" :style="{'color':active == index?'rgb(69,192,148)':''}" >
					赠送{{item.credit}}元
				</div>
			</div>
		</view>	
		<view class="getMoncy" v-if="list && active !== -1">
			<div>到账金额</div>
			<div><span>{{ allNum }}</span><span>元</span></div>
		</view>
		<view v-if="list && active !== -1" class="button" @click="payMent">立即充值</view>
	</view>
</template>

<script>
	import { recharge,userInfo,configRechargeAmount,pay } from '@/pages/api/request.js'
	export default{
		data(){
			return {
				active:-1,
				account:0,
				isShow:true,
				list:[],
				allNum:''
			}
		},
		created() {
			this.getUserInfo()
			this.getConfigRechargeAmount()
		},
		methods:{
			// 支付
			payMent(){
				this.isShow = true
				recharge({
					amount:this.list[this.active].recharge_amount
				}).then((res)=>{
					if(res.data.code == 200){
						let order_sn = res.data.data.order_sn
						pay({
							order_sn:order_sn,
							order_type:2,
							pay_type:1
						}).then(res => {
							if(res.data.code == 200){
								uni.requestPayment({
									'timeStamp': res.data.data.timeStamp,//为字符串，否则报错
									'nonceStr': res.data.data.nonceStr,
									'package': res.data.data.package,
									'signType': res.data.data.signType,
									'paySign': res.data.data.paySign,
									success: (res) => {
										setTimeout(res => {
											this.isShow = false
											uni.showToast({
												title:'充值成功!',
												icon:'success'
											})
											this.getUserInfo()
										},1000)
									},
									fail: (e) => {
										uni.showToast({
											title:'支付失败,请重试',
											icon:'none'
										})
										this.isShow = false
									}
								})
							}else{
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
							}
						})
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
						this.isShow = false
					}
				})
			},
			getConfigRechargeAmount(){
				let that = this;
				configRechargeAmount({}).then((res)=>{
					if (res.data.code == 200) {
						that.list = res.data.data
							that.isShow = false
					}else{
						uni.showToast({
							title:res.data.msg,
							duration:2000
						})
						that.isShow = false
					}
				})
			},
			getUserInfo(){
				let that = this;
				userInfo({}).then((res)=>{
					if (res.data.code == 200) {
						that.account = res.data.data.account
					}else{
						uni.showToast({
							title:res.data.msg,
							duration:2000
						})
					}
				})
			},
			getActive(index){
				this.active = index
				this.allNum = Number(this.list[this.active].recharge_amount)+Number(this.list[this.active].credit)
			},
			getDetail(){
				uni.navigateTo({
					url:'/pages/myself/account/accountDetail'
				})
			}
		}
	}
</script>

<style lang="scss">
	.account{
		
		.head{
			width: 100%;
			height: 300rpx;
			background: -webkit-linear-gradient(rgb(83,120,252), rgb(69,101,246)); /* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(rgb(83,120,252), rgb(69,101,246)); /* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(rgb(83,120,252), rgb(69,101,246)); /* Firefox 3.6 - 15 */
			background: linear-gradient(rgb(83,120,252), rgb(69,101,246)); /* 标准的语法（必须放在最后） */
			text-align: center;
			color: #fff;
			padding-top:5%;
			
			div:nth-child(1){
				height: 60rpx;
				line-height: 60rpx;
			}
			div:nth-child(2){
				font-size: 42rpx;
				font-weight: bold;
			}
			div:nth-child(3){
				width: 15%;
				height: 50rpx;
				line-height: 50rpx;
				border: 1px solid #d6d6d6;
				margin: 0 auto;
				text-align: center;
				border-radius: 30rpx;
				background-color: rgb(76,112,250);
				color: snow;
				margin-top: 5%;
				cursor: pointer;
				font-size: 26rpx;
			}
		}
		.title{
			width: 80%;
			margin: 0 auto;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			letter-spacing: 2rpx;
		}
		.list{
			width:90%;
			margin: 0 auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			
			.list-item{
				width: 28%;
				box-shadow:0 0 12rpx rgb(186,237,214);
				margin-top: 5%;
				text-align: center;
				padding-top: 5%;
				border-radius:8rpx;
				cursor: pointer;
				padding-bottom:5%;
				
				div:nth-child(1){
					font-weight: bold;
					
					span:nth-child(2){
						font-size: 42rpx;
					}
				}
				div:nth-child(2){
					color: rgba(0,0,0,0.4);
					font-size: 24rpx;
					margin-top: 20%;
				}
			}
		}
		.getMoncy{
			text-align: center;
			margin-top:8%;
			
			div:nth-child(2){
				margin-top:3%;
				span:nth-child(1){
					color:rgb(79,115,251);
					font-weight:bold;
				}
			}
		}
		.button{
			width: 90%;
			margin: 0 auto;
			height: 80rpx;
			line-height: 80rpx;
			background-color: rgb(77,116,247);
			color: #fff;
			text-align: center;
			font-weight: bold;
			letter-spacing: 2rpx;
			font-size: 34rpx;
			border-radius: 8rpx;
			margin-top: 10%;
			cursor: pointer;
		}
	}
</style>
