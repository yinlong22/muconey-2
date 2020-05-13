import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Money from '@/views/Money.vue'
import Labels from '@/views/Labels.vue'
import Statistics from '@/views/Statistics.vue'
import NotFound from '@/views/NotFound.vue'
import EditLabel from '@/views/EditLabel.vue'
import Chart from '@/views/Chart.vue'

Vue.use(VueRouter)

// @ts-ignore
// @ts-ignore
const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: 'money'//首页默认为money
    },
    {
        path: '/money',
        component: Money
    },
    {
        path: '/labels',
        component: Labels
    },
    {
        path:'/labels/edit/:id',//:id用来表示id=1,1的名字的
        component:EditLabel
    },
    {
        path: '/statistics',
        component: Statistics
    },
    {
        path: '*',
        component:NotFound
    },
    {
        path:'/chart',
        component:Chart
    }
]

const router = new VueRouter({
    routes
})

export default router
