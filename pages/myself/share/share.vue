<template>
	<view class="share">
		<img src="https://daranzhibojiekou.daranjituan.com/static/mini/static/myself/back.png" alt="" style="width: 100%;height:100%">
		<button class='button' id="shareBtn" open-type="share" hover-class="none" style="width: 616rpx;height: 30%;position: absolute;left: 61rpx;top: 95%;opacity: 0;"></button>
		<u-mask :show="showadv" ><v-adv :pic="pic" @close="updateShowadv"></v-adv></u-mask>
	</view>
</template>

<script>
	import { couponNew } from '@/pages/api/request.js'
	export default{
		data(){
			return {
				showadv:false,
				sharePath:this.$store.state.login.url+'/static/mini/static/home/share.png',
			}
		},
		methods:{
			// 微信分享
			onShareAppMessage(){
				let referral_code =  this.$store.state.login.referral_code
				return{
					title:'好友分享',
					path:'pages/home/index?referral_code='+referral_code,
				}
			},
			getCouponNew(){
				couponNew({})
					.then(res =>{
						if(res.data.code == 200){
							if(res.data.data){
								this.showAdv(res.data.data.pic)
							}
						}
					})
			},
			// 弹出广告
			showAdv(pic){
					this.pic = pic
					setTimeout(()=>{
					     this.showadv = true
					  },100)
					clearTimeout()  
			}
		},
		created() {
			this.getCouponNew()
		}
	}
</script>

<style lang="scss">
	.share{
		width: 750rpx;
		height: 1950rpx;
		margin: 0 auto;
		color:rgb(99,100,100);
		
		.Img{
			width: 100%;
			margin-top:5%;
			image{
				width: 100%;
			}
		}
		
		.button{
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
