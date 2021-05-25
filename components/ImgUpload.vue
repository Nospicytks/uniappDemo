<template>
	<view class="photo">
	<view class="wrap">
		<view class="u-avatar-wrap">
			<image class="u-avatar-demo" :src="avatar" mode="aspectFill"></image>
		</view>
		<view class="photobutton" @tap="chooseAvatar()">{{buttonTitle}}</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '',
			}
		},
		watch:{
			avatar:{
				handler(avatar){
					if(avatar !== ''){
						this.$emit('sendAvatar',avatar)
					}
				},
				deep:true,
				immediate:true
			}
		},
		// this.$emit('sendAvatar',this.avatar)
		created() {
			// // 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
					this.avatar = path;
			})
		},
		props:{
			buttonTitle:{
				type:String,
				default:'正面照片'
			},
			imgPath:{
				type:String
			}
		},
		methods: {
			chooseAvatar(e) {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
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
