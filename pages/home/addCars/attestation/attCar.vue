<template>
	<view class="attCar">
		<!-- 加载动画 -->
		 <ourLoading isFullScreen :active="isShow" text="认证中..." />
		<!-- 车主姓名 -->
		<view class="personName">
			<div>车主姓名</div>
			<div><u-input v-model="userName" placeholder="请输入您的姓名"  type="text"  height="110"  :border="false" /></div>
		</view>
		<!-- 车牌号 -->
		<view class="carNum">
			<div class="carNum-history">
				<div>
					<span v-if="carSimilarArr !== 'undefind' && carSimilarArr.length !== 0">这是您的车吗?</span>
				</div>
				 <div class="scroll-X">
					<u-tag class="circle" @click="getNum(item)" v-for="(item, index) in carSimilarArr" :text="item" :key="index" shape="circle" bg-color="rgb(217,228,253)" />
				 </div>
				<!-- <u-tag class="circle" text="辽A.5ASR7" shape="circle" bg-color="rgb(217,228,253)" /> -->
			</div>
			<div class="carNum-input">
				<!-- 车牌号 -->
				<div>
					<view @click="plateShow = true"  
					style="width: 85%;height: 80rpx;line-height: 80rpx;border: 1px solid #d6d6d6;padding-left: 5%;margin-top: 2%;">
						{{plateNo}}
					</view>
					<!-- <u-input 
					placeholder="请输入车牌号" 
					style="input" height="90" 
					v-model="plateNo" 
					@click="plateShow = true"  
					:border="true"/> -->
				</div>
				<div class="carNum-input-button">
					<u-button @click.stop="plateNo = ''" type="primary">清空</u-button>
				</div>
				<plate-input :numType="active" :radioChange="radioChange" v-if="plateShow" :plate="plateNo" @export="setPlate" @close="plateShow = false" />
				<!-- 车牌号end -->
			</div>
		</view>
		<!-- 车牌号end -->
		<!-- 请选择车辆 -->
		<view class="classify" @click="show = true">
			<div>车辆类型</div>
			<div>{{plateType.name}}</div>
			<div>
				<u-icon name="arrow-right"></u-icon>
			</div>
		</view>
		<!-- 请选择车辆end -->
		<!-- 选择车辆的picker -->
		<u-picker mode="selector" 
		v-model="show"  
		:default-selector="[0]" 
		:range="carType" 
		range-key="name"
		@confirm="confirm">
		</u-picker>
		<!-- 选择车辆的pickerend -->
		<!-- 提示 -->
		<view class="mess">
			<div>上传本人车辆行驶证</div>
			<div>1.请上传车辆的行驶证照片</div>
			<div>2.拍照请确保行驶证边框完整,图像清晰,光线均匀</div>
		</view>
		<!-- 提示end -->
		<!-- 截取照片 -->
		<view style="display: flex;justify-content: space-around;background-color: #fff;padding-top: 3%;">
			<view class="photo">
				<!-- <v-ImgUpload :imgPath="avatar == ''?'../../../../static/components/noPic.png':avatar"></v-ImgUpload> -->
				<v-ImgUpload-Back buttonTitle="正面照片" @sendAvatar="getImgZ"></v-ImgUpload-Back>
			</view>
			<view class="photo">
				<v-ImgUpload-Back buttonTitle="反面照片"  @sendAvatar="getImgback"></v-ImgUpload-Back>
			</view>
		</view>
		<!-- 提示 -->
		<view class="bottom">	
			<span>可查看本车的敏感信息：停车记录,缴费记录,停车地点,停车时间,防止恶意绑定,保护个人隐私</span>
		</view>
		<!-- 按钮 -->
		<view @click="checkData()" class="button">
			提交并验证
		</view>
	</view>
</template>

<script>
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';
	import {carSimilar} from '@/pages/api/request.js'
	import {carCertification} from '@/pages/api/request.js'
	import "@/pages/api/http.js"
	export default{
		components: {
			plateInput,
		},	
		data(){
			return{
				show:false,
				fromBuy:false,
				isShow:false,
				plateNo:'',
				userName:'',
				plateType:{
					name:'请选择车辆类型',
					id:''
				},
				//1、小型汽车 2、小型新能源汽车 3、中、大型汽车 4、大型新能源汽车 5、教练汽车 6、使馆汽车 7、挂车
				plateShow: false,
				radioChange:false,
				active:0,
				avatar: '',
				avatarPath: '',
				backAvatar: '',
				backAvatarPath: '',
				carSimilarArr:[],
				// 组件
				getImg:'',
				getImgBack:'',
				carType:[
					{
						name:'小型汽车',
						id:'1'
					},
					{
						name:'小型新能源汽车',
						id:'2'
					},
					{
						name:'中、大型汽车',
						id:'3'
					},
					{
						name:'大型新能源汽车',
						id:'4'
					},
					{
						name:'教练汽车',
						id:'5'
					},
					{
						name:'使馆汽车',
						id:'6'
					},
					{
						name:'挂车',
						id:'7'
					}
				],
				userPhone:this.$store.state.login.userMobile
			}
		},
		onLoad(options) {
			this.plateNo = options.carNumber
			this.fromBuy = options.fromBuy
			this.getCarSimilar()
		},
		methods:{
			getNum(item){
				this.plateNo = item
			},
			//确认
			confirm(e){
				this.plateType = this.carType[e]
			},
			getImgZ(val){
				this.getImg = val
			},
			getImgback(val){
				this.getImgBack = val
			},
			getCarSimilar(){
				var that = this;
				carSimilar({}).then((res)=>{
					if (res.data.code == 200) {
						that.carSimilarArr = res.data.data
						console.log(that.carSimilarArr)
					}else{
						uni.showToast({
							title:res.data.msg,
							duration:2000
						})
					}
				})
			},
			setPlate(plate) {
				if (plate.length >= 7) this.plateNo = plate;
				this.plateShow = false;
			},
			uploadCarCertification(){
				var that = this;
				that.isShow = true
				carCertification({
						car_user_name:that.userName,
						car_number:that.plateNo,
						car_subdivision_type:that.plateType.id,
						drive_license:that.getImg,
						drive_license_back:that.getImgBack,
					}).then((res)=>{
					that.isShow = false
					if (res.data.code === 200){
						uni.showToast({
						    title: '认证成功',
						    duration: 2000
						});
						if (that.fromBuy){
							uni.reLaunch({
								url:'../../buyCards/index?carNumber=' + that.plateNo
							})
						}else{
							uni.reLaunch({
								url:'./attestation'
							})
						}
					}else{
						uni.showToast({
						    title: res.data.msg,
						    icon:"none"
						});
					}
					});
				
			},
			checkData(){
				if (this.userName == ''){
					uni.showToast({
					    title: '请输入您的姓名',
						icon:"none"
					});
					return false
				}else if (this.plateNo == ''){
					uni.showToast({
					    title: '请输入车牌号',
					    icon:"none"
					});
					return false
				}else if (this.getImg == ''){
					uni.showToast({
					    title: '请上传行驶证',
					    icon:"none"
					});
					return false
				}else if (this.getImgBack == ''){
					uni.showToast({
					    title: '请上传反面',
					    icon:"none"
					});
					return false
				}else if (this.plateType.id == ''){
					uni.showToast({
					    title: '请选择车辆类型',
					    icon:"none"
					});
					return false
				}else{
					this.uploadCarCertification()
				}
			}
		}
	}
</script>

<style lang="scss">
	.attCar{
		width: 90%;
		margin: 0 auto;
		
		.personName{
			height: 110rpx;
			background-color: #fff;
			margin-top: 5%;
			border-radius: 20rpx;
			display: flex;
			line-height: 110rpx;
			div:nth-child(1){
				padding-left: 5%;
			}
			div:nth-child(2){
				margin-left: 5%;
			}
		}
		.carNum{
			height: 300rpx;
			background-color: #fff;
			margin-top: 3%;
			border-radius: 20rpx;
			
			.carNum-history{
				height: 100rpx;
				line-height: 100rpx;
				padding-left: 5%;
				display:flex;
				
				.scroll-X{
					width:60%;
					overflow: auto;
					margin-left:5%;
					.circle{
						margin-left: 5%;
						width: 60rpx;
					}
				}
			}
			.carNum-input{
				height: 200rpx;
				display:flex;
				padding-top:7%;
				
				div{
					width: 60%;
					margin-left: 5%;
				}
				.carNum-input-button{
					width: 25%;
					margin-top: 1%;
				}
			}
		}
		.mess{
			height: 200rpx;
			margin-top: 3%;
			
			div{
				height: 65rpx;
				line-height: 65rpx;
				color: rgba(0,0,0,0.4);
				font-size: 25rpx;
			}
			div:nth-child(1){
				font-weight: bold;
				color: #333;
				font-size: 32rpx;
			}
		}
		.photo{
			height: 300rpx;
			background-color: #fff;
			width: 300rpx;
			
		}
		
		.bottom{
			width:90%;
			margin:0 auto;
			margin-top:5%;
			height:100rpx;
			color:rgba(0,0,0,0.4);
			margin-bottom: 5%;
		}
		.button{
			height: 80prpx;
			line-height: 80rpx;
			font-weight: bold;
			color: #fff;
			text-align: center;
			background-color: rgb(77,116,247);
			border-radius: 12rpx;
			cursor: pointer;
		}
		
		.classify{
			display: flex;
			border-radius: 20rpx;
			height: 110rpx;
			background-color: #fff;
			line-height: 110rpx;
			margin-top: 3%;
			margin-bottom: 4%;
			
			div:nth-child(1){
				padding-left: 5%;
			}
			div:nth-child(2){
				margin-left: 5%;
				color: #666666;
			}
			div:nth-child(3){
				margin-left: auto;
				padding-right: 5%;
				color: #d6d6d6;
			}
		}
	}
</style>
