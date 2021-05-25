import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import uView from "uview-ui";
import ourLoading from '@/components/our-loading/our-loading.vue'
import tabbar from './components/tabbar/tabbar.vue'
import menu from './components/menus/menu.vue'
// import titlechange from './components/titlechange/titlechange.vue'
import advertisement from './components/advertisement/advertisement.vue'
import search from './components/search/search.vue'
import development from './components/development/development.vue'
// 图片裁剪上传
import ImgUpload from './components/ImgUpload.vue'
// 图片背景裁剪上传
import ImgUploadBack from './components/ImgUploadBack.vue'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';


Vue.prototype.$store = store
Vue.config.productionTip = false
// Vue.use(ElementUI);

Vue.component('tab-bar', tabbar);  
Vue.component('v-menu', menu);  
// Vue.component('v-tile', titlechange);  
Vue.component('v-adv', advertisement);  
Vue.component('v-search', search);
Vue.component('v-dev', development);
Vue.component('v-ImgUpload', ImgUpload);  
Vue.component('v-ImgUpload-Back', ImgUploadBack);  
Vue.component('ourLoading', ourLoading)

Vue.use(uView);
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
