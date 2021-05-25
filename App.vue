<script>
	import {mapMutations} from "vuex"
	export default {
		watch:{
			// 对token进行监听如果token不为空暂停加载动画
		  // token:{
		  //     handler(token){
		  //       if(token !== '' && token !== null){
				// 	console.log('已获得token')
				// }else{
				// 	this.getopenid()
				// }
		  //     },
		  //     deep: true,
		  //   }
		},
		onLoad() {
			
		},
		computed: {
			// token:{
			// 	get(){
			// 		return this.$store.state.login.token
			// 	},
			// 	set(val){
			// 		this.$store.state.login.token = val
			// 	}
			// }
		},
		methods:{
			// 在store/modules/login中的方法用来获取token
			// ...mapMutations([
			// 	'getopenid'
			// ])
		},
		onLaunch: function() {
			
		},
		onShow: function(options) {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import './common/icon.css';
	/*每个页面公共css */
	body{
		background-color: rgb(245,246,250);
		font-size: 32rpx;
	}
</style>
