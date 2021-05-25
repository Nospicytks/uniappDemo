<template>
	<view class="buyCardsindex">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" :text="text" />
		<view class="head">
			<div class="head-title">
				<span>{{carInfoData.car_number}}</span>
			</div>
			<div class="head-mess">
				<div>车主</div>
				<div>{{carInfoData.car_user_name?carInfoData.car_user_name:'未认证'}}</div>
				<div>状态</div>
				<div v-if="carInfoData.card.length > 0">包时卡车辆</div>
				<div v-else>非包时车辆</div>
			</div>
			<!-- 包时卡 -->
			<div class="head-list" v-for="(item,index) in carInfoData.card" :key="index">
				<div class="head-list-top">
					<div>{{item.park_name}}</div><div>有效期至</div>
				</div>
				<div class="head-list-bottom">
					<div>包时卡</div>
					<div>{{item.expire_date}}</div>
				</div>
			</div>
		</view>
		<!-- 选择省份 -->
		<view class="change">
			<div class="change-item">
				<div><span>选择省份</span></div>
				<div @click="changeSelector(1)">
					<span>{{selectorProvice?selectorProvice.name:val}}</span>
					<u-icon color="rgba(0,0,0,0.4)" name="arrow-right"></u-icon>
				</div>
			</div>
			<div class="change-item">
				<div><span>选择城市</span></div>
				<div @click="changeSelector(2)">
					<span>{{selectorCity?selectorCity.name:val2}}</span>
					<u-icon color="rgba(0,0,0,0.4)" name="arrow-right"></u-icon>
				</div>
			</div>
			<div class="change-item">
				<div><span>选择停车场</span></div>
				<div @click="changeSelector(3)">
					<span>{{selectorPark?selectorPark.name:val3}}</span>
					<u-icon color="rgba(0,0,0,0.4)" name="arrow-right"></u-icon>
				</div>
			</div>
			<div class="change-item">
				<div><span>选择办理类型</span></div>
				<div @click="changeSelector(4)">
					<span>{{selectorCard?selectorCard.card_base_name:val4}}</span>
					<u-icon color="rgba(0,0,0,0.4)" name="arrow-right"></u-icon>
				</div>
			</div>
			<!-- 选择数量 -->
			<div class="num">
				<div @click="changeCardNumberActive(0)" :class="CardNumberActive == 0?'CardNumberActive':''" class="num-item">
					1张
				</div>
				<div @click="changeCardNumberActive(1)" :class="CardNumberActive == 1?'CardNumberActive':''" class="num-item">
					2张
				</div>
				<div @click="changeCardNumberActive(2)" :class="CardNumberActive == 2?'CardNumberActive':''" class="num-item">
					3张
				</div>
				<div @click="changeCardNumberActive(3)" :class="CardNumberActive == 3?'CardNumberActive':''" class="num-item">
					<input class="num-item-input" type="text" v-model="CardNumber" placeholder="自定义" />
				</div>
			</div>
			<!-- 选择数量end -->
			<!-- 计算价格 -->
			<div class="price">
				<span>&yen;</span>
				<span>{{price}}</span>
			</div>
			<!-- 到期时间 -->
			<div class="enddate">
				<span>有效期</span>
				<span>{{expire_date}}</span>
			</div>
			<!-- 选择器 -->
			<u-picker mode="selector" 
			v-model="show"  
			:default-selector="[0]" 
			:range="selector"
			range-key="name"
			@confirm="confirm"></u-picker>
			<!-- 选择器end -->
		</view>
		<!-- 按钮 -->
		<view class="button" @click="activation">
			去支付
		</view>
		<view class="button" style="margin-bottom: 5%;margin-top: 5%;" @click="goback">
			返回首页
		</view>
	</view>
</template>

<script>
	import { carInfo,card,area,parkProvince,orderCard,calculation } from "@/pages/api/request.js"
	export default{
		data(){
			return {
				text:'loading...',
				isShow:false,
				car_number:'',
				show:false,
				val:'请选择',
				val2:'请选择',
				val3:'请选择',
				val4:'请选择',
				selectNumber:0,
				selector: [], //选择器数据
				selectorProvice: null, // 选择的省
				ProviceIndex:0,
				selectorCity: null, //选择的市
				CityIndex:0,
				parkData:null, // 停车场的数据
				selectorPark:null,
				ParkIndex:0,
				selectorCard:null,//选择的月卡
				CardIndex:0,
				CardData:[],//月卡
				CardNumber:'',
				CardNumberActive:0,
				price:0,
				expire_date:'',
				carInfoData:null, // 车的数据
				cityData:[], //原始数据
			}
		},
		onLoad(options) {
			this.car_number = options.carNumber
			
			this.getArea()
		},
		watch:{
			selectorCard:{
				handler(selectorCard){
					if(!this.selectorProvice || !this.selectorCity || !this.selectorPark || !this.selectorCard){
						return false
					}else{
						this.getPrice()
					}
				},
				deep:true
			},
			CardNumber:{
				handler(CardNumber){
					if(!this.selectorProvice || !this.selectorCity || !this.selectorPark || !this.selectorCard){
						return false
					}else{
						this.getPrice()
					}
				},
				deep:true
			},
			CardNumberActive:{
				handler(CardNumberActive){
					if(!this.selectorProvice || !this.selectorCity || !this.selectorPark || !this.selectorCard){
						
						return false
					}else{
						this.getPrice()
					}
				},
				deep:true
			},
			selectorPark:{
				handler(selectorPark){
					this.getCard()
				},
				deep:true
			},
			car_number:{
				handler(car_number){
					if(car_number !== ''){
						this.getCarInfo()
					}else{
						uni.showToast({
							title:'车辆信息获取失败!'
						})
						setTimeout(res=> {
							uni.navigateBack({
								delta:1
							})
						},500)
					}
				},
				deep:true
			}
		},
		methods: {
			// 返回
			goback(){
				uni.reLaunch({
					url:'../index'
				})
			},
			//去支付
			activation(){
				if(this.price == 0){
					uni.showToast({
						title:'请选择完整后支付',
					})
				}else{
					this.text = '下单中...'
					this.isShow = true
					let num = 0
					switch(this.CardNumberActive){
						case 0:
						num = 1;
						break;
						case 1:
						num = 2;
						break;
						case 2:
						num = 3;
						break;
						case 3:
						num = this.CardNumber
						break;
					}
					orderCard({
						park_id:this.selectorPark.park_id,
						car_id:this.carInfoData.car_id,
						card_id:this.selectorCard.card_id,
						num:num
					}).then(res => {
						if(res.data.code == 200){
							let params = {
								car_number:this.carInfoData.car_number,
								car_id:this.carInfoData.car_id,
								park_name:this.selectorPark.name,
								park_id:this.selectorPark.park_id,
								expire_date:this.expire_date,
								card_id:this.selectorCard.card_id,
								price:res.data.data.money,
								order_type:res.data.data.order_type,
								order_sn:res.data.data.order_sn,
								account:res.data.data.account,
								order_type:res.data.data.order_type
							}
							setTimeout(res => {
								this.isShow = false
								uni.navigateTo({
									url:'./orderSure?params=' + JSON.stringify(params) 
								})
							},500)
						}else{
							this.isShow = false
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					})
				}
			},
			checkData(){
				if(!self.selectorProvice){
					uni.showToast({
						title:'请选择省',
						icon:'none'
					})
					return false
				}else if (!self.selectorCity){
					uni.showToast({
						title:'请选择市',
						icon:'none'
					})
					return false
				}else if (!self.selectorPark){
					uni.showToast({
						title:'请选择停车场',
						icon:'none'
					})
					return false
				}else if (!self.selectorCard){
					uni.showToast({
						title:'请选择办理类型',
						icon:'none'
					})
					return false
				}
				return true
			},
			//确认
			confirm(e){
				if (this.selectNumber == 1){
					this.ProviceIndex = e
					this.selectorProvice = this.cityData[e]
				}else if (this.selectNumber == 2){
					this.CityIndex = e
					this.selectorCity = this.selector[e]
				}else if (this.selectNumber == 3){
					this.ParkIndex = e
					this.selectorPark = this.parkData[e]
				}else if(this.selectNumber == 4){
					this.CardIndex = e
					this.selectorCard = this.CardData[e]
				}
			},
			changeSelector(num){
				this.selectNumber = num
				// num == 1 省 2 市 3 停车场
				if (num == 1){
					this.selector = this.cityData
				    this.show = true
				}else if (num == 2){
					if (!this.selectorProvice){
						uni.showToast({
							title:'请选择省',
							icon:'none'
						})
						return
					}
					this.selector = this.cityData[this.ProviceIndex].sub
				    this.show = true
				}else if (num == 3){
					if (!this.selectorProvice){
						uni.showToast({
							title:'请选择市',
							icon:'none'
						})
						return
					}
					this.getParkProvince()
				}else if (num == 4){
					if (!this.selectorPark){
						uni.showToast({
							title:'请选择停车场',
							icon:'none'
						})
						return
					}
					this.getCard()
				}
			},
			getCarInfo(){
				var that = this
				that.isShow = true
				carInfo({
					car_number:this.car_number,
					}).then(res=>{
				that.isShow = false
					if (res.data.code === 200){
						that.carInfoData = res.data.data
					}
				})
			},
			getArea(){
				var that = this
				that.isShow = true
				area({}).then(res=>{
				that.isShow = false
					if (res.data.code === 200){
						that.cityData = res.data.data
					}
				})
			},
			getParkProvince(){
				var that = this
				that.isShow = true
				parkProvince({
					province_id:that.selectorProvice.id
				}).then(res=>{
				that.isShow = false
					if (res.data.code === 200){
						if(res.data.data.length > 0){
							that.parkData = res.data.data
							for (var item in that.parkData){
								that.parkData[item].name = that.parkData[item].park_name
							}
							that.selector = that.parkData
							that.show = true
						}else{
							that.selector = []
							uni.showToast({
								title:'当前市暂无停车场',
								duration: 2000
							})
						}
					}
				})
			},
			getCard(){
				var that = this
				that.selectNumber = 4
				that.selector = []
				that.isShow = true
				card({
					park_id:this.selectorPark.park_id
				}).then(res=>{
				if (res.data.code == 200){
					that.isShow = false
					if(res.data.data.length > 0){
						for(let i = 0;i<res.data.data.length;i++){
							that.CardData = res.data.data
							that.selector.push({
								name:res.data.data[i].card_base_name,
								card_id:res.data.data[i].card_id,
								is_buy_more:res.data.data[i].is_buy_more
							})
						}
						that.show = true
					}else{
						that.selector = []
						uni.showToast({
							title:'当前停车场暂无月卡',
							duration: 2000
						})
					}
				}
				})
			},
			changeCardNumberActive(num){
				this.CardNumberActive = num		
			},
			// 计算包时卡价格
			getPrice(){
				this.isShow = true
				let num = 0
				switch(this.CardNumberActive){
					case 0:
					num = 1;
					break;
					case 1:
					num = 2;
					break;
					case 2:
					num = 3;
					break;
					case 3:
					if(this.CardNumber !== ''){
						num = this.CardNumber
					}else{
						this.price = '请输入要购买的数量'
						this.expire_date = 'XXXX-XX-XX'
					}
					break;
				}
				calculation({
					park_id:this.selectorPark.park_id,
					car_id:this.carInfoData.car_id,
					card_id:this.selectorCard.card_id,
					num:num
				}).then(res => {
					if (res.data.code === 200){
						this.price = res.data.data.cost
						this.expire_date = res.data.data.expire_date
						this.isShow = false
					}
					this.isShow = false
				})
			}
		}
	}
</script>

<style lang="scss">
	.buyCardsindex{
		
		.head{
			 background: linear-gradient(rgb(88,126,253), rgb(55,88,243)); 
			 padding-top:8%;
			 padding-bottom:5%;
			 
			 .head-title{
				 font-size: 42rpx;
				 font-weight: bold;
				 color: #fff;
				  padding-left:5%;
				 span:nth-child(2){
					 margin-left: 2%;
				 }
			 }
			 
			 .head-mess{
				 color: #fff;
				 font-size: 24rpx;
				 display: flex;
				 margin-top:5%;
				 margin-bottom:8%;
				  padding-left:5%;
				 div:nth-child(2){
					margin-left: 5%;
					border-right:1px solid #fff;
					padding-right: 5%;
				 }
				 div:nth-child(3){
					margin-left: 5%;
				 }
				 div:nth-child(4){
				 	margin-left: 5%;
				 }
			 }
		}
		.head-list{
			width: 90%;
			margin: 0 auto;
			height: 100rpx;
			color: #fff;
			font-size: 24rpx;
			background-color: rgb(85,118,249);
			border-radius: 16rpx;
			margin-top: 3%;
			
			.head-list-top{
				display: flex;
				padding:0 5% 0 5%;
				div:nth-child(1){
					line-height: 50rpx;
					font-weight: bold;
					font-size: 28rpx;
				}
				div:nth-child(2){
					margin-left: auto;
					text-align: right;
					line-height: 50rpx;
				}
			}
			.head-list-bottom{
				display: flex;
				padding:0 5% 0 5%;
				div:nth-child(1){
					font-size: 22rpx;
					width: 20%;
					height: 40rpx;
					background-color: rgb(255,112,65);
					text-align: center;
					line-height: 35rpx;
					border-radius: 8rpx;
				}
				div:nth-child(2){
					margin-left: auto;
					text-align: right;
					line-height: 50rpx;
				}
			}
		}
		.change{
			width: 90%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 3%;
			padding-bottom:2%;
			
			.change-item{
					height: 100rpx;
					line-height: 100rpx;
					width: 90%;
					margin: 0 auto;
					border-bottom: 1px solid #e6e6e6;
					display: flex;
					
					div:nth-child(2){
						height: 100rpx;
						line-height: 100rpx;
						text-align: right;
						margin-left: auto;
					}
					.u-input{
						height: 70rpx;
						margin-top: 5%;
					}
			}
			.num{
				height: 70rpx;
				line-height: 70rpx;
				display: flex;
				justify-content: space-between;
				width: 90%;
				margin: 0 auto;
				margin-top: 8%;
				
				.num-item{
					width: 22%;
					text-align: center;
					color: #333;
					letter-spacing: 3rpx;
					border-radius:8rpx;
					border:1px solid #d6d6d6;
					
					.num-item-input{
						width: 100%;
						height: 100%;
					}
				}
				
				.CardNumberActive{
					color: #4061f6;
					background-color: rgb(209,213,253);
				}
			}
			
			.price{
				text-align: center;
				color: #ea1b23;
				margin-top: 8%;
				letter-spacing:4rpx;
				
				span:nth-child(1){
					font-size: 26rpx;
				}
				span:nth-child(2){
					font-size: 36rpx;
					font-weight: bold;
				}
			}
			.enddate{
				margin-top: 5%;
				text-align: center;
				color: #777777;
				
				span:nth-child(2){
					margin-left: 1.5%;
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
			margin-top: 20%;
			cursor: pointer;
		}
	}
</style>
