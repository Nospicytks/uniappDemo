<template>
	<view class="attestation">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" text="loading..." />
		<!-- 提示 -->
		<view class="noList" v-if="scrollList.length == 0">
			<image :src="noList" mode=""></image>
		</view>
		<!-- 认证列表 -->
		<view v-else class="attestation-box">
			<scroll-view class="scroll-view" scroll-y>
				<view class="item" v-for="(item,index) in scrollList" :key="index">
					<div class="item-box">
						<!-- 头部信息 -->
						<div class="item-head">
							<div class="item-head-a"><span>{{item.car_number.slice(0,2)}}</span><span>{{item.car_number.slice(2,item.car_number.length)}}</span></div>
							<div class="item-head-b">
								<div v-if="item.card.length > 0">包时卡车辆</div>
								<div v-else>非包时车辆</div>
								<div style="width: 50rpx;height: 25rpx;line-height: 25rpx;font-size: 18rpx;margin-top: 2.5%;border-radius: 5rpx;" v-if="item.card.length > 0">
									<text>V</text>
									<text style="font-style:oblique;">IP</text>
								</div>
							</div>
						</div>
						<!-- 头部信息end -->
						<!-- 包时卡 -->
						<div>
							<div :class="{ 'item-cards-a':indexC%2 == 0, 'item-cards-b':indexC%3 == 0}"
							 v-for="(itemC,indexC) in item.card"
							  :key="indexC" 
							  class="item-cards">
								<div style="width: 40%;white-space: normal; overflow: hidden;text-overflow: ellipsis;">{{itemC.park_name}}</div>
								<div>包时卡</div>
								<div><span>有效期至</span><span>{{itemC.expire_date}}</span></div>
							</div>
						</div>
						<!-- 包时卡end -->
						<!-- 认证车主 -->
						<div class="item-person">
							<span>认证车主</span>
							<span>{{item.car_user_name}}</span>
						</div>
						<!-- 认证车主end -->
						<!-- 下方按钮 -->
						<div class="item-button">
							<div @click="deleteAttCar(item)">车辆解绑</div>
							<div v-if="item.card.length > 0" @click="goBuyCar(item)">包时卡续费</div>	
							<div v-else @click="goBuyCar(item)">包时卡办理</div>	
						</div>
						<!-- 下方按钮end -->
					</div>
				</view>
			</scroll-view>	
		</view>
		<!-- 认证列表end -->
		<!-- 按钮 -->
		<view class="bottom" @click="goAttCar">车辆认证</view>
	</view>
</template>

<script>
	import { carList } from '@/pages/api/request.js'
	import { carRelieve } from '@/pages/api/request.js'
	export default{
		
		data(){
			return{
				scrollList:[],
				selectCarId:'',
				isShow:true,
				noList:this.$store.state.login.url+'/static/mini/static/home/noList.png'
			}
		},
		created() {
			this.getCarList()	
		},
		watch:{
			scrollList:{
				handler(scrollList){
					this.isShow = false
				},
				deep:true
			},
		},
		methods:{
			deleteAttCar(item){
				this.selectCarId = item.car_id
				this.addSure()
			},
			goBuyCar(item){
				uni.navigateTo({
					url:'/pages/home/buyCards/index?carNumber=' + item.car_number
				})
			},
			goAttCar(){
				uni.navigateTo({
					url:'./attCar'
				})
			},
			getCarList(){
				var that = this
				carList({}).then(res =>{
					if (res.data.code == 200){
						that.scrollList = res.data.data
					}
				})
			},
			addSure(car_id){
				var that = this
				uni.showModal({
				    title:"您即将于该车辆解除绑定关系",
				    content:"解除绑定关系后，您将无法查看所有与该车辆有关信息，请谨慎操作！",
				    showCancel:true,
				    cancelText:'取消',
				    confirmText:'确定',
					cancelColor:'#333',
					confirmColor:'#FF6365',
				    success:res=>{
				        if(res.confirm){
				            that.setCarRelieve()
				        }
				    }
				})
			},
			setCarRelieve(){
				carRelieve({
					car_id:this.selectCarId
				}).then(res=>{
					if (res.data.code === 200){
						this.getCarList()
					}
					uni.showToast({
						title:res.data.msg,
						duration:2000
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.attestation{
		width: 90%;
		margin: 0 auto;
		
		.noList{
			width: 100%;
			height: 85vh;
			text-align: center;
			padding-top:40%;
			
			image{
				width: 65%;
				height: 250rpx;
			}
		}
		
		.attestation-box{
			height: 85vh;
			
			.scroll-view{
				height: 100%;
				width: 100%;
				.item{
					margin: 0 auto;
					background-color: #fff;
					margin-top:5%;
					border-radius:24rpx;
					
					.item-box{
						width: 90%;
						margin: 0 auto;
						
						.item-head{
							display: flex;
							height: 70rpx;
							line-height: 70rpx;
							
							.item-head-a{
								color: #333;
								font-weight: bold;
								font-size: 32rpx;
								width:60%;
								
								span:nth-child(2){
									margin-left: 5%;
								}
							}
							.item-head-b{
								color: rgba(0,0,0,0.4);
								font-size: 26rpx;
								display: flex;
								height:40rpx;
								line-height:40rpx;
								padding-top:2%;
								margin-left:auto;
								
								div:nth-child(1){
									width: 160rpx;
								}
								
								div:nth-child(2){
									width: 40%;
									height: 40rpx;
									border-radius: 8rpx;
									text-align: center;
									color: #fff;
									margin-left: 5%;
									background-color: rgb(250,177,81);
									// background: -webkit-linear-gradient(right,rgb(244,157,43), rgb(242,155,41)); /* Safari 5.1 - 6.0 */
									// background: -o-linear-gradient(right,rgb(244,157,43), rgb(242,155,41)); /* Opera 11.1 - 12.0 */
									// background: -moz-linear-gradient(right,rgb(244,157,43), rgb(242,155,41)); /* Firefox 3.6 - 15 */
									// background: linear-gradient(right,rgb(244,157,43), rgb(242,155,41)); /* 标准的语法（必须放在最后） */
								}
							}
						}
						.item-cards{
							height: 90rpx;
							background-color: rgb(45,194,234);
							margin-top: 2%;
							border-radius: 8rpx;
							color: #fff;
							display:flex;
							padding-right:3%;
							
							div{
								height: 40rpx;
								line-height: 40rpx;
								margin-top: 4%;
								white-space: normal;
								overflow: hidden;
								text-overflow: ellipsis;
							}
							div:nth-child(1){
								font-size: 26rpx;
								padding-left: 5%;
							}
							div:nth-child(2){
								font-size: 23rpx;
								padding-left: 2%;
								padding-right: 2%;
								text-align: center;
								border-radius: 6rpx;
								background-color: rgb(255,145,110);
								height: 35rpx;
								line-height: 35rpx;
								margin-top: 4.8%;
								margin-left: 2%;
							}
							div:nth-child(3){
								font-size: 26rpx;
								text-align: right;
								margin-left: auto;
							}
						}
						.item-cards-a{
							background-color:  rgb(255,180,156);
						}
						.item-cards-b{
							background-color: rgb(72,221,191);
						}
						
						.item-person{
							height: 120rpx;
							line-height: 120rpx;
							border-bottom: 1px solid #f5f5f5;
							
							span:nth-child(1){
								color: rgba(0,0,0,0.4);
							}
							span:nth-child(2){
								float: right;
								font-weight: bold;
							}
						}
						.item-button{
							height: 120rpx;
							display: flex;
							
							div{
								height: 60rpx;
								line-height: 60rpx;
								font-size: 24rpx;
								text-align: center;
								border-radius: 30rpx;
								line-height: 48rpx;
								width: 27%;
								border: 1px solid #d6d6d6;
								margin-top: 5%;
								cursor: pointer;
							}
							div:nth-child(1){
								margin-left: 40%;
								color: rgba(0,0,0,0.4);
							}
							div:nth-child(2){
								color: #fff;
								background-color: rgb(77,116,247);
								margin-left: 5%;
							}
						}
					}
				}
			}
		}
		.bottom{
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			font-size: 30rpx;
			background-color: rgb(77,116,247);
			border-radius: 12rpx;
			margin-top: 10%;
		}
	}
</style>
