import {mapMutations} from "vuex"
import Vue from 'vue'
import { store } from '@/store/modules/login.js'
// https://parktest.test.utools.club
// https://daranzhibojiekou.daranjituan.com
const baseurl = 'https://daranzhibojiekou.daranjituan.com/api'
export function Get(obj,url){
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseurl+url,
            data: obj,
            method:'GET',
			header: {
				'token': Vue.prototype.$store.state.login.token, 
			},
            success: (res) => {
				if (res.data.code == 401){
					Vue.prototype.$store.state.login.token = ''
					Vue.prototype.$store.state.login.loginState = false
				}
                resolve(res);
            },
            fail(err) {
                reject(err);
            }
        });
    })
}
export function Post (data,url) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseurl+url, 
            data: data,
			header: {
				'token': Vue.prototype.$store.state.login.token, 
			},
            method:'POST',
            success: (res) => {
				if (res.data.code == 401){
					Vue.prototype.$store.state.login.token = ''
					Vue.prototype.$store.state.login.loginState = false
				}
				resolve(res);
            },
            fail(err) {
                reject(err)
            }
        });
    })
}
export function Upload (data,url) {
    return new Promise((resolve, reject) => {
		uni.uploadFile({
		    url: baseurl+url, 
			filePath: data.filePath,
			name:data.name,
			formData: data.formData,
			header: {
				'token': Vue.prototype.$store.state.login.token, 
			},
		    success: (res) => {
				let js = JSON.parse(res.data)
				if (js.code == 401){
					Vue.prototype.$store.state.login.token = ''
					Vue.prototype.$store.state.login.loginState = false
				}
				resolve(js);
		    },
		    fail(err) {
				reject(err)
		    }
		});
    })
}