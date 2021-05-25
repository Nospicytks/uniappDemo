import { login } from '@/pages/api/request.js'
export default{
	state:{
		url:'http://daranzhibojiekou.daranjituan.com', //服务器
		loginStatus:false, //登陆状态
		orderStatus:0, // 0 未绑定临时车 1 绑定临时车未入场 2 车辆入场生成订单
		userMobile:'', //绑定的手机号
		isVip:true, //vip
		authenticate:true, //实名认证
		token:'',
		referral_code:'',
		carNum:'',
		userInfo:'', //微信用户信息
		nickName:''
	},
	// 计算属性
	getters:{
		
	},
	// 写函数方法
	mutations:{
		// 获取openid
		getopenid(state){
			wx.login({
			  success(res) {
				var code = res.code
				let treferral_code;
				let r = uni.getStorageSync('referral_code')
				if(r == '' || r == 'undefind' || r == null){
					treferral_code = ''
				}else{
					treferral_code = uni.getStorageSync('referral_code')
				}
				// 请求参数
				let params ={
					code:code,
					referral_code:treferral_code
				}
				// 发起请求
				login(params).then(
				    (res) => {
						// 获取信息成功
						if(res.data.code === 200){
							state.token = res.data.data.token
							state.referral_code = res.data.data.referral_code
							state.loginState = true
							state.userMobile = res.data.data.phone
								if(res.data.data.is_member === 1){
									state.isVip = true
								}else{
									state.isVip = false
								}
								uni.removeStorageSync('referral_code')
							}else{
							uni.showToast({
								title:'网络错误',
								icon:'loading'
							})
						}
				    },
				    (err) => {
				        uni.showToast({
				        	title:'网络错误',
				        	icon:'loading'
				        })
				    }
				)
			  }
			})
		},
	},
	// 异步方法
	actions:{
	
	}
}