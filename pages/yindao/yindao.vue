<template>
	<view class="yindao">
		<swiper class="swiper">
		    <swiper-item v-for="(item,index) in list" @click="go(index)">
		        <image mode="widthFix" :src="item"></image>
		    </swiper-item>
		 </swiper>
	</view>
</template>

<script>
	import { startImage } from '@/pages/api/request.js'
	export default {
			data() {
				return {
					list: []
				}
			},
			created() {
				this.getImg()
			},
			methods: {
				go(index){
					if(this.list.length == 0){
						uni.setStorageSync('isFirst', '1');
						setTimeout(res =>{
							uni.reLaunch({
								url:'../home/index'
							})
						},500)
					}else{
						if(index == this.list.length-1){
							uni.setStorageSync('isFirst', '1');
							setTimeout(res =>{
								uni.reLaunch({
									url:'../home/index'
								})
							},500)
						}else{
							return false
						}
					}
				},
				getImg(){
					startImage({})
						.then(res => {
							if(res.data.code == 200){
								this.list = res.data.data
							}else{
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
							}
						})
				}
			}
		}
</script>

<style lang="scss">
	
	page{
		width: 100%;
		height: 100%;
	}
	.yindao{
		height: 100%;
		background-color:rgb(255,255,255);
		
		.swiper{
			height: 100%;
			
			image{
				height: auto;
				width: 100%;
			}
		}
	}
</style>
