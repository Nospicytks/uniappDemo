<template>
	<view>
		<view style="position: relative;">
			<!-- 头部 -->
			<view class="register" 
			style="background: url('http://daranzhibojiekou.daranjituan.com/static/mini/static/home/registerhead.png') 
			no-repeat;
			background-size: cover;">
				<u-icon style="cursor: pointer;" @click="goBack()" color="#fff" size="40" name="arrow-left"></u-icon>
				<div v-if="is_sign == 0" class="registernum"  @click="clickSignUp(null,1)">
					<u-icon size="45" style="margin-top: 2%;" color="#fff" :name="qdSrc"></u-icon>
					<span>立即签到</span>
				</div>
				<div v-else class="registernumfin">
					<u-icon size="45" style="margin-top: 2%;" color="#fff" :name="qdSrc"></u-icon>
					<span>已签到</span>
				</div>
				<div class="registernumall">当前周期已累计签到{{sign_num}}天</div>
			</view>
			<!-- 打卡日历 -->
			<view class='all'>
				<view class="bar">
					<!-- 上一个月 -->
					<view class="previous" @click="handleCalendar(0)">
						<u-icon name="arrow-left"></u-icon>
					</view>
					<!-- 显示年月 -->
					<view class="date">{{cur_year || "--"}} 年 {{cur_month || "--"}} 月</view>
					<!-- 下一个月 -->
					<view class="next" @click="handleCalendar(1)">
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<!-- 显示星期 -->
				<view class="week">
					<view v-for="(item,index) in weeks_ch" :key="index">{{item}}</view>
				</view>
				<view  class="myDateTable">
					<view v-for="(item,j) in days" :key="j" class='dateCell'>
						<view v-if="item.date==undefined||item.date == null" class='cell'>
							<text :decode="true">&nbsp;&nbsp;</text>
						</view>
						<view v-else>
							<!-- 当前日期之前 -->
							<view v-if="item.is_sign == 0" class='cell greenColor'>
								<text>{{item.date}}</text>
							</view>
							<!-- 今日未签到-->
							<view  @click="clickSignUp(item.date,1)" v-else-if="item.date==today&&cur_month==toMonth&&cur_year==toYear">
								<div class="qddate"><text>{{item.date}}</text></div>
								<div class="isRegister">
									<u-icon size="15" color="#fff" name="checkmark"></u-icon>
								</div>
							</view>
							<!-- 当前日期之后 -->
							<view class="whiteColor cell" v-else>
								<div><text>{{item.date}}</text></div>
								<div class="isRegister">
									<u-icon size="15" color="#fff" name="checkmark"></u-icon>
								</div>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 打卡日历end -->
		</view>
		<!-- 提示 -->
		<view class="registertitle">
			<span>{{cur_year}}.{{cur_month.toString().padStart(2,'0')}}.01-{{toYear}}.{{cur_month.toString().padStart(2,'0')}}.{{getThisMonthDays(toYear,cur_month)}}</span>
			<span style="margin-left: 3%;">累计签到有机会领取以下奖励:</span>
		</view>
		<!-- 提示end -->
		<!-- 奖励 -->
		<view class="registerReward">
			<div v-for="(item,index) in rewardList" :key="index" class="registerReward-item">
				<div class="registerReward-item-head">
					累计签到{{item.day}}天
				</div>
				<div class="registerReward-item-body">
					<span>{{item.points}}</span>
					<span>积分</span>
				</div>
			</div>
		</view>
		<!-- 奖励end -->
		<!-- 规则 -->
		<view class="registerRoles">
			<div class="registerRoles-title">
				<div></div>
				<div></div>
				<div>签到规则</div>
				<div></div>
				<div></div>
			</div>
			<div class="registerRoles-center-item">
				 <rich-text :nodes="SignContent"></rich-text>
				<!-- {{SignContent}} -->
			</div>
			
		</view>
		<!-- 右下角图片 -->
		<view class="registerWin" @click="listShow = true">
			<image class="img1" :src="jf1" mode=""></image>
			<image class="img2" :src="jf2" mode=""></image>
		</view>
		<!-- 任务列表 -->
		<u-popup v-model="listShow"
		  duration="300"
		   mode="bottom" 
		   :closeable="true"
		   border-radius="12" 
		   length="65%">
		   <view class="register-list">
			   <view class="register-list-title">
				   做任务赚积分
			   </view>
			   <view v-if="item.status == 1" v-for="(item,index) in list" :key="index" class="register-list-item">
				   <view class="register-list-item-left">
					   <image :src="item.img" ></image>
				   </view>
				   <view class="register-list-item-center">
					   <div style="font-size: 26rpx;">{{item.title}}</div>
					   <div>
						   <span style="font-size: 22rpx;color: rgba(0,0,0,0.4);">
							{{item.coefficient == 0?'积分奖励':'奖励系数'}}
						   </span>
						   <span style="font-size: 24rpx;color: rgb(245,117,0);margin-left: 3%;">
							 {{item.coefficient == 0?item.points:item.coefficient}}
						   </span>
					   </div>
				   </view>
				   <view @click="goUrl(item.path)" :class="is_complete == 1?'register-list-item-rightFin':'register-list-item-right'">
					   {{authenticate == 1?'已完成':'去完成'}}
				   </view>
				  <!-- <view v-else class="" @click="goUrl('')"></view>   -->
			   </view>
		   </view>
		 </u-popup>
	</view>
</template>

<script>
	import { signInfo,sign,task } from '@/pages/api/request.js'
	export default {
		data() {
			return {
				listShow:false,
				show:false,
				qdSrc:require('@/static/myself/qiandao.png'),
				jf1:this.$store.state.login.url+'/static/mini/static/home/jifen1.png',
				jf2:this.$store.state.login.url+'/static/mini/static/home/jifen2.png',
				days: [],
				SignUp: [],
				is_sign:0,
				SignContent: [],
				sign_num:'0',
				cur_year: 0, //当前选的年
				cur_month: 0, //当前选的月
				today: parseInt(new Date().getDate()), //本日
				toMonth: parseInt(new Date().getMonth() + 1), //本月
				toYear: parseInt(new Date().getFullYear()), //本年
				weeks_ch: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				rewardList:[],
				mesList:[
					{img:'../../../static/myself/1.jpg',title:'认证个人身份',path:'/pages/myself/GOAuthenticate/GOAuthenticate'},
					{img:'../../../static/myself/2.jpg',title:'储值奖励',path:'/pages/myself/account/account'},
					{img:'../../../static/myself/3.jpg',title:'关注公众号奖励',path:''},
					{img:'../../../static/myself/4.jpg',title:'签到奖励',path:'sign'},
					{img:'../../../static/myself/5.jpg',title:'车辆认证',path:'/pages/home/addCars/attestation/attCar'},
					{img:'../../../static/myself/6.jpg',title:'办卡奖励',path:'/pages/home/addCars/addCars'}
				],
				list:[]
			};
		},
		props: {
			sendYear: {
				type: Number,
				default: new Date().getFullYear()
			},
			sendMonth: {
				type: Number,
				default: new Date().getMonth() + 1
			},
			dataSource: { //已签到的数据源
				type: Array,
				default: () => {
					return []
				}
			},
			langType: { //只是示例一个翻译而已，要想所有都翻译自己可以再加加
				type: String,
				default: "ch"
			},
		},
		created() {
			this.cur_year = this.sendYear;
			this.cur_month = this.sendMonth;
			this.SignUp = this.dataSource;

			this.calculateEmptyGrids(this.cur_year, this.cur_month);
			this.calculateDays(this.cur_year, this.cur_month);
			this.onJudgeSign();
			this.getSignInfo()
		},
		watch: {
			dataSource: 'onResChange',
		},
		computed:{
			authenticate(){
				return this.$store.state.login.authenticate
			}
		},
		created() {
			this.getTast()
		},
		methods: {
			getTast(){
				task({})
					.then(res => {
						if (res.data.code == 200){
							for(let i = 0;i<res.data.data.length;i++){
								this.list.push({
									img:this.mesList[i].img,
									title:this.mesList[i].title,
									path:this.mesList[i].path,
									points:res.data.data[i].points,
									coefficient:res.data.data[i].coefficient,
									introduction:res.data.data[i].introduction,
									is_complete:res.data.data[i].is_complete,
									status:res.data.data[i].status
								})
							}
							this.mesList = res.data.data
						}else{
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					})
			},
			goUrl(url){
				if(url == 'sign' || url == ''){
					this.listShow = false
				}else{
					uni.navigateTo({
						url:url
					})
				}
			},
			signIn(){
				sign({}).then(res=>{
					if (res.data.code == 200){
						uni.showToast({
							title: '签到成功',
							icon: 'success',
							duration: 2000
						});
						this.getSignInfo();
					}else{
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				})
			},
			getSignInfo(){
				var that = this
				signInfo({
					date:that.cur_year + '-' + that.cur_month.toString().padStart(2,'0')
				}).then(res=>{
					if (res.data.code == 200){
						that.SignUp = res.data.data.monthSign
						that.SignContent = res.data.data.content
						that.rewardList = res.data.data.reward
						that.sign_num = res.data.data.sign_num
						that.is_sign = res.data.data.is_sign
						that.onJudgeSign();
					}else{
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				})
			},
			goBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取当月共多少天
			getThisMonthDays(year, month) {
				return new Date(year, month, 0).getDate()
			},
			// 获取当月第一天星期几
			getFirstDayOfWeek(year, month) {
				return new Date(Date.UTC(year, month - 1, 1)).getDay();
			},
			// 计算当月1号前空了几个格子，把它填充在days数组的前面
			calculateEmptyGrids(year, month) {
				//计算每个月时要清零
				this.days = [];
				const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
				if (firstDayOfWeek > 0) {
					for (let i = 0; i < firstDayOfWeek; i++) {
						var obj = {
							date: null,
							is_sign: 0
						}
						this.days.push(obj);
					}
				}
			},

			// 绘制当月天数占的格子，并把它放到days数组中
			calculateDays(year, month) {

				const thisMonthDays = this.getThisMonthDays(year, month);
				// this.columnsLen=Math.ceil(thisMonthDays/7);
				// console.log(this.columnsLen);
				for (let i = 1; i <= thisMonthDays; i++) {
					var obj = {
						date: i,
						is_sign: 0
					}
					this.days.push(obj);
				}
				//console.log(this.days);

			},

			onResChange(newD, oldD) {
				this.SignUp = newD;
				this.getSignInfo()
			},
			//匹配判断当月与当月哪些日子签到打卡
			onJudgeSign() {
				var signs = this.SignUp;
				var daysArr = this.days;
				for (var i = 0; i < signs.length; i++) {
					var current = new Date(signs[i].date.replace(/-/g, "/"));
					var year = current.getFullYear();
					var month = current.getMonth() + 1;
					var day = current.getDate();
					day = parseInt(day);
					for (var j = 0; j < daysArr.length; j++) {
						//年月日相同则打卡成功   						
						if (year == this.cur_year && month == this.cur_month && daysArr[j].date == day) { //&& signs[i].is_sign == "今日已打卡"
							// console.log(signs);
							daysArr[j].is_sign = signs[i].is_sign;
						}
					}
				}
				this.days = daysArr;
			},
			// 切换控制年月，上一个月，下一个月
			handleCalendar(type) {
				const cur_year = parseInt(this.cur_year);
				const cur_month = parseInt(this.cur_month);
				var newMonth;
				var newYear = cur_year;
				if (type === 0) { //上个月
					newMonth = cur_month - 1;
					if (newMonth < 1) {
						newYear = cur_year - 1;
						newMonth = 12;
					}
				} else {
					newMonth = cur_month + 1;
					if (newMonth > 12) {
						newYear = cur_year + 1;
						newMonth = 1;
					}
				}
				this.calculateEmptyGrids(newYear, newMonth);
				this.calculateDays(newYear, newMonth);

				this.cur_year = newYear;
				this.cur_month = newMonth;

				this.SignUp = []; //先清空
				this.$emit('dateChange', this.cur_year+"-"+this.cur_month); //传给调用模板页面去拿新数据		
				//refresh
				this.getSignInfo();		
			},
			clickSignUp(date, type) { //type=0补签，type=1当日签到		
				var str = "签到";
				if (type == 0) {//如果不需要补签功能直接在这阻止不执行后面的代码就行。
					str = "补签";
					return
				}
				if (!date){
					date = new Date().getDay()
				}
				this.$emit('clickChange', this.cur_year + "-" + this.cur_month + "-" + date); //传给调用模板页面
				this.signIn();
			}
		}
	}
</script>

<style>
	.register{
		width: 100%;
		height: 350rpx;
		padding-left:3%;
		padding-top: 15%;
	}
	.registernum{
		width: 35%;
		margin: 0 auto;
		height: 80rpx;
		text-align: center;
		color: #fff;
		line-height: 80rpx;
		border: 1px solid #fff;
		border-radius: 30rpx;
		text-align: center;
	}
	.registernumfin{
		width: 90%;
		margin: 0 auto;
		text-align: center;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 7%;
	}
	.registernumfin span{
		margin-left: 3%;
		font-weight: bold;
	}
	.registernum span{
		margin-left: 3%;
		font-weight: bold;
	}
	.registernumall{
		width: 90%;
		margin: 0 auto;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		margin-top: 1%;
	}
	.all {
		width: 90%;
		background-color: #fff;
		border-radius: 24rpx;
		padding-top: 2%;
		padding-bottom: 2%;
		position: absolute;
		left: 5%;
		top:90%;
	}
	.all .bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 30rpx 20rpx;
		padding: 10rpx;
	}
	.date{
		color: #333;
		font-weight: bold;
		font-size: 28rpx;
	}
	.bar .barbtn {
		font-size: 12px;
	}

	.all .week {
		display: flex;
		justify-content: space-between;
		padding: 50rpx;
		font-size: 24rpx;
		color: rgba(0,0,0,0.4);
	}
	.myDateTable {
		padding-left: 20rpx;
		border-radius: 10px;
	}
	.myDateTable .dateCell {
			width: 12vw;
			padding: 1vw;
			display: inline-block;
			text-align: center;
			font-size: 16px;
		}
		 .cell {
				height: 70rpx;
			}
	.whiteColor {
		color: #333;
		font-weight: bold;
	}
	.isRegister{
		width: 20rpx;
		height: 20rpx;
		line-height: 10rpx;
		text-align: center;
		border-radius: 50%;
		background-color: rgb(9,198,11);
		margin-left: 40%;
		margin-top: 2%;
	}
	.greenColor {
		color: rgba(0,0,0,0.4);
		font-weight: bold;
	}
	.qddate {
		font-size: 14px;
		color: #fff;
		background: -webkit-linear-gradient(rgb(255,155,32), rgb(240,32,53)); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(rgb(255,155,32), rgb(240,32,53)); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(rgb(255,155,32), rgb(240,32,53)); /* Firefox 3.6 - 15 */
		background: linear-gradient(rgb(255,155,32), rgb(240,32,53)); /* 标准的语法（必须放在最后） */
		border-radius: 50%;
		align-items: center;
		height: 35rpx;
		width: 50%;
		margin-left: 25%;
		line-height: 35rpx;
		text-align: center;
		cursor: pointer;
	}
	.registertitle{
		height: 120rpx;
		line-height: 120rpx;
		width: 90%;
		margin: 0 auto;
		margin-top: 95%;
		font-size: 24rpx;
		font-weight: bold;
	}
	.registerReward{
		width: 90%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.registerReward-item{
		margin-top: 2%;
		width: 22%;
		border-radius: 12rpx;
		background-color: rgb(255,84,72);
	}
	.registerReward-item-head{
		height: 100rpx;
		width: 100%;
		text-align: center;
		color: #fff;
		font-size: 24rpx;
		line-height: 90rpx;
		border-radius: 12rpx 12rpx 50% 50%;
		background-color: rgb(255,56,75);
		border-bottom: 2px solid rgb(255,216,129);
	}
	.registerReward-item-body{
		height: 120rpx;
		color:rgb(255,221,132);
		text-align:center;
		line-height: 120rpx;
	}
	.registerReward-item-body span:nth-child(1){
		font-size: 44rpx;
		font-weight: bold;
	}
	.registerReward-item-body span:nth-child(2){
		color:rgba(255,221,132,0.8);
		font-size: 30rpx;
		margin-left: 2%;
	}
	.registerRoles{
		width: 90%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 16rpx;
		margin-top: 5%;
		margin-bottom: 15%;
	}
	.registerRoles-title{
		height: 100rpx;
		display: flex;
		padding-top: 5%;
	}
	.registerRoles-title div:nth-child(1){
		width: 10rpx;
		height:10rpx;
		background-color: rgb(255,175,185);
		border-radius: 50%;
		margin-left: 33%;
		margin-top: 3%;
	}
	.registerRoles-title div:nth-child(2){
		width: 20rpx;
		height: 20rpx;
		background-color: rgb(255,55,76);
		border-radius: 50%;
		margin-left: 1%;
		margin-top: 2%;
	}
	.registerRoles-title div:nth-child(3){
		font-weight: bold;
		color: #333;
		font-size: 36rpx;
		margin-left: 3%;
	}
	.registerRoles-title div:nth-child(4){
		width: 20rpx;
		height: 20rpx;
		background-color: rgb(255,55,76);
		border-radius: 50%;
		margin-left: 3%;
		margin-top: 2%;
	}
	.registerRoles-title div:nth-child(5){
		width: 10rpx;
		height: 10rpx;
		background-color: rgb(255,175,185);
		border-radius: 50%;
		margin-left: 1%;
		margin-top: 3%;
	}
	.registerRoles-center-item{
		padding-left: 5%;
		padding-right: 5%;
		color: rgba(0,0,0,0.7);
		padding-bottom: 5%;
	}
	.registerRoles-center-item span:nth-child(2){
		margin-left: 3%;
	}
	.registerWin{
		position: fixed;
		width: 13%;
		height: 100rpx;
		bottom: 2%;
		right:5%;
		cursor: pointer;
	}
	.registerWin .img1{
		width: 100%;
		height: 100%;
	}
	.registerWin .img2{
		position: absolute;
		width: 40%;
		height: 40%;
		right: 30%;
		top: 10%;
	}
	.register-list{
		background-color: rgb(245,246,250);
	}
	.register-list-title{
		width: 90%;
		margin: 0 auto;
		height: 100rpx;
		line-height: 100rpx;
		letter-spacing: 1rpx;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
	}
	.register-list-item{
		width: 90%;
		margin: 0 auto;
		margin-top: 3%;
		height: 10rpx;
		border-radius: 16rpx;
		background-color: #fff;
		display: flex;
		height: 130rpx;
	}
	.register-list-item-left{
		width: 20%;
		text-align: center;
		line-height: 5;
	}
	.register-list-item-left image{
		width: 45%;
		height: 40%;
	}
	.register-list-item-center{
		width: 50%;
		padding-top: 3%;
	}
	.register-list-item-right{
		width: 25%;
		background-color: #19BE6B;
		text-align: center;
		color: #fff;
		height: 65rpx;
		line-height: 65rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		background-color: rgb(255,106,78);
		margin-top: 4%;
	}
	.register-list-item-rightFin{
		width: 25%;
		text-align: center;
		color: rgb(171,171,171);
		height: 65rpx;
		line-height: 65rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		background-color: rgb(218,218,218);
		margin-top: 4%;
	}
</style>
