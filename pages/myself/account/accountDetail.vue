<template>
	<view class="accountDetail">
		<view v-for="(item,index) in list" :key="index" class="accountDetail-item">
			<div>
				<div v-if="item.channel == 1">
					停车消费
				</div>
				<div v-else-if="item.channel == 2">
					用户充值
				</div>
				<div v-else-if="item.channel == 3">
					购卡消费
				</div>
				<div v-else>
					系统操作
				</div>
				<div :style="{'color':item.type === 1?'':'rgb(10,175,57)'}">
					{{item.type === 1?'-':'+'}}{{item.money}}
				</div>
			</div>
			<div>
				<div>
					<span>{{item.created_at.substr(0,10)}}</span>
					<span>{{item.created_at.substr(10)}}</span>
				</div>
				<div>
					<span>余额</span>
					<span>{{item.after_money}}</span>
				</div>
			</div>
		</view>
	</view>
</template>

<script>
	import { userAccount } from '@/pages/api/request.js'
	export default{
		data(){
			return {
				list:[]
			}
		},
		created() {
			this.getUserAccount()
		},
		methods:{
			getUserAccount(){
				let that = this;
				userAccount({}).then((res)=>{
					if (res.data.code == 200) {
						that.list = res.data.data
					}else{
						uni.showToast({
							title:res.data.msg,
							duration:2000
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.accountDetail{
		width: 90%;
		margin: 0 auto;
		
		.accountDetail-item{
			background-color: #fff;
			border-radius: 16rpx;
			height:150rpx;
			padding:2%;
			margin-top:3%;
			
			div{
				display: flex;
				padding-left:2%;
				height: 50rpx;
				line-height:50rpx;
				
				div:nth-child(1){
					width: 70%;
				}
				div:nth-child(2){
					width: 30%;
				}
			}
			div:nth-child(1){
				font-weight: bold;
			}
			div:nth-child(2){
				font-size: 24rpx;
				
				div:nth-child(1){
					color: rgba(0,0,0,0.4);
					span:nth-child(2){
						margin-left: 2%;
					}
				}
				div:nth-child(2){
					span:nth-child(1){
						color: rgba(0,0,0,0.4);
					}
					span:nth-child(2){
						margin-left:5%;
					}
				}
			}
		}
	}
</style>
