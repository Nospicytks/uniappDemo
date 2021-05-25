<template>
	<view class="photo">
	<view class="wrap">
			<view class="u-avatar-wrap">
				<u-loading color="red" :show="imgshow"></u-loading>
				<image v-show="!imgshow" class="u-avatar-demo"  :src="avatar" @click="lookBig"></image>
			</view>
			<u-loading color="red"  :show="imgshow"></u-loading>
			<view v-show="!imgshow" class="photobutton"  @click="getPhoto">{{buttonTitle}}</view>
	</view>
	</view>
</template>

<script>
	import { uploadImage } from '@/pages/api/request.js'
	export default {
		data() {
			return {
				avatar:this.$store.state.login.url+'/static/mini/static/components/nopic2.png',
				imgPath:'',
				imgshow:false
			}
		},
		watch:{
			imgPath:{
				handler(imgPath){
					if(imgPath !== ''){
						this.$emit('sendAvatar',imgPath)
						this.imgshow = false
					}
				},
				deep:true,
				immediate:true
			}
		},
		created() {
		
		},
		props:{
			buttonTitle:{
				type:String,
				default:'正面照片'
			}
		},
		methods: {
			// 点击放大
			lookBig(){
				let img = this.avatar
				wx.previewImage({
					urls: [img], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
					current: '', // 当前显示图片的http链接，默认是第一个
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			},
			// 打开相册
			getPhoto(){
				uni.chooseImage({
				    count: 1, //上传图片的数量，默认是9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album','camera'], //从相册选择
				    success:(res) =>{
						this.imgshow = true
				        const tempFilePaths = res.tempFilePaths;    //拿到选择的图片，是一个数组
						let avatar = tempFilePaths[0]
						this.avatar = avatar
							uploadImage({
								filePath: avatar,
								name: 'file',
								formData:{
									file:avatar,
								}
							}).then((res)=>{
								console.log(res)
								if (res.code == 200){
									this.imgPath = res.data
								}else{
									uni.showToast({
									    title: res.data.msg,
									    icon:'none'
									});
								}
							})
				    }
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.photo{
		width:100%;
		height:100%;
		
		.u-avatar-wrap {
			margin: 0 auto;
			text-align: center;
			height: 200rpx;
			background-color: rgb(237,241,253);
			border-radius: 20rpx 20rpx 0 0;
			
				.u-avatar-demo{
					width:80%;
					height:80%;
					margin-top:5%;
					border-radius:12rpx;
				}
			}
			.photobutton {
				height: 70rpx;
				line-height: 70rpx;
				margin: 0 auto;
				background-color: rgb(67,128,243);
				text-align: center;
				color: #fff;
				border-radius: 0 0 20rpx 20rpx;
			}
	}
</style>
