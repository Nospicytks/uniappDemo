<template>
	<view class="nearbymap">
		<div class="map">
			<map 
			 :longitude="longitude" 
			 :latitude="latitude" 
			 :markers="markers">
			 </map>
		</div>
		<div class="bottom">
			<div class="bottom-left">
				<div>{{parkItem.park_name}}</div>
				<div>{{parkItem.detail_address}}</div>
			</div>
			<div class="bottom-right" @click="getMap">导航</div>
		</div>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				parkItem: null,
				longitude:0,
				latitude:0,
				markers:[]
			}
		},
		onLoad(options) {
			let parkItem = JSON.parse(options.parkItem)
			this.parkItem = parkItem
			this.latitude = parkItem.latitude
			this.longitude = parkItem.longitude
			this.markers = [{
						longitude:parkItem.longitude,
						latitude:parkItem.latitude,
						scale:13
					}]
		},
		methods:{
			getMap(){
				uni.openLocation({
					latitude: Number(this.latitude),
					longitude: Number(this.longitude),
					name: this.parkItem.park_name,
					address: this.parkItem.detail_address
				});
			}
		},
		created() {
			
		}
	}
</script>

<style lang="scss">
	.nearbymap{
		.map{
			width: 100%;
			height: 80vh;
			margin-bottom:3%;
			
			map{
				width: 100%;
				height: 100%;
				
				a{
					display: none;
				}
			}
		}
		
		.bottom{
			height: 10vh;
			width: 85%;
			margin: 0 auto;
			display: flex;
			
			.bottom-left{
				width: 75%;
				
				div{
					height: 5vh;
					line-height: 5vh;
				}
				div:nth-child(1){
					font-weight: bold;
					font-size: 34rpx;
					color: #333;
				}
				div:nth-child(2){
					font-size: 26rpx;
					color: rgba(0,0,0,0.4);
				}
			}
			.bottom-right{
				cursor: pointer;
				width: 25%;
				margin-top: 5%;
				height: 60rpx;
				line-height: 55rpx;
				border-radius: 30rpx;
				text-align: center;
				color: #fff;
				background: -webkit-linear-gradient(right,rgb(108,169,250), rgb(74,145,252)); /* Safari 5.1 - 6.0 */
				background: -o-linear-gradient(right,rgb(108,169,250), rgb(74,145,252)); /* Opera 11.1 - 12.0 */
				background: -moz-linear-gradient(right,rgb(108,169,250), rgb(74,145,252)); /* Firefox 3.6 - 15 */
				background: linear-gradient(right,rgb(108,169,250), rgb(74,145,252)); /* 标准的语法（必须放在最后） */
			}
		}
	}
</style>
