<template>
	<view class="menu">
		<view  @click="goPath(item.url, item.title)" v-for="(item,index) in menuList" :key="index" class="menu-item">
			<div><image :src="item.imgPath" mode=""></image></div>
			<div><text>{{item.title}}</text></div>	
		</view>
		<!-- 开发中 -->
		<u-mask :show="showdev">
			<v-dev @close="updateShowdev"></v-dev>
		</u-mask>	
	</view>
</template>

<script>
	export default{
		data() {
			return {
				showdev:false,
				isphone:false,
				menuList:[
					{
						title:'我的爱车',
						imgPath:require('../../static/menus/icon1.png'),
						url:'/pages/home/addCars/attestation/attestation'
					},
					{
						title:'我要办卡',
						imgPath:require('../../static/menus/icon2.png'),
						url:'/pages/home/addCars/addCars?fromBuy=' + true	
					},
					// {
					// 	title:'违章查询',
					// 	imgPath:require('../../static/menus/icon3.png'),
					// 	url:''
					// },
					{
						title:'自助洗车',
						imgPath:require('../../static/menus/icon4.png'),
						url:''
					},
					{
						title:'充值',
						imgPath:require('../../static/menus/icon5.png'),
						url:'/pages/myself/account/account'
					}
				],
				userMobile:uni.getStorageSync('userMobile')
			}
		},
		watch:{
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
			}
		},
		computed:{
			
		},
		methods:{
			goPath(url, title){
				if(url == ''){
					this.showdev = true
				}else{
					if(this.userMobile){
						uni.navigateTo({
							url:url
						})
					}else{
						if (title === '充值') {
							uni.reLaunch({
								url:'../login/index?isPay=1'
							})
						} else {
							uni.reLaunch({
								url:'../login/index'
							})
						}
					}
				}
			},
			updateShowdev(val){
				this.showdev = val
			}
		}
	}
</script>

<style lang="scss">
	.menu{
		width: 90%;
		margin: 0 auto;
		height: 170rpx;
		display: flex;
		flex-wrap: nowrap;
		justify-content:space-around;
		
		.menu-item{
			width: 25%;
			margin-left:2%;
			
			div:nth-child(1){
				// width: 64%;
				width: 110rpx;
				height: 110rpx;
				margin: 0 auto;
			}
			div:nth-child(2){
				width: 64%;
				height: 60rpx;
				margin: 0 auto;
				font-size: 23rpx;
				line-height: 50rpx;
				padding-left: 2%;
				font-weight: bold;
				letter-spacing: 2rpx;
				text-align: center;
			}
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
