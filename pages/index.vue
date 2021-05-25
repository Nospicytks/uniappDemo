<template>
	<view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		watch:{
			isFirst:{
				handler(isFirst){
					if(isFirst == ''){
						uni.reLaunch({
							url:'./yindao/yindao'
						})
					}else{
						uni.reLaunch({
							url:'./home/index'
						})
					}
				},
				deep:true,
				immediate:true
			}
		},
		computed:{
			isFirst(){
				return  uni.getStorageSync('isFirst')
			}
		},
		methods:{
			
		}
	}
</script>

<style>
</style>
