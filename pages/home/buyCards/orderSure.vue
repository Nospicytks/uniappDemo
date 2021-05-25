<template>
	<view class="orderSure">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" :text="text" />
		<!-- 订单信息 -->
		<div class="orderSure-child">
		<div class="orderSure-item">
			<div><span>购卡车牌</span></div>
			<div>{{params.car_number}}</div>
		</div>
		<div class="orderSure-item">
			<div><span>可用停车场</span></div>
			<div>{{params.park_name}}</div>
		</div>
		<div class="orderSure-item">
			<div><span>购卡后有效期</span></div>
			<div>{{params.expire_date}}</div>
		</div>
		<div class="orderSure-item" @click="showMent">
			<div>
				<span>我的余额({{params.account}})</span>
			</div>
			<div>
				<span>{{dadioTitle}}</span>
				<text style="color: #d6d6d6;">></text>
			</div>
		</div>
		<div class="pay">
			应缴金额
		</div>
		<div class="price">
			<span>{{params.price}}</span>
			<span>元</span>
		</div>
		<!-- 选择支付方式 -->
		<u-popup v-model="show"
		  :mask-close-able="false"
		   mode="bottom" 
		   border-radius="12" 
		   length="35%">
			<view class="changepay">
				<div>请选择支付方式</div>
				<div @click="show = false">X</div>
			</view>
			<view class="change">
				<u-radio-group :wrap='true' v-model="dadioValue">
					<u-radio 
					class="radioclass"
						v-for="(item, index) in radiolist" :key="index" 
						:name="item.name"
						:disabled="item.disabled"
						>
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="change-button" @click="getPayMent">确定</view>
		</u-popup>
		</div>
		<!-- 选择支付方式end -->	
		<!-- 确定按钮 -->
		<view class="surebutton" @click="paySuccess">确认付款</view>
		<!-- 确定按钮end -->
	</view>
</template>

<script>
	import { pay } from '@/pages/api/request.js'
	export default{
		data(){
			return{
				isShow:false,
				text:'支付中...',
				radiolist: [
					{
						name: '余额支付',
						disabled: false
					},
					{
						name: '微信支付',
						disabled: false
					}
				],
				dadioValue:'余额支付',
				dadioTitle:'余额支付',
				show: false,
				params:{}
			}
		},
		watch:{
			
		},
		methods:{
			// 确认付款
			paySuccess(){
				let pay_type;
				switch(this.dadioTitle){
					case '余额支付':
					pay_type = 2
					break;
					case '微信支付':
					pay_type = 1
					break;
				}
				if(pay_type == 2){
					if (parseFloat(this.params.account) < parseFloat(this.params.price)){
						uni.showToast({
							title:'余额不足!',
							icon:'none'
						})
						return false
					}
				}
				this.isShow = true
				pay({
					order_sn:this.params.order_sn,
					order_type:this.params.order_type,
					pay_type:pay_type
				}).then((res)=>{
					if(res.data.code == 200){
						if(pay_type == 1){
							uni.requestPayment({
								'timeStamp': res.data.data.timeStamp,//为字符串，否则报错
								'nonceStr': res.data.data.nonceStr,
								'package': res.data.data.package,
								'signType': res.data.data.signType,
								'paySign': res.data.data.paySign,
								success: (res) => {
									setTimeout(res => {
										this.isShow = false
										uni.reLaunch({
											url:'./carordersuccess?total_money='+this.params.price
										})
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
							setTimeout(res => {
								this.isShow = false
								uni.reLaunch({
									url:'./carordersuccess?total_money='+this.params.price
								})
							},1000)
						}
						
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			getPayMent(){
				this.dadioTitle = this.dadioValue
				this.show = false
			},
			showMent(){
				this.dadioValue = this.dadioTitle
				this.show = true
			}
		},
		onLoad(option) {
			this.params = JSON.parse(option.params)
			console.log(JSON.parse(option.params))
		}
	}
</script>

<style lang="scss">
	.orderSure{
		
		
		.orderSure-child{
			width: 90%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 3%;
			padding-bottom:10%;
		
		.orderSure-item{
			width: 95%;
			margin: 0 auto;
			height: 100rpx;
			line-height: 100rpx;
			border-bottom: 1px solid #e6e6e6;
			display: flex;
			
			div:nth-child(1){
				margin-right: auto;
			}
			div:nth-child(2){
				text-align: right;
				margin-left: auto;
				color: #777777;
			}
		}
		.changepay{
			height: 90rpx;
			width: 90%;
			margin: 0 auto;
			font-weight: bold;
			line-height: 90rpx;
			display: flex;
			font-size: 30rpx;
			color: #333;
			
			div:nth-child(1){
				width: 93%;
			}
			div:nth-child(2){
				width: 7%;
				background-color: rgb(236,236,236);
				color: rgba(0, 0, 0, 0.447058823529412);
				border-radius: 50%;
				height: 47rpx;
				margin-top: 3%;
				text-align: center;
				line-height: 47rpx;
				font-size: 22rpx;
				cursor: pointer;
			}
		}
		.change{
			height: 200rpx;
			width: 100%;
			padding-left: 5%;
			
			.radioclass{
				margin-top: 5%;
			}
		}
		.change-button{
			width: 90%;
			height: 85rpx;
			border-radius: 39rpx;
			margin: 0 auto;
			background-color: rgb(77,116,247);
			text-align: center;
			color: #fff;
			letter-spacing: 4rpx;
			line-height: 85rpx;
			font-size: 32rpx;
			font-weight: bold;
			margin-top: 5%;
			cursor: pointer;
		}
		.pay{
			text-align: center;
			margin-top: 15%;
			letter-spacing: 2rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
		}
		.price{
			text-align: center;
			margin-top: 3%;
			
			span:nth-child(1){
				color: red;
				font-size: 52rpx;
			}
			span:nth-child(2){
				color: rgba(0,0,0,0.4);
				font-size: 25rpx;
			}
		}
		}
		.surebutton{
			width: 90%;
			margin: 0 auto;
			margin: 0 auto;
			height: 85rpx;
			line-height: 85rpx;
			text-align: center;
			color: #fff;
			letter-spacing: 2rpx;
			background-color: rgb(77,116,247);
			border-radius: 8rpx;
			margin-top: 50%;
			cursor: pointer;
		}
	}
</style>
