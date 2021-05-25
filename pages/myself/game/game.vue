<template>
	<view class="game" 
		style="background: url('http://daranzhibojiekou.daranjituan.com/static/mini/static/myself/gameback.png')
		no-repeat;
		background-size: cover;
		padding-top: 15%;">
		<ourLoading isFullScreen :active="isShow" text="loading..." />
		<div class="title">
			<u-icon style="cursor: pointer;" @click="goBack()" color="#fff" size="40" name="arrow-left"></u-icon>
		</div>
		
		<view class="detail" @click="lookDetail()">
			活动详情
		</view>
		
		 <view class="play">
		    <!-- 九宫格抽奖 -->
		    <LuckyGrid
			  ref="LuckDraw"
		      width="620rpx"
		      height="620rpx"
			  rows="4"
			  cols="4"
		      :blocks="blocks"
		      :prizes="prizes"
		      :buttons="buttons"
		      :defaultStyle="defaultStyle"
			  :defaultConfig="defaultConfig"
		      @start="startCallBack"
		      @end="endCallBack"
		    />
		  </view>
		  <!-- 我的积分 -->
		  <view class="my">
			  <div>
				  <span>我的积分：{{points}}</span>
			  </div>
			  <div @click="showPath">
				  我的中奖记录
			  </div>
		  </view>
		  <!-- 中奖名单 -->
		  <view class="names" v-if="lottery.is_announce == 1">
			  <view class="names-title">中奖名单</view>
			  <scroll-view class="scroll-view" scroll-y>
				  <div class="nameList" v-for="(item,index) in record" :key="index">
					 <div>
						 {{item.phone}}
					 </div>
					 <div>
						 {{item.name}}
					 </div>
				  </div>
			  </scroll-view>
		  </view>
		  <!-- <view class="showadv" v-show="showadv">
				<view class="advcontent" >
				  <view class="advtitle">
					  {{lottery.name}}
				  </view>
				  <view class="adv">
					<rich-text :nodes="lottery.content"></rich-text>
				 </view>
				 <view @click="showadv = false" class="advbottom">
					 我知道了
				 </view>
				</view>
		</view> -->
	</view>
</template>

<script>
  import { info,draw } from '@/pages/api/request.js'
  import LuckyWheel from 'uni-luck-draw/lucky-wheel' // 大转盘
  import LuckyGrid from 'uni-luck-draw/lucky-grid' // 九宫格
	export default {
		components: { LuckyWheel, LuckyGrid },
		data(){
			return {
					  game:false,
					  showadv:false,
					  isShow:false,
				      blocks: [
				          { padding: '3%', background: '#fff' },
				        ],
				        prizes: [
							
				        ],
				        buttons: [{ 
							x: 1, y: 1, 
							col: 2, 
							row:2,
							borderRadius:49,
							background:'#FE4A4B',
							fonts: [{ text: '立即抽奖', top: 62,fontColor: '#fff',fontSize:'24px' }] ,
						}],
				        defaultStyle: {
				          fontSize: '14px'
				        },
						defaultConfig:{
							gutter:'7',
							speed:'25'
						},
						gameList:[],
						points:'',
						record:[],
						lottery:{},
			}
		},
		created() {
			this.getMessage()
		},
		methods:{
			// 查看详情
			lookDetail(){
				// this.showadv = true
				uni.showModal({
				    title:this.lottery.name,
				    content:this.lottery.content.replace(/<\/?.+?>/g,""),
				    showCancel:true,
				    cancelText:'返回',
				    confirmText:'我知道了',
					cancelColor:'#333',
					confirmColor:'#FF6365'
				})
			},
			// 中奖记录
			showPath(){
				uni.navigateTo({
					url:'/pages/myself/history/gameHistory'
				})
			},
			// 返回上一页
			goBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取活动信息
			getMessage(){
				info({})
					.then(res => {
						if (res.data.code == 200){
							this.gameList = res.data.data.prize
							this.points = res.data.data.points
							this.record = res.data.data.record
							this.lottery = res.data.data.lottery
							const prizes = []
							let axis = [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[2,3],[1,3],[0,3],[0,2],[0,1]]
							for(let i = 0;i<res.data.data.prize.length;i++){
								prizes.push({
									index:i,x:axis[i][0],y:axis[i][1],
									background:'#FEF7EF',
									borderRadius:'8',
									fonts:[{text:res.data.data.prize[i].name,top:'50',fontColor:'#333'}],
									imgs:[{src: res.data.data.prize[i].pic,height:'50%', top: '8%'}]
								})
							}
							this.prizes = prizes
							
						}else{
							uni.showToast({
								content:res.msg,
								icon:'none'
							})
						}
					})
			},
			 // 点击抽奖按钮触发回调
			      startCallBack () {
					  if(this.game == false){
					  this.isShow = true
					  var index;
					   // 先开始旋转
					  draw({})
						.then(res=>{
							this.game = true
							if(res.data.code == 200){
								this.isShow = false
								this.$refs.LuckDraw.play()
								for(let i = 0;i<this.prizes.length;i++){
									if(res.data.data.lottery_prize_id == this.gameList[i].lottery_prize_id){
										index = i
									}
								}
								setTimeout(() => {
								  this.$refs.LuckDraw.stop(index)
								}, 2000)
								console.log(index)
							}else{
								this.isShow = false
								this.game = false
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
							}
						})
						}
			      },
			      // 抽奖结束触发回调
			      endCallBack (prize) {
			        // 奖品详情
					uni.showModal({
					    title:"提醒",
					    content:prize.fonts[0].text,
					    showCancel:true,
					    cancelText:'返回',
					    confirmText:'我知道了',
						cancelColor:'#333',
						confirmColor:'#FF6365'
					})
					this.game = false
					this.getMessage()
			      }
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.game{
		height: 100%;
		
		.title{
			width: 90%;
			margin: 0 auto;
		}
		.detail{
			width: 20%;
			height: 60rpx;
			line-height: 60rpx;
			margin-left: auto;
			margin-top: 25%;
			background-color: rgb(252,74,72);
			border-radius: 20rpx 0 0 20rpx;
			font-size: 24rpx;
			color: #fff;
			padding-left: 3%;
		}
		.play{
			width: 90%;
			height: 650rpx;
			margin: 0 auto;
			background-color: #fff;
			padding-left: 25rpx;
			padding-top: 15rpx;
			border-radius: 20rpx;
			margin-top: 5%;
		}
		.my{
			height: 120rpx;
			line-height: 120rpx;
			width: 85%;
			margin: 0 auto;
			display:flex;
			color:#fff;
			
			div:nth-child(2){
				margin-left: auto;
				text-align: right;
				cursor: pointer;
			}
		}
		.names{
			width: 90%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 20rpx;
			
			.names-title{
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size: 26rpx;
				color: #333;
			}
			
			.scroll-view{
				height: 300rpx;
				
				.nameList{
					margin-top: 3%;
					margin-bottom: 3%;
					padding-left: 5%;
					display:flex;
					
					div:nth-child(2){
						margin-left: auto;
						padding-right: 5%;
					}
				}
			}
		}
		.showadv{
			width:100%;
			height:100%;
			z-index: 99999;
			position: absolute;
			background-color:rgba(51,51,51,0.6);
			top:0;
			
		.advcontent{
			width: 60%;
			margin: 0 auto;
			border-radius:12rpx;
			background-color: #fff;
			margin-top:50%;
			.advtitle{
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 32rpx;
			}
			.adv{
				font-size: 26rpx;
				color: rgba(0,0,0,0.4);
				padding: 5%;
			}
			.advbottom{
				font-size: 26rpx;
				color: red;
				text-align: center;
				height: 60rpx;
				line-height: 60rpx;
			}
		}
		}
	}
</style>
