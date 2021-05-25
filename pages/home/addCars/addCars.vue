<template>
	<view class="addCars">
			<ourLoading isFullScreen :active="isShow" text="loading..." />
		<!-- 选择类型 -->
		<view class="head">
			<div :class="active=== index?'ative':''" 
			@click="change(index)" 
			v-for="(item,index) in titleList" 
			:key="index" 
			class="head-item"
			>
				{{item}}
			</div>
		</view>
		<!-- 选择类型end -->
		<!-- 车牌号 -->
		<view class="num" v-if="active == 0">
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(0,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(1,1)}}</view>
			<view class="num-item">·</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(2,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(3,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(4,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(5,1)}}</view>	
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(6,1)}}</view>
			<plate-input :radioChange="radioChange" :numType="active" v-if="plateShow" :plate="plateNo" @export="setPlate" @close="plateShow = false" />
		</view>
		<view class="num" v-else>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(0,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(1,1)}}</view>
			<view class="num-item">·</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(2,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(3,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(4,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(5,1)}}</view>	
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(6,1)}}</view>
			<view class="num-item" @tap="plateShow = true">{{plateNo.substr(7,1)}}</view>
			<plate-input :radioChange="radioChange" :numType="active" v-if="plateShow" :plate="plateNo" @export="setPlate" @close="plateShow = false" />
		</view>
		<!-- 车牌号end -->
		<!-- 添加 -->
		<view class="add" @click="addCar"><text>确认添加</text></view>
		<!-- 历史车辆 -->
		<view class="history">
			<div v-if="historyList.length !== 0">历史车辆</div>
			<div class="history-list">
				<div v-for="(item,index) in historyList" :key="index" class="history-item">
					<div @click='historyClick(item)'>{{item}}</div>
					<!-- <div @click="deleteNum(item)">X</div> -->
				</div>
			</div>
		</view>
		<!-- 认证车辆  <div @click="deleteNum(index)">X</div>-->
		<view class="history">
			<div v-if="numList.length !== 0">认证车辆</div>
			<div class="history-list">
				<div v-for="(item,index) in numList" :key="index" class="history-item">
					<div @click='historyClick(item)'>{{item}}</div>
				</div>
			</div>
		</view>
	</view>
</template>

<script>
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';
	import {addCar,config,car} from '@/pages/api/request.js'
	export default {
		components: {
			plateInput
		},
		data() {
			return {
				fromBuy:false,
				isShow:false,
				plateNo: '',
				plateShow: false,
				inputDisabled: true,
				radioChange:true,
				active:0,
				titleList:['普通牌照','新能源'],
				historyList:[],
				numList:[
				]
			}
		},
		onLoad(options) {
			console.log('1')
		 this.carHistory()	
		 this.fromBuy = options.fromBuy
		},
		methods:{
			deleteNum(item){
				var index = this.historyList.indexOf(item)
				if (index !== -1) {
				  this.historyList.splice(index, 1)
				}
			},
			historyClick(plate){
				this.plateNo = plate;
				if (plate.length >= 8) {
					this.active = 1
				}else{
					this.active = 0
				}
				this.plateShow = false;
			},
			setPlate(plate) {
				console.log(plate,'setPlate')
				if (plate.length >= 7) this.plateNo = plate;
				this.plateShow = false;
			},
			change(index){
				console.log(index,'change')
				this.active = index
				this.plateNo = ''
			},
			addCar(){
				var that = this;
				that.isShow = true;
				addCar({
					car_number:that.plateNo,
					car_type:that.active + 1 //车辆类型 1=>普通车辆 2=>新能源
				}).then((res)=>{
					that.isShow = false	
					if (res.data.code == 200) {
						
						uni.setStorageSync('temporaryCar',that.plateNo)
						
						this.$store.state.login.carNum = that.plateNo
						//1已认证2未认证
						if (res.data.data.is_certification == 2){
							config({})
								.then(fun =>{
									if(fun.data.code == 200){
										if(fun.data.data.car_certification_remind == 1){
											that.addSure(fun.data.data.car_authentication_introduction)
										}else{
											uni.reLaunch({
												url:'../index'
											})
										}
									}
								})
						}else{
							if (!that.fromBuy){
								// 用户已认证
								uni.reLaunch({
									url:'../index'
								})
							}else{
								uni.navigateTo({
									url:'../buyCards/index?fromBuy=' + that.fromBuy + '&carNumber=' + that.plateNo
								})
							}
						}
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			carHistory(){
				var that = this;
				that.isShow = true;
				car({}).then((res)=>{
					that.isShow = false	
					if (res.data.code == 200) {
						that.historyList = res.data.data.history
						that.numList = res.data.data.certification
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			// 确认认证
			addSure(msg){
				var that = this
				uni.showModal({
				    title:"认证提醒",
				    content:msg.replace(/<\/?.+?>/g,""),
				    showCancel:true,
				    cancelText:'暂不考虑',
				    confirmText:'去认证',
					cancelColor:'#333',
					confirmColor:'#FF6365',
				    success:res=>{
				        if(res.confirm){
							// url:'./attestation/attCar?carNumber=' + this.plateNo
				            // 用户点击确定
							uni.navigateTo({
								url:'./attestation/attCar?carNumber=' + that.plateNo + '&fromBuy=' + that.fromBuy
							})
				        }else{
				            // 点击了取消  
							if (!that.fromBuy){
								uni.reLaunch({
									url:'../index'
								})
							}else{
								uni.navigateTo({
									url:'../buyCards/index?carNumber=' + that.plateNo
								})
							}
				        }
				    }
				})
			}	
		}
	}
</script>

<style lang="scss">
	.addCars{
		
		.head{
			width: 60%;
			margin: 0 auto;
			height: 80rpx;
			background-color: #fff;
			border-radius: 49rpx;
			margin-top: 10%;
			display:flex;
			padding-left:2%;
			
			text-align: center;
			
			.head-item{
				width: 46%;
				border-radius: 49rpx;
				height: 60rpx;
				line-height: 60rpx;
				margin-top: 10rpx;
				font-size: 30rpx;
				color: rgba(0, 0, 0, 0.447058823529412);
				cursor: pointer;
			}
			.head-item:nth-child(2){
				margin-left: 4%;
			}
			.ative{
				background-color: rgb(107,134,249);
				color: #fff;
			}
		}
		.num{
			width: 90%;
			height: 100rpx;
			margin: 0 auto;
			margin-top: 20%;
			display: flex;
			
			.num-item{
				width: 9%;
				margin-left: 1%;
				border: 1px solid #d6d6d6;
				border-radius:8rpx;
				line-height: 100rpx;
				text-align: center;
			}
			.num-item:nth-child(3){
				border: none;
			}
			// .cu-form-group {
			// 	border-top: 1px solid #eee;
			// 	border-bottom: 1px solid #eee;
			// 	background-color: #ffffff;
			// 	padding: 1upx 30upx;
			// 	display: -webkit-box;
			// 	display: -webkit-flex;
			// 	display: -ms-flexbox;
			// 	display: flex;
			// 	align-items: center;
			// 	min-height: 100upx;
			// 	justify-content: space-between;
			// }
		}
		.add{
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			background-color: rgb(77,116,274);
			color: #fff;
			margin: 0 auto;
			font-size: 30rpx;
			font-weight: 600;
			margin-top: 20%;
		}
		
		.history{
			width: 90%;
			margin: 0 auto;
			margin-top: 10%;
			
			div:nth-child(1){
				font-weight: bold;
				letter-spacing: 2px;
			}
			.history-list{
				display: flex;
				flex-wrap: wrap;
			}
			.history-item{
				width: 32%;
				height: 55rpx;
				line-height: 55rpx;
				background-color: rgb(208,222,249);
				border-radius: 30rpx;
				color: rgb(58,137,255);
				font-size: 21rpx;
				margin-left:1.2%;
				margin-top: 3%;
				
				div:nth-child(1){
					text-align: center;
					white-space: nowrap;
				}
				div:nth-child(2){
					width: 17%;
					height: 35rpx;
					line-height: 35rpx;
					background-color: #fff;
					border-radius: 50%;
					margin-top: 10rpx;
					text-align: center;
					font-size: 20rpx;
					color: rgba(0, 0, 0, 0.447058823529412);
					padding-left: 1.5%;
				}
			}
		}
	}
</style>
