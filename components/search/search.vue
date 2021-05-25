<template>
	<view class="search">
		<!-- 搜索栏 -->
			<!-- <view class="iconfont icon-sousuo"></view> -->
			<div class="select-left">
				<u-icon name="search" color="rgba(0, 0, 0, 0.447058823529412)" size="38"></u-icon>
			</div>
			<div class="select-right">
				<input confirm-type="search" @confirm="onInput" v-model="select_val" type="text" placeholder="搜索地点, 停车场">
			</div>
		<!-- end -->
	</view>
</template>

<script>
	export default{
		data(){
			return{
				select_val:''
			}
		},
		methods:{
			onInput(e){
				this.$emit('searchDidChange',this.select_val)
			}
		}
	}
	
</script>

<style lang="scss">
	.search{
		width: 100%;
		height: 100%;
		display: flex;
		
		.select-left{
			height: 100%;
			width: 10%;
			text-align: right;
			padding-top:3.5%;
		}
		.select-right{
			width: 80%;
			margin-left:5%;
			input{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
