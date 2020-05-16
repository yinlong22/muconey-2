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
    img.src = 'https://camo.githubusercontent.com/8eddbb4749dccef8925ab56049892842ba07c1ea/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323032302f352f31332f313732306439396234333533383065333f773d32353626683d32353626663d706e6726733d36363234'
    img.style.position = 'fixed'
    img.style.top = '26%'
    img.style.left = '50%'
    img.style.transform = 'translate(-50%,-50%)'
    img.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)'
    document.body.appendChild(img)
}