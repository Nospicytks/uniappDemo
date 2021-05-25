<template>
	<view class="opinion">
		<view class="head">
			<div>所在停车场</div>
			<div @click="getLocalPark">
				<span>{{parkInfo?parkInfo.park_name:park_name_place}}</span>
				<u-icon name="arrow-right"></u-icon>
			</div>
		</view>
		<view class="input-box">
			<u-input style="padding: 5%;"
			maxlength="200"
			:trim="true"
			placeholder="请填写10字以上的描述,以使我们提供更好的帮助"
			 v-model="value" 
			 :type="type" 
			 :height="height" />
		</view>
		<!-- 表单 -->
		<view class="form">
			<div class="form-item">
				<div><span>您的姓名</span><span style="color: rgba(0,0,0,0.4);">(必填)</span></div>
				<div><u-input class="u-input" v-model="name" type="text" placeholder="请输入您的姓名" /></div>
			</div>
			<div class="form-item">
				<div><span>性别</span><span style="color: rgba(0,0,0,0.4);">（必选）</span></div>
				<div @click="show = true" style="margin-left: auto;">
					<span>{{sex}}</span>
					<u-icon color="rgba(0,0,0,0.4)" name="arrow-right"></u-icon>
				</div>
				<u-picker v-model="show" mode="selector" 
				:default-selector="[0]" 
				:range="selector" 
				range-key="sex"
				@confirm="confirm"></u-picker>
			</div>
			<div class="form-item" style="border: none;">
				<div><span>联系电话</span><span style="color: rgba(0,0,0,0.4);">(必填)</span></div>
				<div><u-input class="u-input"  v-model="phone" type="text" placeholder="请输入您的联系电话" /></div>
			</div>
		</view>
		<!-- 按钮 -->
		<view class="button" @click="submit">提交</view>
		<!-- 电话-->
		<view class="phone">
			<div></div>
			<div @click="takePhone"><image :src="phoneImg" mode=""></image></div>
		</view>
		
	</view>
</template>

<script>
	import { opinionIssue } from '@/pages/api/request.js'
	export default {
			data() {
				return {
					park_name_place:'请选择',
					parkInfo:null,
					value: '', //输入框
					sex:'选择性别',
					type: 'textarea',
					height:'400rpx',
					show:false,
					phoneImg:this.$store.state.login.url+'/static/mini/static/nearby/phone.png',
					name:'',
					sexId:'',
					phone:'',
					selector: [
						{
							sex: '男',
							id: 1
						},
						{
							sex: '女',
							id: 2
						}
					]	
				}
			},
			onLoad() {
				
				uni.$on('update_park_opinion',(res)=>{
					console.log('update_park_opinion',res)
					this.parkInfo = res
				})
			},
			methods:{
				submit(){
					var that = this
					if (that.checkData()){
						opinionIssue({
							park_id:that.parkInfo.park_id,
							name:that.name,
							sex:that.sexId,
							phone:that.phone,
							content:that.value
						}).then(res=>{
							if (res.data.code === 200){
								uni.showToast({
									type:'success',
									title:res.data.msg
								})
								setTimeout(()=>{
									uni.navigateBack({
									})
								},1000)
								clearTimeout()
							}else{
								uni.showToast({
									type:'error',
									title:res.data.msg
								})
							}
						})
					}
				},
				checkData(){
					if (this.value === ''){
						uni.showToast({
							title:'请输入描述',
							duration:2000
						})
						return false
					}else if (this.parkInfo === null){
						uni.showToast({
							title:'请选择停车场',
							duration:2000
						})
						return false
					}else if (this.name === ''){
						uni.showToast({
							title:'请输入您的姓名',
							duration:2000
						})
						return false
					}else if (this.sexId === ''){
						uni.showToast({
							title:'请选择性别',
							duration:2000
						})
						return false
					}else if (this.phone === ''){
						uni.showToast({
							title:'请输入电话',
							duration:2000
						})
						return false
					}
					return true
				},
				getLocalPark(){
					uni.navigateTo({
						url:'/pages/nearby/index?type=2'
					})
				},
				confirm(val){
					this.sex = this.selector[val].sex
					this.sexId = this.selector[val].id
					
				},
				takePhone(){
					uni.makePhoneCall({
							// 手机号
							phoneNumber: '15940948375',
							// 成功回调
							success: (res) => {
								console.log('调用成功!')
							},
							// 失败回调
							fail: (res) => {
								console.log('调用失败!')
							}
						});
				}
			}
		}
</script>

<style lang="scss">
	.opinion{
		width: 90%;
		margin: 0 auto;
		
		.head{
			height: 100rpx;
			line-height: 100rpx;
			
			div:nth-child(1){
				color: #333;
				font-weight: bold;
				float: left;
			}
			div:nth-child(2){
				color: rgb(94,128,248);
				display: flex;
				text-align: right;
				float: right;
			}
		}
		.input-box{
			height: 400rpx;
			background-color: #fff;
			margin-top: 5%;
			border-radius: 16rpx;
		}
		.form{
			height: 300rpx;
			background-color: #fff;
			margin-top: 5%;
			border-radius: 16rpx;
			
			.form-item{
				height: 100rpx;
				line-height: 100rpx;
				width: 90%;
				margin: 0 auto;
				border-bottom: 1px solid #d6d6d6;
				display: flex;
				
				.u-input{
					height: 70rpx;
					margin-top: 5%;
					width: 91%;
					margin-left: auto;
				}
			}
		}
		.button{
			background-color: rgb(77,116,247);
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			border-radius: 8rpx;
			font-weight: bold;
			letter-spacing: 2rpx;
			font-size: 32rpx;
			margin-top: 5%;
			cursor: pointer;
		}
		.phone{
			height: 100rpx;
			line-height: 100rpx;
			margin-top: 10%;
			display:flex;
			
			div:nth-child(1){
				width: 85%;
			}
			div:nth-child(2){
				width: 15%;
				height: 100rpx;
				background-color: rgb(98,133,251);
				border-radius: 50%;
				text-align: center;
				line-height:115rpx;
				cursor: pointer;
				
				image{
					width: 40%;
					height: 40%;
				}
			}
		}
	}
</style>
