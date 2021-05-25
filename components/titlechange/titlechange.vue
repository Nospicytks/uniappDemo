<template>
	<view class="titlechange">
		<u-navbar :is-back="false" :title="ftitle" :background="background"></u-navbar>
	</view>
</template>

<script>
	export default {
			data() {
				return {
					background: {
						// backgroundColor: 'rgb(245,246,250)',
						// 导航栏背景图
						// background: 'url(https://cdn.uviewui.com/uview/swiper/1.jpg) no-repeat',
						// 还可以设置背景图size属性
						// backgroundSize: 'cover',
						// 渐变色
						backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
					}
				}
			},
			props:{
				ftitle:{
				  type:String,
				  required:false,
				  default:"大然泊车"
				}
			},
			created() {
				console.log(this.ftitle)
			}
		}
</script>

<style lang="scss">
	.titlechange{
		margin-bottom: 5%;
	}
</style>
