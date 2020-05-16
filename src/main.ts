import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Nav from '@/components/Nav.vue'
import Layout from '@/components/Layout.vue'
import Icon from '@/components/Icon.vue'

Vue.config.productionTip = false
// @ts-ignore
import echarts from "echarts"
Vue.prototype.$echarts = echarts
Vue.component('Nav', Nav)
Vue.component('Layout', Layout)
Vue.component('Icon', Icon)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

window.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, 9999)
    }, 0)
}

if (document.documentElement.clientWidth > 500) {
    window.alert('请使用手机打开，以保证浏览效果')
    const img = document.createElement('img')
    img.src = 'https://user-gold-cdn.xitu.io/2020/5/13/1720d99b435380e3?w=256&h=256&f=png&s=6624'
    img.style.position = 'fixed'
    img.style.top = '26%'
    img.style.left = '50%'
    img.style.transform = 'translate(-50%,-50%)'
    img.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)'
    document.body.appendChild(img)
}