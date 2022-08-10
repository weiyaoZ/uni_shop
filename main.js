import Vue from 'vue'
import App from './App'

// 导入网络请求的包
import {
    $http
} from '@escook/request-miniprogram'
// 挂载到 uni 顶级对象中
uni.$http = $http
// 设置请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求前展示加载的效果
$http.beforeRequest = function(options) {
    uni.showLoading({
        title: "数据加载中..."
    })
}
// 响应拦截器 请求完成之后关闭加载的效果
$http.afterRequest = function() {
    uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title = "数据请求失败", duration = 1500) {
    uni.showToast({
        title,
        duration,
        icon:'none'
    })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
