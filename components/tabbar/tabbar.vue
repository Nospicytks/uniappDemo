<template>  
    <view class="tabbar">  
        <block>
			<div key="1" class="tabbar-item">
				<div class="tabbar-item-img">
					<image @click="changeItem(tabbarList[0].path)" :src="currentItem==1?tabbarList[0].selectIcon:tabbarList[0].icon"></image> 
				</div>
				<view class="tabbar-item-text" :class="[currentItem==1 ? 'item-active' : '']">
				    <text>{{tabbarList[0].text}}</text>  
				</view> 
			</div>
			<div key="2" class="tabbar-item">
				<div @click="changeItem('../../pages/nearby/index?type=0')" class="tabbar-item-center"></div>
			</div>
			<div key="3" class="tabbar-item">
				<div class="tabbar-item-img">
					<image @click="changeItem(tabbarList[1].path)" :src="currentItem==2?tabbarList[1].selectIcon:tabbarList[1].icon"></image> 
				</div>
				<view class="tabbar-item-text" :class="[currentItem==2 ? 'item-active' : '']">
					<text>{{tabbarList[1].text}}</text>  
				</view> 
			
			</div>
		</block>
    </view>  
</template>  

<script>  
	import { saveInfo } from '@/pages/api/request.js'
// import { indx } from '@/store/modules/login.js'
	import {mapMutations} from "vuex"
    export default {  
        props:{  
            currentPage: {  
                type: Number,  
                default: 0  
            }  
        },  
        data() {  
            return {
                currentItem: 0,  
                tabbarList: [  
                    {  
                        path: "../../pages/home/index",  
                        icon: "/static/tabbar/home.png",  
                        selectIcon: "/static/tabbar/homeselected.png",  
                        text: "首页",  
                        centerItem: false  
                    },{  
                        path: "../../pages/myself/index",  
                        icon: "/static/tabbar/me.png",  
                        selectIcon: "/static/tabbar/meselected.png",  
                        text: "我的",  
                        centerItem: false  
                    }
                ],
				avatarUrl:uni.getStorageSync('avatarUrl'),
				nickName:uni.getStorageSync('nickName'),
				tavatarUrl:'',
				tnickName:''
            };  
        }, 
        mounted(){  
            this.currentItem = this.currentPage;  
            uni.hideTabBar();  
        },
		  watch:{
			  avatarUrl:{
				  handler(avatarUrl){
				    if(avatarUrl){
						this.tavatarUrl = avatarUrl
				     }
				  },
				  deep: true,
				  immediate: true,
			  },
			  nickName:{
			  	handler(nickName){
			  	    if(nickName){
			  			this.tnickName = nickName
			  	     }
			  	  },
			  	  deep: true,
			  	  immediate: true,
			  },
		  	// 对token进行监听如果token不为空暂停加载动画
		    // token:{
		    //     handler(token){
		    //       if(token === '' || !token){
					 //  this.$store.state.login.token = ''
					 //  this.getopenid()
		  		//    }
		    //     },
		    //     deep: true,
		    //     immediate: true,
		    //   }
		  },
		  computed: {
			token:{
			  get(){
				return this.$store.state.login.token
			  },
			  set(val){
				this.$store.state.login.token = val
			  }
			},
			// avatarUrl(){
			// 	return  uni.getStorageSync('avatarUrl')
			// },
			// nickName(){
			// 	return  uni.getStorageSync('nickName')
			// }
		  },
        methods: { 
			// ...mapMutations([
			// 	'getopenid'
			// ]),
			getUser(){
				if(this.tavatarUrl == '' || this.tnickName == '' || this.token == ''){
					wx.getSetting({
						success:res=> {
								 uni.getUserProfile({
										desc:'登录',
										success: res=>{
											uni.setStorageSync('avatarUrl',res.userInfo.avatarUrl)
											uni.setStorageSync('nickName',res.userInfo.nickName)
											let params = {
												encryptedData: res.encryptedData,
												iv: res.iv
											}
											// https://daranzhibojiekou.daranjituan.com
											uni.request({
												 url:'https://daranzhibojiekou.daranjituan.com/api/v1/user/saveInfo',
												 dataType:"json",
												 data:params,
												 header: {
													 'token': this.token, 
													 },
												 method:"POST",
												 success:res=>{
													 console.log(this.token)
													 if (res.data.code == 401){
														this.$store.state.login.token = ''
													 }
													 console.log(this.$store.state.login.token)
													 if(res.data.data.is_member === 1){
													 	that.$store.state.login.isVip = true
													 }else{
													 	that.$store.state.login.isVip = false
													 }
												 }
												})
												uni.reLaunch({
													url:'../../pages/myself/index'
												})
										  },
										  fail: (err) => {
											  uni.showToast({
											  		title:'信息获取失败',
											  		icon:'none'
											  	})
												uni.reLaunch({
													url:'../../pages/myself/index'
												})
										  }
								})
						}
					})
				}else{
					uni.reLaunch({
						url:'../../pages/myself/index'
					})
				}
			},
            changeItem(path){  
				if (path.indexOf('myself') !== -1){
					this.getUser()
				}else{
					uni.reLaunch({
						url: path
					})
				}
				
            }  
        },
		  created() {
		  	var pages = getCurrentPages()
		  	var currentPage = pages[pages.length-1].route
		  	uni.setStorageSync('currentPage',currentPage)
		  }
    }  
</script>  
<style scoped>   
	 .tabbar{
		 position: fixed;  
		 bottom: 0; 
		 width: 100%;
		 height: 150rpx;
		 display: flex;
		 background: url(../../static/tabbar/tabbar.png) no-repeat;
		 background-size: cover;
	 }
	 .tabbar-item{
		  width: 40%;
		  text-align: center;
	 }
	 .tabbar-item:nth-child(2){
	 	width: 20%;
		position: relative;
	 }
	.tabbar-item-img{
		width: 18%;
		height: 50rpx;
		margin-left: 41%;
		margin-top: 23%;
	}
	.tabbar-item-img image{
		width: 100%;
		height: 100%;
	}
	.tabbar-item-text{
		font-size: 21rpx;
		color: #999999;
	}
	.item-active{
	    color: #66CCFF;  
	}
	.tabbar-item-center{
		width: 75%;
		height: 110rpx;
		border-radius: 50%;
		margin-left: 12%;
		margin-top: 15%;
		background: url(../../static/tabbar/dingwei.png) no-repeat;
		background-size: cover;
	}

</style> 