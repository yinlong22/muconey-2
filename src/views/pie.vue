<template>
    <div v-if="recordList.length>0">
        <span class="title">消费习惯：</span>
        <div id="chartPie" class="pie-wrap"></div>
    </div>
    <div v-else class="noResult">目前还没有相关记录</div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'

    require('echarts/theme/macarons')//引入主题
    @Component
    export default class pie extends Vue {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        $echarts: any

        data() {
            return {
                chartPie: null
            }
        }

        mounted() {
            this.$nextTick(() => {
                this.drawPieChart()
            })
        }

        drawPieChart() {
            const mytextStyle = {
                color: '#333',
                fontSize: 16,
            }
            const mylabel = {
                show: true,
                position: 'center',
                offset: [30, 40],
                textStyle: mytextStyle
            }
            let chartPie = this.$echarts.init(document.getElementById('chartPie'), 'macarons')
            chartPie.setOption({

                title: {
                    x: 'center',
                },
                subtextStyle: {
                    fontSize: 18,
                    color: '#8B2323'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}元 ({d}%)',
                },
                legend: {
                    color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#C0FF3E'],

                    data: [this.recordList.map(t => t.tags[0].name)[0], this.recordList.map(t => t.tags[0].name)[1], this.recordList.map(t => t.tags[0].name)[2]
                        , this.recordList.map(t => t.tags[0].name)[3], this.recordList.map(t => t.tags[0].name)[4], this.recordList.map(t => t.tags[0].name)[5],
                        this.recordList.map(t => t.tags[0].name)[6], this.recordList.map(t => t.tags[0].name)[7], this.recordList.map(t => t.tags[0].name)[8],
                        this.recordList.map(t => t.tags[0].name)[9], this.recordList.map(t => t.tags[0].name)[10], this.recordList.map(t => t.tags[0].name)[11]],
                    left: 'center',
                    top: 'bottom',
                    orient: 'horizontal',
                },
                series: [
                    {
                        name: '支出',
                        type: 'pie',
                        radius: '63%',
                        center: ['50%', '60%'],
                        data: [
                            {value: this.getList('其他'), name: '其他', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('餐饮'), name: '餐饮', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('外卖'), name: '外卖', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('食材'), name: '食材', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('零食'), name: '零食', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('购物'), name: '购物', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('衣服'), name: '衣服', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('化妆'), name: '化妆', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('交通'), name: '交通', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('游戏'), name: '游戏', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('电影'), name: '电影', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('运动'), name: '运动', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('医药'), name: '医药', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('水务'), name: '水务', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('话费'), name: '话费', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('红包'), name: '红包', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('工作'), name: '工作', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('投资'), name: '投资', label: {show: true}, labelLine: {show: true}},
                            {value: this.getList('学习'), name: '学习', label: {show: true}, labelLine: {show: true}},

                        ],
                        animationEasing: 'cubicInOut',
                        animationDuration: 2600,
                        label: {
                            emphasis: mylabel,
                            normal: {
                                position: 'outer',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                                // {a}指series.name  {b}指series.data的name
                                // {c}指series.data的value  {d}%指这一部分占总数的百分比
                                formatter: '{b}'
                            }
                        }
                    }
                ]
            })
        }

        getList(dataName: string) {
            if (this.recordList.filter(i => i.type === '-').filter(t => t.tags[0].name === dataName).map(i => i.amount).reduce((sum, n) => sum + n, 0) !== 0) {
                return this.recordList.filter(i => i.type === '-').filter(t => t.tags[0].name === dataName).map(i => i.amount).reduce((sum, n) => sum + n, 0)
            } else {
                console.log(dataName)
            }
        }

        beforeCreate() {
            this.$store.commit('fetchRecords')
        }

        tagString(tags: Tag[]) {
            return tags.length === 0 ? '无' : tags.map(t => t.name).join('，')
        }

        get recordList() {
            return (this.$store.state as RootState).recordList
        }
    }
</script>

<style lang="scss" scoped>
    .noResult {
        padding: 16px;
        text-align: center;
    }

    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: chocolate;
        font-size: 20px;
        transform: translateY(20px);
    }

    .pie-wrap {
        transform: translateY(-60px);
        width: 100%;
        height: 380px;
    }
</style>