<template>
	<view class="order">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" text="loading..." />
		 <div class="title">
		 	<u-icon style="cursor: pointer;" @click="goBack()" color="#333333" size="40" name="arrow-left"></u-icon>
		 </div>
		<!-- 订单信息 -->
		<view class="center">
			<div class="center-item">
				<div class="center-item-left">车牌号码</div>
				<div class="center-item-right">{{orderDetails.car_number}}</div>
			</div>
			<div class="center-item">
				<div class="center-item-left" style="width: 20%;">入场时间</div>
				<div class="center-item-right" style="width: 80%;text-align: right;">{{orderDetails.in_time}}</div>
				<!-- <div style="width: 20%;text-align: right;">12:12:12</div> -->
			</div>
			<div class="center-item">
				<div class="center-item-left">停车时长</div>
				<div class="center-item-right">
					<text style="color: red;">{{orderDetails.stop_time}}</text>
					<!-- <text>小时</text> -->
				</div>
			</div>
			<div class="center-item">
				<div class="center-item-left">停车费用</div>
				<div class="center-item-right">
					<text style="color: red;">{{orderDetails.total_money}}</text>
					<text>元</text>
				</div>
			</div>
			
			<!-- 车辆类型进行支付 -->
			<!-- 普通车 -->
			<view v-if="car_type == 4">
				<div class="center-item" @click="couponshow = true">
					<div class="center-item-left">我的优惠卷</div>
					<div class="center-item-right">
						<text>{{orderDetails.coupon_count}}</text>
						<!-- <text style="color: #d6d6d6;margin-left: 1%;">></text> -->
					</div>
				</div>
				<!-- 选择优惠卷 -->
				<u-popup v-model="couponshow"
				  :mask-close-able="false"
				  duration="300"
				   mode="bottom" 
				   border-radius="12" 
				   length="65%">
					<view class="changepay">
						<div>使用优惠卷</div>
						<div @click="couponshow = false">X</div>
					</view>
					<view style="height: 700rpx;">
					<scroll-view style="height: 100%;"  scroll-y>
							<div class="couponlist-box" v-for="(item,index) in orderDetails.coupon" :key="index">
								<div style="display: flex;">
									<div style="width: 5%;padding-top: 10%;">
										<checkbox  @click="selectItem(item.id,index)" :value="item.id"  :checked="item.checked" color="#FD6801"/>
									</div>
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
									</div>
									<div class="couponlist-item-b" :class="active != 0?'activeback':''">
										<div class="couponlist-item-b-child">
											<div class="couponlist-item-b-child-top">
												<div class="couponlist-item-b-child-top-left">
													<div>{{item.coupon_name}}</div>
													<div><text>{{item.effective_time}}</text><text>到期</text></div>
												</div>
												<div :class="index%2 == 0?'couponlist-item-b-child-top-right':'couponlist-item-b-child-top-right2'" >
													<!-- @click="isUse(item)" -->
													可用
												</div>
											</div>
											<div class="couponlist-item-b-child-bottom"></div>
										</div>
									</div>
								</div>
								<!-- 简介end -->
							</div>
							</div>
					</scroll-view>
					</view>
					<!-- <view class="couponButton" @click="noCoupon">不使用优惠卷</view> -->
				</u-popup>
				<!-- 选择优惠卷end -->
				<div class="center-item" @click="showMent">
					<div class="center-item-left" >
						<span>我的余额({{orderDetails.account}})</span>
					</div>
					<div class="center-item-right">
						<text>{{dadioTitle}}</text>
						<text style="color: #d6d6d6;margin-left: 1%;">></text>
					</div>
				</div>
				<!-- 选择支付方式 -->
				<u-popup v-model="show"
				  :mask-close-able="true"
				   mode="bottom" 
				   border-radius="12" 
				   length="35%">
					<view class="changepay">
						<div>请选择支付方式</div>
						<div @click="show = false">X</div>
					</view>
					<view class="change">
						<u-radio-group  :wrap='true'  v-model="dadioValue">
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
				<!-- 选择支付方式end -->	
			</view>
			<!-- 包时卡车 -->
			<view v-if="car_type == 3" class="center-item">
				<div class="center-item-left">包时卡到期时间</div>
				<div class="center-item-right">
					<text style="color: red;">{{orderDetails.expire_date}}</text>
				</div>
			</view>
			<!-- 包时卡车end -->
			<!-- 内部车与合作车 -->
			<view v-if="car_type == 1 || car_type == 2" class="center-item">
				<div class="center-item-left">{{car_type == 1?'内部车到期时间':'合作车到期时间'}}</div>
				<div class="center-item-right">
					<text style="color: red;">{{orderDetails.expire_date == 9999?'长期':orderDetails.expire_date}}</text>
				</div>
			</view>
			<!-- 内部车与合作车 -->
			<div class="allprice">
				<div>
					<text v-if="couponInId.length !== 0" v-for="(item,index) in couponInfoArr" :key="index">{{item}}</text>
					<text v-else>{{couponInfo}}</text>
				</div>
				<div>应缴金额</div>
				<div>
					<text style="color: red;">
						{{final_money == 0?orderDetails.pay_money:final_money}}
					</text>
					<text style="color: #d6d6d6;">元</text>
				</div>
			</div>
		</view>
		<!-- 订单信息end -->
		<!-- 确定按钮 -->
		<view class="surebutton" @click="paySuccess">确定</view>
		<!-- 确定按钮end -->
	</view>
</template>

<script>
	import coupon from '@/components/coupon/coupon.vue'
	import { orderDetails,pay,money } from '@/pages/api/request.js'
	export default {
			components:{
				coupon
			},
			data() {
				return {
				    isShow:false,//loading
					show: false,
					couponshow:false,
					orderSn:'',
					orderDetails:null,
					dadioValue:'',
					dadioTitle:'',
					couponInfo:'未使用优惠卷',
					couponInfoArr:[],
					couponInId:[],
					final_money:0,
					radioIndex: 0,
					change:0,
					radiotitle:'',
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
					car_type:'',
				}					
			},
			watch:{
				couponshow:{
					handler(couponshow){
						if(couponshow == false){
							this.couponMoney()
						}
					},
					deep:true
				},
				// couponInId:{
				// 	handler(couponInId){
				// 		if(couponInId.length == 0){
				// 			this.couponInfo = '未使用优惠卷'
				// 			this.couponshow = false
				// 		}else{
				// 			this.couponMoney()
				// 		}
				// 	},
				// 	deep:true,
				// 	immediate:true
				// },
				change:{
					handler(change){
						this.radiotitle = this.radiolist[change].name
					},
					deep:true,
					immediate:true
				},
				car_type:{
					handler(car_type){
					},
					deep:true,
					immediate:true
				}
			},
			computed:{
				isVip(){
					return this.$store.state.login.isVip;
				}
			},
			onLoad(options) {
				this.orderSn = options.orderSn
				this.getOrderDetails()
			},
			methods:{
				goBack(){
					uni.reLaunch({
						url:'../index'
					})
				},
				// 选中/取消
				selectItem(id,index){
					var that = this
					that.orderDetails.coupon[index].checked = !that.orderDetails.coupon[index].checked
				},
				noCoupon(){
					this.couponInId = []
					this.couponInfoArr = []
				},
				couponMoney(){
					let arr = []
					for(let i = 0;i<this.orderDetails.coupon.length;i++){
						if(this.orderDetails.coupon[i].checked == true){
							arr.push(this.orderDetails.coupon[i].id)
						}
					}
					let arrStr = arr.toString()
					
					money({
						order_sn:this.orderDetails.order_sn,
						couponIds:arrStr
					}).then(res => {
						if(res.data.code == 200){
							if(res.data.data){
								this.final_money = res.data.data.final_money
							}else{
								this.final_money = 0
							}
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}else{
							this.final_money = 0
							for(let i = 0;i<this.orderDetails.coupon.length;i++){
								this.orderDetails.coupon[i].checked = false
							}
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					})
				},
				isUse(item){
					let arr = item
					let ids =  []
					if(this.couponInId.indexOf(arr.id) == -1){
						this.couponInfoArr.push(arr.coupon_name)
						this.couponInId.push(arr.id)
					}else{
						uni.showToast({
							title:'已使用此兑换券!',
							icon:'none'
						})
					}
				},
				getPayMent(){
					this.dadioTitle = this.dadioValue
					this.show = false
				},
				showMent(){
					this.dadioValue = this.dadioTitle
					this.show = true
				},
				radioChange(index){
					this.change = index
				},
				paySuccess(){
					let arr = []
					for(let i = 0;i<this.orderDetails.coupon.length;i++){
						if(this.orderDetails.coupon[i].checked == true){
							arr.push(this.orderDetails.coupon[i].id)
						}
					}
					let arrStr = arr.toString()
					let pay_type;
					switch(this.car_type){
						case 1:
						pay_type = 7
						break;
						case 2:
						pay_type = 8
						break;
						case 3: 
						pay_type = 6
						break;
						case 4:
						if(this.dadioTitle == '微信支付'){
							if(arr.length == 0){
								pay_type = 1
							}else{
								if(Number(this.final_money) == 0){
									pay_type = 3
								}else{
									pay_type = 5
								}
							}
						}else{
							if(arr.length == 0){
								pay_type = 2
							}else{
								if(Number(this.final_money) == 0){
									pay_type = 3
								}else{
									pay_type = 4
								}
							}
						}
						break;
					}
					if(pay_type == 2){
						if (parseFloat(this.orderDetails.account) < parseFloat(this.orderDetails.pay_money)){
							uni.showToast({
								title:'余额不足!',
								icon:'none'
							})
							return false
						}
					}
					this.isShow = true
					pay({
						couponIds:arrStr,
						order_sn:this.orderSn,
						order_type:1,
						pay_type:pay_type
					}).then((res)=>{
						let arr = []
						for(let i = 0;i<this.orderDetails.coupon.length;i++){
							if(this.orderDetails.coupon[i].checked == true){
								arr.push(this.orderDetails.coupon[i].id)
							}
						}
						let arrStr = arr.toString()
						let final;
						if(arr.length == 0){
							final = this.orderDetails.pay_money
						}else{
							final = this.final_money
						}
						
						if(res.data.code == 200){
							
							if(pay_type == 1 || pay_type == 5){
								uni.requestPayment({
									'timeStamp': res.data.data.timeStamp,//为字符串，否则报错
									'nonceStr': res.data.data.nonceStr,
									'package': res.data.data.package,
									'signType': res.data.data.signType,
									'paySign': res.data.data.paySign,
									success: (res) => {
										setTimeout(res => {
											this.isShow = false
											this.$store.state.login.orderStatus = 0
											uni.removeStorageSync('temporaryCar')
											uni.reLaunch({
												url:'ordersuccess?total_money='+final
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
								uni.removeStorageSync('temporaryCar')
								this.$store.state.login.orderStatus = 0
								setTimeout(res => {
									this.isShow = false
									uni.reLaunch({
										url:'ordersuccess?total_money='+final
									})
								},1000)
							}
						
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
							this.isShow = false
						}
					})
				},
				// 订单详情
				getOrderDetails(){
					var that = this
					that.isShow = true;
					orderDetails({
						order_sn:this.orderSn,
					}).then((res)=>{
						that.isShow = false	
						if (res.data.code == 200) {
							that.orderDetails = res.data.data
							that.orderDetails.coupon_count = res.data.data.coupon.length > 0?('(' + res.data.data.coupon.length + ')' + '张优惠券可用'):'无可用优惠劵'
							if (parseFloat(res.data.data.account) < parseFloat(res.data.data.pay_money)){
								//无余额
								this.dadioValue = '微信支付'
								this.dadioTitle = '微信支付'
								// that.radioIndex = 1;
							}else{
								// that.radioIndex = 0;
								this.dadioValue = '余额支付'
								this.dadioTitle = '余额支付'
							}
							this.car_type = res.data.data.car_type
							var array = []
							res.data.data.coupon.map((item,index)=>{
								array.push(
									Object.assign(item,{checked:false})
								)
							})
							that.orderDetails.coupon = array
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					})
				},
			},
			created() {
				
			}
		}
</script>

<style lang="scss">
	.order{
		width: 90%;
		margin: 0 auto;
		padding-top: 15%;
		.center{
			background-color: #fff;
			height: 900rpx;
			margin-top: 3%;
			border-radius: 12rpx;
			
			.center-item{
				height: 100rpx;
				line-height: 100rpx;
				width: 95%;
				margin: 0 auto;
				border-bottom: 1px solid #e6e6e6;
				display: flex;
				font-size:28rpx;
				
				.center-item-left{
					margin-right: auto;
				}
				.center-item-right{
					// text-align: right;
					margin-left:auto;
				}
			}
			
			.allprice{
				text-align: center;
				
				div:nth-child(1){
					margin-top: 8%;
					color: #fa3534;
				}
				div:nth-child(2){
					margin-top: 5%;
					color: #333;
				}
				div:nth-child(3){
					margin-top: 5%;
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
			.couponlist-box{
				background-color: rgb(250,251,253);
				margin: 0 auto;
				margin-top: 3%;
				width:95%;
				
				
				.couponlist-item{
					width: 80%;
					margin-left: 5%;
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
							margin-left: 22%;
							margin-top: 10%;
						}
						div:nth-child(2){
							margin-left: 22%;
							margin-top: 10%;
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
					height: 200rpx;
					margin-top: 3%;
					color: rgba(0, 0, 0, 0.447058823529412);
					
					div{
						height: 40rpx;
						line-height: 40rpx;
						font-size: 26rpx;
						
						text:nth-child(2){
							margin-left: 3%;
						}
					}
				}
				.couponlist-info-hidden{
					animation-name: couponlistanima;
					animation-duration: 0.5s;
					animation-fill-mode:forwards;
				}
				@keyframes couponlistanima {
				  0%   { height:200rpx;}
				  10%  { height:180rpx;}
				  20%  { height:160rpx;}
				  30%  { height:140rpx;}
				  40%  { height:120rpx;}
				  50%  { height:100rpx;}
				  60%  { height:80rpxrpx;}
				  70% { height:60rpxrpx;}
				  80% { height:40rpx;}
				  90% { height:20rpx;}
				  100% { height:0rpx;visibility: hidden;opacity: 0;position: absolute;}
				}
				.couponlist-info-block{
					animation-name: couponlistanimabl;
					animation-duration: 0.5s;
					animation-fill-mode:forwards;
				}
				@keyframes couponlistanimabl {
				  0%   { height:0rpx;}
				  10%  { height:20rpx;}
				  20%  { height:40rpx;}
				  30%  { height:60rpx;}
				  40%  { height:80rpx;}
				  50%  { height:100rpx;}
				  60%  { height:120rpxrpx;}
				  70% { height:140rpxrpx;}
				  80% { height:160rpx;}
				  90% { height:180rpx;}
				  100% { height:200rpx;}
				}
			}
			.couponButton{
				height: 90rpx;
				line-height: 90rpx;
				color: #fff;
				width: 90%;
				margin: 0 auto;
				margin-bottom: 5%;
				text-align: center;
				background-color: #fa3534;
				border-radius: 50rpx;
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
		}
		
		.surebutton{
			margin: 0 auto;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			letter-spacing: 2rpx;
			background-color: rgb(77,116,247);
			border-radius: 8rpx;
			margin-top: 16%;
			cursor: pointer;
		}
	}
</style>
