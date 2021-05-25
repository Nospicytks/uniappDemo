<template>
	<view class="myselfindex">
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<view class="top">
			<div class="topmess">
				<div class="topmess-left">
					<u-avatar size="130" :src="src"></u-avatar>
				</div>
				<div class="topmess-right">
					<div>{{wxname}}</div>
					<!-- <div class="topmess-right-on" v-if="">
						<div><image :src="rzPath" mode=""></image></div>
						<div>已进行实名认证</div>
					</div> -->
					<!-- 已实名认证end -->
					<!-- 未实名认证 -->
					<div :class="currUserInfo.is_certification == 1?'topmess-right-on':'topmess-right-off'" @click="GOAuthenticate()">
						<div><image :src="currUserInfo.is_certification == 1?rzPath:norzPath" mode=""></image></div>
						<div>{{currUserInfo.is_certification == 1?'已进行实名认证':'去实名认证'}}</div>
					</div>
					<!-- 未实名认证end -->
				</div>
			</div>
		</view>
		<!-- 悬浮框 -->
		<view class="box">
			<div v-for="(item,index) in boxList" :key="index" class="box-item">
				<div @click.stop="goMember(index)">{{item.title}}</div>
				<div>{{item.price}}</div>
				<div @click.stop="goActive(index)" :style="{'background-color':item.color1}">
					<div></div>
					<div :style="{'background-color':item.color2}">
						<image :class="index == 1?'bigimg':'small'" :src="item.imgPath" mode=""></image>
					</div>
					<div  :style="{'background-color':item.color3}">{{item.message}}
						<u-icon  name="arrow-right"></u-icon>
					</div>
				</div>
			</div>
		</view>
		<!-- 菜单 -->
		<view class="menulist">
			<div :style="{'border':index == menuList.length-1?'none':''}"
			@click.stop="showPath(index)" 
			v-for="(item,index) in menuList" :key="index" 
			class="menulist-item">
				<div>
					<image :src="item.imgPath" mode=""></image>
				</div>
				<div>{{item.title}}</div>
				<div>
					<div :class="item.title == '系统消息'?'xtxx':''">{{item.title == '系统消息'?currUserInfo.msg_num:''}}</div>
					<div>
						<u-icon name="arrow-right"></u-icon>
					</div>
				</div>
			</div>
		</view>
		<!-- 开发中 -->
		<u-mask :show="showdev">
			<v-dev @close="updateShowdev"></v-dev>
		</u-mask>	
		<tab-bar :current-page="2"></tab-bar> 
	</view>
</template>

<script>
	import { userInfo,signInfo,info } from '@/pages/api/request.js'
	export default{
		data(){
			return{
				isShow:false,
				rzPath:this.$store.state.login.url+'/static/mini/static/myself/renzheng.png',
				norzPath:this.$store.state.login.url+'/static/mini/static/myself/norenzheng.png',
				src:'',
				// this.$store.state.login.url+'/static/mini/static/home/ordersuccess.png'
				showdev:false,
				currUserInfo:null,
				wxname:'微信用户',
				boxList:[
					{
						price:'0.00',
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/qiandao.png',
						message:'签到',
						title:'余额',
						color1:'rgb(255,238,222)',
						color2:'rgb(255,201,131)',
						color3:'rgb(255,153,0)'
					},
					{
						price:'0',
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/choujiang.png',
						message:'转盘抽奖',
						title:'积分',
						color1:'rgb(252,242,240)',
						color2:'rgb(254,138,154)',
						color3:'rgb(255,84,10)'
					},
					{
						price:'0',
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/tuijian.png',
						message:'推荐有奖',
						title:'优惠卷',
						color1:'rgb(233,246,255)',
						color2:'rgb(106,187,255)',
						color3:'rgb(0,122,255)'
					}
				],
				menuList:[
					{
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/menu1.png',
						title:'错时共享'
					},
					{
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/menu2.png',
						title:'我的爱车'
					},
					{
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/menu3.png',
						title:'消费记录'
					},
					{
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/menu4.png',
						title:'意见反馈'
					},
					{
						imgPath:this.$store.state.login.url+'/static/mini/static/myself/menu5.png',
						title:'系统消息',
						info:'1'
					}
				],
				avatarUrl:uni.getStorageSync('avatarUrl'),
				nickName:uni.getStorageSync('nickName'),
				userMobile:uni.getStorageSync('userMobile'),
				isphone:false,
				authenticate:this.$store.state.login.authenticate
			}
		},
		created() {
			
		},
		onLoad() {
			// var that = this
			// uni.$on('update_list',(res)=>{
			// 	that.getUserInfo()
			// })
		},
		onUnload() {
			// uni.$off('update_list'); 
		},
		watch:{
			token:{
			    handler(token){
			      if(token !== '' && token !== null){
						this.getUserInfo()
					}
			    },
			    deep: true,
			    immediate: true,
			},
			avatarUrl:{
				handler(avatarUrl){
					if(avatarUrl){
						this.src = avatarUrl
					}
				},
				deep:true,
				immediate:true
			},
			nickName:{
				handler(nickName){
					if(nickName){
						this.wxname = nickName
					}
				},
				deep:true,
				immediate:true
			},
			userMobile:{
				handler(userMobile){
					if(userMobile){
						this.isphone = true
					}else{
						this.isphone = false
					}
				},
				deep:true,
				immediate:true
			},
		},
		computed:{
			token:{
				get(){
					return this.$store.state.login.token
				},
				set(val){
					this.$store.state.login.token = val
				}
			},
		},
		methods:{
			getUserInfo(){
				let that = this;
				that.isShow = true
				userInfo({}).then((res)=>{
					if (res.data.code == 200) {
						that.currUserInfo = res.data.data	
						if(that.currUserInfo.is_certification == 1){
							that.$store.state.login.authenticate = true
						}else{
							that.$store.state.login.authenticate = false
						}
						let arr = [that.currUserInfo.account?that.currUserInfo.account:'0.00',that.currUserInfo.points?that.currUserInfo.points:'0',that.currUserInfo.coupon_num];
						for(var index in arr){
							let item = that.boxList[index];
							item.price = arr[index] + ''
						}
						that.isShow = false	
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
						that.isShow = false	
					}
				})
			},
			updateShowdev(val){
				this.showdev = val
			},
			showPath(index){
				if(this.isphone == false){
					uni.reLaunch({
						url:'../login/index'
					})
				}else{
					switch (index){
						case 0:
						this.showdev = true;
						break;
						case 1:
						uni.navigateTo({
							url:'/pages/home/addCars/attestation/attestation'
						})
						break;
						case 2:
						uni.navigateTo({
							url:'/pages/myself/history/history'
						})
						break;
						case 3:
						uni.navigateTo({
							url:'/pages/myself/opinion/opinion'
						})
						break;
						case 4:
						uni.navigateTo({
							url:'/pages/myself/messages/messages'
						})
						break;
					}
				}
			},
			goActive(index){
				if(this.isphone == false){
					uni.reLaunch({
						url:'../login/index'
					})
				}else{
				switch (index){
					case 0:
					uni.navigateTo({
						url:'/pages/myself/register/register'
					})
					// signInfo({})
					// 	.then(res =>{
					// 		if(res.data.code == 200){
					// 			if(res.data.data.content == ""){
					// 				uni.showToast({
					// 					title:'暂无签到活动',
					// 					icon:'none'
					// 				})
					// 				return false
					// 			}else{
					// 				uni.navigateTo({
					// 					url:'/pages/myself/register/register'
					// 				})
					// 			}
					// 		}
					// 	})
					break;
					case 1:
					info({})
						.then(res =>{
							if(res.data.code == 200){
								if(res.data.data.lottery == null){
									uni.showToast({
										title:'暂无抽奖活动',
										icon:'none'
									})
									return false
								}else{
									uni.navigateTo({
										url:'/pages/myself/game/game'
									})
								}
							}
						})
					break;
					case 2:
					uni.navigateTo({
						url:'/pages/myself/share/share'
					})
					break;
				}
				}
			},
			goMember(index){
				if(this.isphone == false){
					uni.reLaunch({
						url:'../login/index'
					})
				}else{
				switch (index){
					case 0:
					uni.navigateTo({
						url:'/pages/myself/account/account'
					})
					break;
					case 1:
					uni.navigateTo({
						url:'/pages/myself/integral/integralHistory'
					})
					break;
					case 2:
					uni.navigateTo({
						url:'/pages/myself/couponpage/couponpage'
					})
					break;
				}
				}
			},
			GOAuthenticate(){
				if(this.currUserInfo.is_certification !== 1){
					if(this.isphone == false){
						uni.reLaunch({
							url:'../login/index'
						})
					}else{
						uni.navigateTo({
							url:'/pages/myself/GOAuthenticate/GOAuthenticate'
						})
					}
				}else{
					return false
				}
			
			}
		}
	}
	
 </script>

<style lang="scss">
	.myselfindex{
		.top{
			width: 100%;
			height: 400rpx;
			background: -webkit-linear-gradient(right,rgb(39,106,249),rgb(79,133,255)); /* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(right,rgb(39,106,249),rgb(79,133,255)); /* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(right,rgb(39,106,249),rgb(79,133,255)); /* Firefox 3.6 - 15 */
			background: linear-gradient(right,rgb(39,106,249),rgb(79,133,255)); /* 标准的语法（必须放在最后） */
			border-radius: 0 0 25% 25%;
			position: relative;
			padding-top:13%;
			
			.topmess{
				width: 90%;
				margin: 0 auto;
				height: 150rpx;
				display: flex;
				
				.topmess-left{
					align-items: center;
					text-align: center;
					width: 25%;
					padding-top:2%;
				}
				
				.topmess-right{
					width: 75%;
					
					div:nth-child(1){
						height: 85rpx;
						line-height: 85rpx;
						font-size: 38rpx;
						color: #fff;
						font-weight: bold;
						letter-spacing: 2rpx;
					}
					
					.topmess-right-on{
						height: 40rpx;
						line-height: 40rpx;
						background: -webkit-linear-gradient(right,rgb(251,181,86),rgb(240,148,25)); /* Safari 5.1 - 6.0 */
						background: -o-linear-gradient(right,rgb(251,181,86),rgb(240,148,25)); /* Opera 11.1 - 12.0 */
						background: -moz-linear-gradient(right,rgb(251,181,86),rgb(240,148,25)); /* Firefox 3.6 - 15 */
						background: linear-gradient(right,rgb(251,181,86),rgb(240,148,25)); /* 标准的语法（必须放在最后） */
						color: #fff;
						width: 50%;
						font-size: 22rpx;
						border-radius: 30rpx;
						display: flex;
						
						div:nth-child(1){
							width: 20%;
							height: 45rpx;
							line-height: 45rpx;
							text-align:center;
							
							image{
								width: 60%;
								height: 35rpx;
							}
						}
						div:nth-child(2){
							width: 75%;
						}
					}
					.topmess-right-off{
						background-color: #fff;
						height: 40rpx;
						line-height: 40rpx;
						color: rgba(0,0,0,0.4);
						width: 50%;
						font-size: 22rpx;
						border-radius: 30rpx;
						display: flex;
						
						div:nth-child(1){
							width: 20%;
							height: 45rpx;
							line-height: 45rpx;
							text-align:center;
							
							image{
								width: 60%;
								height: 35rpx;
							}
						}
						div:nth-child(2){
							width: 75%;
						}
					}
				}
			}
		}
		.box{
			width: 90%;
			left: 5%;
			height: 350rpx;
			background-color: #fff;
			border-radius: 16rpx;
			box-shadow: 0 0 5rpx #e6e6e6;
			position: absolute;
			top:20%;
			display:flex;
			justify-content:space-around;
			
			.box-item{
				width: 28%;
				text-align:center;
				padding-top:3%;
				
				
				
				div:nth-child(1){
					height: 50rpx;
					line-height: 50rpx;
					color: rgba(0,0,0,0.4);
					cursor: pointer;
				}
				div:nth-child(2){
					height: 50rpx;
					line-height: 50rpx;
					color: #333;
					font-weight: bold;
					font-size: 34rpx;
				}
				div:nth-child(3){
					height: 200rpx;
					border-radius: 16rpx;
					
					div:nth-child(1){
						height: 30rpx;
					}
					div:nth-child(2){
						margin: 0 auto;
						width: 50%;
						height: 90rpx;
						border-radius: 50%;
						border:2px solid #fff;
						text-align:center;
						
						image{
							margin-top: -15%;
						}
					}
					div:nth-child(3){
						width: 80%;
						height: 40rpx;
						line-height: 40rpx;
						margin: 0 auto;
						border-radius: 8rpx;
						margin-top: 10%;
						text-align: center;
						font-size: 22rpx;
						color: #fff;
						cursor: pointer;
					}
				}
				.small{
					width: 85%;
					height: 85%;
				}
				.bigimg{
					width: 100%;
					height: 100%;
				}
			}
		}
		.menulist{
			width: 90%;
			margin: 0 auto;
			margin-top: 20vh;
			background-color: #fff;
			border-radius: 16rpx;
			
			.menulist-item{
				height: 100rpx;
				line-height: 100rpx;
				width: 90%;
				margin: 0 auto;
				border-bottom: 1px solid #d6d6d6;
				display: flex;
				
				div:nth-child(1){
					width: 14%;
					text-align:center;
					line-height:110rpx;
					image{
						width: 40%;
						height: 35%;
					}
				}
				div:nth-child(2){
					width: 75%;
					font-size: 30rpx;
				}
				div:nth-child(3){
					width: 10%;
					display:flex;
					
					div:nth-child(1){
						width: 60%;
					}
					div:nth-child(2){
						width: 40%;
						text-align: center;
						color: rgba(0,0,0,0.4);
					}
					.xtxx{
						text-align: center;
						border-radius: 50%;
						border: 1px solid red;
						height: 35rpx;
						line-height: 35rpx;
						margin-top: 50%;
						font-size: 20rpx;
						color: red;
					}
				}
			}
		}
	}
</style>
