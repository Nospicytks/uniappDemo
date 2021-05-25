<template>
	<view class="nearbyindex">
		 <ourLoading isFullScreen :active="isShow" text="loading..." />
		<div class="box">
			<!-- 搜索框 -->
			<view class="search">
				<v-search @searchDidChange="searchDidChange"></v-search>
			</view>
			<!-- 搜索框end -->
			<!-- 选择商圈 -->
			<view class="change" :style="{'visibility':!showchange?'':'hidden'}">
				<div @click="getChange(index,item)" v-for="(item,index) in changeList" :key="index" :class="active == index?'active':''" class="change-item">
					<span>{{item}}</span>
				</div>
			</view>
			<u-mask :show="showchange">
				<view class="change" style="height: auto;width: 90%;margin: 0 auto;padding:5%;border-radius: 12rpx;margin-top: 15%;" >
					<div @click="getChange(index,item)" v-for="(item,index) in changeList" :key="index" :class="active == index?'active':''" class="change-item">
						<span>{{item}}</span>
					</div>
				</view>
			</u-mask>
			<!-- 选择商圈end -->
			<!-- 当前位置 -->
			<view class="address">
				<div><u-icon name="map" color="#fff" size="28"></u-icon></div>
				<div>{{locationDesc}}</div>
				<div><u-icon @click="getUserLocation" name="reload" color="rgba(0, 0, 0, 0.447058823529412)" size="32"></u-icon></div>
			</view>
			<!-- 当前位置end -->
			<!-- 停车场列表 -->
			<view class="list">
				<scroll-view class="scroll-view" 
				:scroll-top="scrollTop"
				:show-scrollbar="true" 
				scroll-y 
				@scrolltolower="handletolower">
				   <view v-for="(item, index) in parkNearbyArr" class="scroll-view-item" @click="getLocalPark(item)">
					   <!-- 左侧 -->
					   <div class="scroll-view-item-left">
						   <div class="scroll-view-item-left-child">
							   <div :style="{'color':item.type === 1?'rgb(11,204,140)':'rgb(123,146,250)'}">{{item.surplus_num}}</div>
							   <div>空位</div>
						   </div>
						   <div @click.stop="showdev = true" class="scroll-view-item-left-bottom">
							   <u-icon name="calendar" size="20"></u-icon>
								<span>预约车位</span>
						   </div>
					   </div>
					    <!-- 左侧end -->
						<!-- 中间 -->
						<div class="scroll-view-item-center">
							<div class="scroll-view-item-center-a">
								{{item.park_name}}
							</div>
							<div class="scroll-view-item-center-b">
								<div>{{item.distance}}米</div>
								<div>{{item.business_district}}</div>
							</div>
							<div class="scroll-view-item-center-c">
								<u-icon name="map" size="26"></u-icon>
								<span>{{item.detail_address}}</span>
							</div>
						</div>
						<!-- 中间end -->
						<!-- 右侧 -->
						<div class="scroll-view-item-right">
							<div class="scroll-view-item-right-a" @click.stop="goDetail(item)">
								<div>
									<image :src="xqImg" mode=""></image>
								</div>
								<div>详情</div>
							</div>
							<div class="scroll-view-item-right-b" @click.stop="goMap(item)">
								<div>
									<image :src="dhImg" mode=""></image>
								</div>
								<div>导航</div>
							</div>
						</div>
						<!-- 右侧end -->
				   </view>
				   <u-loadmore v-if="parkNearbyArr.length >= 15" :status="status" />
				</scroll-view>
			</view>
			<!-- 停车场列表end -->
			<!-- 开发中 -->
			<u-mask :show="showdev">
				<v-dev @close="updateShowdev"></v-dev>
			</u-mask>	
		</div>
		<tab-bar :current-page="0"></tab-bar>  
	</view>
</template>

<script>
	import { parkBusinessDistrict,parkNearby,locationDes } from '@/pages/api/request.js'
	export default {
		data() {
			return{
				currPage:1,
				isShow: true,
				xqImg:this.$store.state.login.url+'/static/mini/static/nearby/xiangqing.png',
				dhImg:this.$store.state.login.url+'/static/mini/static/nearby/daohang.png',
				showchange:false,
				showdev:false,
				status: 'loadmore',
				changeHeight:false,
				active:-1,
				parkNearbyArr:[],
				changeList:[],
				location: null,
				searchStr:'',
				hasMore:true,
				locationDesc:'',
				scrollTop:0
			}
		},
		destroyed() {
			clearTimeout()
		},
		methods:{
			changeScrollView(){
			    this.scrollTop = 0;//回到最顶部
			},
			// 获取用户地理位置
			getUserLocation(){
				var that = this
				uni.getLocation({
				    type: 'wgs84',
					geocode: true,
				    success: res => {
						that.location = res.longitude + ',' + res.latitude
						that.getChangeList()
						that.getLocation()	
				    },
					fail: res => {
						console.log('getLocation-fail' + res.msg)
						uni.showToast({
							content:'地理位置加载失败，请尝试重新进入界面！',
							icon:'none',
							duration: 2000
						})
					}
				});
			},
			getLocation(){
				var that = this;
				if (that.location){
					var arr = that.location.split(',')
					 locationDes({
						 coordinate:arr[1] + ',' + arr[0]
					 }).then((res)=>{
						if (res.data.status == 0) {
							that.locationDesc = res.data.result.address
						}
					})
				}
			},
			handletolower(page){
				if(this.hasMore){
				 this.status = 'loading'
				 this.currPage += 1
				 this.getParkNearby()
				}else{
					this.status = 'nomore'
				}
			},
			searchDidChange(searchStr){
				this.searchStr = searchStr
				this.hasMore = true
				this.getParkNearby()
			},
			getChangeList() {
				var that = this;
				
				if (that.location){
					that.hasMore = true
				
					 parkBusinessDistrict({}).then((res)=>{
					
						if (res.data.code == 200) {
							that.changeList = res.data.data
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'loading'
							})
						}
						that.addMore()
						that.getParkNearby()
					})
				}
			},
			getParkNearby (){
				setTimeout(time=>{
				var that = this
				let change;
				if(this.searchStr == ''){
					if(this.active == -1){
						change = ''
					}else{
						change = this.changeList[this.active]
					}
				}else{
					change = ''
					console.log('else:'+change)
				}
			   parkNearby({
					location: this.location,
					business_district: change,
					search: this.searchStr,
					page: this.currPage,
					pagesize: 15
				}).then((res)=>{
					if(res.data.data){
						that.isShow = false
						if (res.data.code == 200) {
							if (that.currPage === 1){
								that.parkNearbyArr = res.data.data
								that.status = 'loadmore'
							}else{
								that.parkNearbyArr = [...that.parkNearbyArr, ...res.data.data]
								that.changeScrollView()
								that.status = 'loadmore'
							}
							if(res.data.data.length < 15){
								that.status = 'nomore'
								that.changeScrollView()
								that.hasMore = false
							}
							that.isShow = false
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
							that.isShow = false
						}
					}else{
						uni.showToast({
							title:'暂无数据',
							icon:'none'
						})
						that.parkNearbyArr = []
						that.hasMore = false
						that.isShow = false
					}
				})
				},1000)
			},
			addMore(){
				this.changeList.splice(this.changeList.length, 0,'更多+');
			},
			getChange(index,name){
				if(name == '更多+'){
					this.showchange = true
					this.changeList.splice(this.changeList.length-1,1)
					this.changeList.splice(this.changeList.length, 0,'收起-');
				}else if(name == '收起-'){
					this.showchange = false
					this.changeList.splice(this.changeList.length-1,1)
					this.changeList.splice(this.changeList.length, 0,'更多+');
				}else{
					this.isShow = true
					this.active = index
					this.hasMore = true
					this.getParkNearby()
				}
			},
			updateShowdev(val){
				this.showdev = val
			},
			goDetail(e){
				if(e){
					uni.navigateTo({
						url:'./detail/detail?park_id='+ e.park_id + '&location=' + this.location 
					})
				}
			},
			goMap(e){
				uni.navigateTo({
					url:'./map/map?parkItem=' + JSON.stringify(e)
				})
			},
			// 判断上一页来选择接下来的动作
			getLocalPark(e){
				//跳转详情
				if(this.type == 0){
					this.goDetail()
					//首页切换停车场
				}else if(this.type == 1){
					uni.showToast({
						type:'success',
						title:'切换成功'
					})
					uni.$emit('update_park',e.park_id)
					setTimeout(()=>{
						uni.navigateBack({
						})
					},1000)
					clearTimeout()
					//2 意见反馈切换停车场
				}else{
					uni.showToast({
						type:'success',
						title:'切换成功'
					})
					uni.$emit('update_park_opinion',e)
					setTimeout(()=>{
						uni.navigateBack({
						})
					},1000)
					clearTimeout()
				}
			}
		},
		onShow() {
			if (!this.location){
				this.getUserLocation()
			}
		},
		onLoad(options) {
			this.type = options.type
			this.location = options.location
			this.getChangeList()
			this.getLocation()			
		}
	}
</script>

<style lang="scss">
	.nearbyindex{
		
		.box{
			width:95%;
			margin:0 auto;
			
			.search{
				width: 100%;
				height: 80rpx;
				background-color: #fff;
			}
			
			.change{
				margin-top: 2%;
				padding-bottom: 3%;
				background-color: #fff;
				display: flex;
				flex-wrap: wrap;
				overflow-y: auto;
				box-shadow:0 0px 1px rgba(0, 0, 0, 0.3), 0 0 3px rgba(0, 0, 0, 0.1) inset;
				border-radius:8rpx;
				
				.change-item{
					padding-left: 2%;
					padding-right: 2%;
					margin-left: 2%;
					height: 70rpx;
					line-height: 70rpx;
					border: 1px solid #d6d6d6;
					text-align: center;
					color: rgba(0, 0, 0, 0.447058823529412);
					border-radius: 8rpx;
					margin-top: 2%;
					margin-bottom: 1%;
					white-space: normal;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.active{
					border:1px solid rgb(123,146,250);
					color: rgb(123,146,250);
				}
			}
			.changeHeight{
				height: auto;
				animation-name: example;
				animation-duration: 0.6s;
				animation-fill-mode:forwards;
			}
			@keyframes example {
			  0%   { opacity:0;}
			  15%  { opacity:0.1}
			  30%  { opacity:0.2;}
			  45%  { opacity:0.3;}
			  60%  { opacity:0.5;}
			  75%  { opacity:0.6;}
			  90%  { opacity:0.8;}
			  100% { opacity:1;}
			}
			
			.address{
				height: 100rpx;
				display: flex;
				
				font-size: 26rpx;
				
				div:nth-child(1){
					text-align: center;
					width: 5%;
					height: 40rpx;
					line-height: 40rpx;
					background-color: rgb(77,116,247);
					border-radius: 8rpx;
					margin-top: 4%;
				}
				div:nth-child(2){
					width: 77%;
					margin-left: 3%;
					color: rgb(123,146,250);
					line-height: 100rpx;
				}
				div:nth-child(3){
					width: 10%;
					line-height: 100rpx;
					cursor: pointer;
				}
			}
			
			.list{
				height: 65vh;
				
				.scroll-view{
					height: 100%;
					width: 100%;
					padding-bottom: 15%;
				}
				
				.scroll-view-item{
					height: 200rpx;
					background-color: #fff;
					border-radius: 12rpx;
					margin-top: 1%;
					display:flex;
					.scroll-view-item-left{
						width: 25%;
						height: 200rpx;
						padding-top:3%;
						
						.scroll-view-item-left-child{
							width: 70%;
							margin: 0 auto;
							height: 110rpx;
							background-color: rgb(246,246,246);
							text-align: center;
							
							div{
								height: 55rpx;
								line-height: 55rpx;
							}
							div:nth-child(1){
								font-weight: bold;
								font-size: 36rpx;
							}
							div:nth-child(2){
								color: rgb(193,193,193);
								font-size: 32rpx;
							}
						}
						
						.scroll-view-item-left-bottom{
							width: 70%;
							margin: 0 auto;
							height: 40rpx;
							background-color: rgb(227,255,240);
							border:1px solid rgb(188,241,211);
							border-radius: 12rpx;
							line-height: 40rpx;
							margin-top: 5%;
							font-size: 19rpx;
							padding-left: 5%;
							color:rgb(11,204,140);
							
							span{
								margin-left: 5%;
								
							}
						}
					}
					
					.scroll-view-item-center{
						width: 40%;
						height: 150rpx;
						margin-top: 5%;
						
						.scroll-view-item-center-a{
							font-weight: bold;
							color: #333;
							font-size: 32rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.scroll-view-item-center-b{
							display: flex;
							color: rgba(0, 0, 0, 0.4);
							font-size: 28rpx;
							margin-top:5%;
							div{
								height: 30rpx;
								line-height: 30rpx;
								font-size: 24rpx;
							}
							div:nth-child(2){
								height: 30rpx;
								line-height: 30rpx;
								width: 45%;
								margin-left: 5%;
								text-align: center;
								border: 1px solid rgba(0, 0, 0, 0.4);
								border-radius: 4rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								padding-left: 2%;
								padding-right: 2%;
								font-size: 22rpx;
							}
						}
						.scroll-view-item-center-c{
							font-size: 24rpx;
							color: rgba(0, 0, 0, 0.4);
							margin-top:5%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							
							span{
								margin-left: 3%;
							}
						}
					}
					
					.scroll-view-item-right{
						width: 35%;
						display: flex;
						padding-top:4%;
						
						.scroll-view-item-right-a{
							width: 40%;
							
							image{
								width: 40%;
								height: 40%;
								margin: 0 auto;
								margin-top: 30%;
							}
							div:nth-child(1){
								height: 100rpx;
								line-height: 100rpx;
								background-color: rgb(11,206,140);
								text-align: center;
								color: #fff;
								border-radius: 50%;
							}
							div:nth-child(2){
								margin-top: 5%;
								text-align: center;
								color: rgba(0, 0, 0, 0.4);
								font-size: 25rpx;
							}
						}
						.scroll-view-item-right-b{
							margin-left: 10%;
							width: 40%;
							
							image{
								width: 40%;
								height: 40%;
								margin: 0 auto;
								margin-top: 30%;
							}
							div:nth-child(1){
								height: 100rpx;
								line-height: 100rpx;
								background-color: rgb(123,146,250);
								text-align: center;
								color: #fff;
								border-radius: 50%;
							}
							div:nth-child(2){
								text-align: center;
								margin-top: 5%;
								color: rgba(0, 0, 0, 0.4);
								font-size: 25rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
