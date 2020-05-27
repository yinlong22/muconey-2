<template>
    <Layout>
        <div class="top-bar">
            <div class="type">
                <span :class="{active:type==='pay'}" @click="changeType('pay')">支出</span>
                <span :class="{active:type==='income'}" @click="changeType('income')">收入</span>
            </div>

            <ul class="company-date">
                <li @click="changeCompanyDate('week')" :class="{active:companyDate==='week'}">周</li>
                <li @click="changeCompanyDate('month')" :class="{active:companyDate==='month'}">月</li>
                <li @click="changeCompanyDate('year')" :class="{active:companyDate==='year'}">年</li>
            </ul>
        </div>

        <div class="class-wrapper">
            {{getTimeText}}
            <div>{{type==='pay'?'总支出：':'总收入：'}}{{parseFloat(totalAmount).toFixed(2)}}</div>
            <div>{{type==='pay'?'平均支出：':'平均收入：'}}{{pingjunshu}}</div>
        </div>
        <div id="lineChart"></div>
        <div id="pieChart" class="aaa"></div>
    </Layout>
</template>

<script>
    import dayJs from "dayjs";
    import myChart from "@/lib/echarts.js";
    export default {
        name: "ReportForm",
        data() {
            return {
                type: "pay",
                companyDate: "month",
                currentList: [],
                totalAmount: 0,
                lineData: [],
                pieData: [] //[{value:1,name:'qqq'}]
            };
        },
        methods: {
            changeType(type) {
                this.type = type;
                this.getLineData();
                myChart.createLineChart(
                    "lineChart",
                    this.companyDate,
                    this.lineData,
                    this.type
                );
                myChart.createPieChart("pieChart", this.pieData);
            },
            changeCompanyDate(string) {
                this.companyDate = string;
                this.getLineData();
                console.log(this.pieData, `and`, this.companyDate);
                myChart.createLineChart(
                    "lineChart",
                    this.companyDate,
                    this.lineData,
                    this.type
                );
                myChart.createPieChart("pieChart", this.pieData);
            },
            getLineData() {
                let payOrIncomeList = []; //记录最终所有支出or收入金额结果数组
                this.totalAmount = 0;
                let type = this.type;
                const nullRecordObj = {
                    week: [0, 0, 0, 0, 0, 0, 0],
                    month: [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    year: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                };
                const nullPieData = [{ value: 0, name: "暂无数据" }];
                let allRecord = JSON.parse(JSON.stringify(this.recordList)); //获取所有账单数据
                if (allRecord.length === 0) {
                    this.lineData = nullRecordObj[this.companyDate];
                    this.pieData = nullPieData;
                    return;
                }
                //如果没有账单数据
                let newArr;
                const handleTypeList = {
                    week: () => {
                        newArr = [];
                        let o = [];
                        let xxx = dayJs()
                            .startOf("week")
                            .add(1, "day");
                        for (let i = 0; i < 7; i++) {
                            o.push(xxx.add(i, "day").valueOf());
                        }
                        console.log(o);
                        allRecord.map(v => {
                            o.indexOf(
                                dayJs(v.createTime)
                                    .hour(0)
                                    .minute(0)
                                    .second(0)
                                    .millisecond(0)
                                    .valueOf()
                            ) >= 0 && newArr.push(v);
                        }); //筛选
                        console.log(`本周账单`, newArr);
                        let tempPieData = {};
                        newArr.map(value => {
                            console.log(value.type === type);
                            if (value.type === type) {
                                let valueType = value.selectedTag.tagType;
                                if (tempPieData[valueType] === undefined) {
                                    tempPieData[valueType] = value.amount;
                                } else {
                                    tempPieData[valueType] += value.amount;
                                }
                            }
                        });
                        console.log(tempPieData);
                        if (Object.keys(tempPieData).length === 0) {
                            this.pieData = nullPieData;
                        } else {
                            let pieList = [];
                            for (let item in tempPieData) {
                                pieList.push({ value: tempPieData[item], name: item });
                            }
                            this.pieData = pieList;
                            console.log(`这是最终的结果`, this.pieData);
                        }
                        //---------------------------------------------
                        for (let i = 0; i < 7; i++) {
                            newArr.map(v => {
                                //得到本月31天每一天的账单数据
                                if (!payOrIncomeList[i]) {
                                    payOrIncomeList[i] = [];
                                }
                                if (dayJs(v.createTime).day() === i) {
                                    if (i === 0) {
                                        payOrIncomeList[6].push(v);
                                    } else {
                                        payOrIncomeList[i - 1].push(v);
                                    }
                                }
                            });
                        }
                        console.log(`payOrIncomeList`);
                        console.log(payOrIncomeList);
                        payOrIncomeList.map((v, index) => {
                            //31天每一天的总金额
                            if (v.length === 0) {
                                payOrIncomeList[index] = 0; //没有数据则当天为0
                            } else {
                                let count = 0;
                                v.map(value => {
                                    //遍历有数据的那天
                                    if (value.type === type) {
                                        count += parseFloat(value.amount);
                                    }
                                });
                                payOrIncomeList[index] = count;
                            }
                        });
                        payOrIncomeList.map(value => {
                            this.totalAmount += value;
                        });
                        this.lineData = payOrIncomeList;
                    },
                    month: () => {
                        let newArr2 = [];
                        newArr = [];
                        allRecord.map(v => {
                            dayJs(v.createTime).year() === dayJs(new Date()).year() &&
                            newArr2.push(v);
                        }); //筛选出账单类别中所有属于本年的账单newArr
                        console.log("这是今年的账单", newArr);
                        console.log("这是月");
                        newArr2.map(v => {
                            dayJs(v.createTime).month() === dayJs(new Date()).month() &&
                            newArr.push(v);
                        }); //筛选出账单类别中所有属于本月的账单newArr
                        let tempPieData = {};
                        newArr.map(value => {
                            console.log(value.type === type);
                            if (value.type === type) {
                                let valueType = value.selectedTag.tagType;
                                if (tempPieData[valueType] === undefined) {
                                    tempPieData[valueType] = value.amount;
                                } else {
                                    tempPieData[valueType] += value.amount;
                                }
                            }
                        });
                        if (Object.keys(tempPieData).length === 0) {
                            this.pieData = nullPieData;
                        } else {
                            let pieList = [];
                            for (let item in tempPieData) {
                                pieList.push({ value: tempPieData[item], name: item });
                            }
                            this.pieData = pieList;
                            console.log(this.pieData);
                        }
                        for (let i = 0; i < 31; i++) {
                            newArr.map(v => {
                                //得到本月31天每一天的账单数据
                                if (!payOrIncomeList[i]) {
                                    payOrIncomeList[i] = [];
                                }
                                if (dayJs(v.createTime).date() === i + 1) {
                                    payOrIncomeList[i].push(v);
                                }
                            });
                        }
                        payOrIncomeList.map((v, index) => {
                            //31天每一天的总金额
                            if (v.length === 0) {
                                payOrIncomeList[index] = 0; //没有数据则当天为0
                            } else {
                                let count = 0;
                                v.map(value => {
                                    //遍历有数据的那天
                                    if (value.type === type) {
                                        count += parseFloat(value.amount);
                                    }
                                });
                                payOrIncomeList[index] = count;
                            }
                        });
                        payOrIncomeList.map(value => {
                            this.totalAmount += value;
                        });
                        this.lineData = payOrIncomeList;
                    },
                    year: () => {
                        newArr = [];
                        allRecord.map(v => {
                            dayJs(v.createTime).year() === dayJs(new Date()).year() &&
                            newArr.push(v);
                        }); //筛选出账单类别中所有属于本年的账单newArr
                        console.log("这是今年的账单", newArr);
                        let tempPieData = {};
                        newArr.map(value => {
                            console.log(value.type === type);
                            if (value.type === type) {
                                let valueType = value.selectedTag.tagType;
                                if (tempPieData[valueType] === undefined) {
                                    tempPieData[valueType] = value.amount;
                                } else {
                                    tempPieData[valueType] += value.amount;
                                }
                            }
                        });
                        console.log(tempPieData, "tempPieData");
                        if (Object.keys(tempPieData).length === 0) {
                            this.pieData = nullPieData;
                        } else {
                            let pieList = [];
                            for (let item in tempPieData) {
                                pieList.push({ value: tempPieData[item], name: item });
                            }
                            console.log(pieList);
                            this.pieData = pieList;
                        }
                        //折线图
                        for (let i = 0; i < 12; i++) {
                            newArr.map(v => {
                                //得到本月31天每一天的账单数据
                                if (!payOrIncomeList[i]) {
                                    payOrIncomeList[i] = [];
                                }
                                if (dayJs(v.createTime).month() === i) {
                                    payOrIncomeList[i].push(v);
                                }
                            });
                        }
                        console.log("payOrIncomeList", payOrIncomeList);
                        payOrIncomeList.map((v, index) => {
                            //31天每一天的总金额
                            if (v.length === 0) {
                                payOrIncomeList[index] = 0; //没有数据则当天为0
                            } else {
                                let count = 0;
                                v.map(value => {
                                    //遍历有数据的那天
                                    if (value.type === type) {
                                        count += parseFloat(value.amount);
                                    }
                                });
                                payOrIncomeList[index] = count;
                            }
                        });
                        payOrIncomeList.map(value => {
                            this.totalAmount += value;
                        });
                        this.lineData = payOrIncomeList;
                    }
                };
                handleTypeList[this.companyDate]();
            }
        },
        computed: {
            getTimeText() {
                let timeMap = {
                    week: "本周",
                    month: "本月",
                    year: "今年"
                };
                return timeMap[this.companyDate];
            },
            recordList() {
                return this.$store.state.recordList;
            },
            pingjunshu() {
                if (this.companyDate === "week")
                    return parseFloat(this.totalAmount / 7).toFixed(2);
                if (this.companyDate === "month")
                    return parseFloat(this.totalAmount / 31).toFixed(2);
                if (this.companyDate === "year")
                    return parseFloat(this.totalAmount / 12).toFixed(2);
            }
        },
        mounted() {
            this.getLineData();
            myChart.createLineChart("lineChart", this.companyDate, this.lineData,this.type);
            myChart.createPieChart("pieChart", this.pieData);
        },
        created() {
            this.$store.commit("initRecordList");
            // console.log(dayJs(new Date().getTime()).day(0).getTIme())
        }
    };
</script>

<style lang="scss" scoped>
    $base-color: rgb(255, 218, 71);
    .class-wrapper {
        font-size: 14px;
        padding: 10px 0 3px 35px;
        div {
            color: #999;
        }
    }
    .top-bar {
        background-color: $base-color;
        padding: 11px 0;
        .type {
            text-align: center;
            margin-bottom: 10px;
            span {
                border: 1px #333 solid;
                padding: 5px;
                &.active {
                    background-color: #333;
                    color: $base-color;
                }
            }
        }
    }
    #lineChart {
        height: 23vh;
    }
    #pieChart {
        width: 100vw;
        height: 42vh;
    }
    .company-date {
        display: flex;
        margin: 0 20px;
        text-align: center;
        li {
            width: 33.3333%;
            border: 1px #333 solid;
            &.active {
                background-color: #333;
                color: $base-color;
            }
        }
    }
</style>
<!--<template>-->
<!--    <Layout>-->
<!--        <div v-if="recordList.length>0">-->
<!--        <div id="chartPie" class="pie-wrap"></div></div>-->
<!--        <div v-else class="noResult">目前还没有相关记录</div>-->
<!--    </Layout>-->
<!--</template>-->
<!--<script lang="ts">-->
<!--    import Vue from 'vue'-->
<!--    import {Component} from 'vue-property-decorator'-->

<!--    require('echarts/theme/macarons')//引入主题-->
<!--    @Component-->
<!--    export default class Chart extends Vue {-->
<!--        // eslint-disable-next-line @typescript-eslint/no-explicit-any-->
<!--        $echarts: any-->

<!--        data() {-->
<!--            return {-->
<!--                chartPie: null-->
<!--            }-->
<!--        }-->

<!--        mounted() {-->
<!--            this.$nextTick(() => {-->
<!--                this.drawPieChart()-->
<!--            })-->
<!--            console.log(this.recordList.filter(i=>i.type==="-"))-->
<!--        }-->

<!--        drawPieChart() {-->
<!--            const mytextStyle = {-->
<!--                color: '#333',-->
<!--                fontSize: 16,-->
<!--            }-->
<!--            const mylabel = {-->
<!--                show: true,-->
<!--                position: 'center',-->
<!--                offset: [30, 40],-->
<!--                textStyle: mytextStyle-->
<!--            }-->
<!--            let chartPie = this.$echarts.init(document.getElementById('chartPie'), 'macarons')-->
<!--            chartPie.setOption({-->

<!--                title: {-->
<!--                    text: '总消费:',-->
<!--                    subtext: this.recordList.filter(i=>i.type==="-").map(i => i.amount).reduce((sum, item) => sum + item, 0),-->
<!--                    x: 'center',-->
<!--                },-->
<!--                subtextStyle: {-->
<!--                    fontSize: 18,-->
<!--                    color: '#8B2323'-->
<!--                },-->
<!--                tooltip: {-->
<!--                    trigger: 'item',-->
<!--                    formatter: '{a} <br/>{b} : {c}元 ({d}%)',-->
<!--                },-->
<!--                legend: {-->
<!--                    color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#C0FF3E'],-->

<!--                    data: [this.recordList.map(t => t.tags[0].name)[0], this.recordList.map(t => t.tags[0].name)[1], this.recordList.map(t => t.tags[0].name)[2]-->
<!--                        , this.recordList.map(t => t.tags[0].name)[3], this.recordList.map(t => t.tags[0].name)[4], this.recordList.map(t => t.tags[0].name)[5],-->
<!--                        this.recordList.map(t => t.tags[0].name)[6], this.recordList.map(t => t.tags[0].name)[7], this.recordList.map(t => t.tags[0].name)[8],-->
<!--                        this.recordList.map(t => t.tags[0].name)[9], this.recordList.map(t => t.tags[0].name)[10], this.recordList.map(t => t.tags[0].name)[11]],-->
<!--                    left: 'center',-->
<!--                    top: 'bottom',-->
<!--                    orient: 'horizontal',-->
<!--                },-->
<!--                series: [-->
<!--                    {-->
<!--                        name: '访问来源',-->
<!--                        type: 'pie',-->
<!--                        radius: '63%',-->
<!--                        center: ['50%', '60%'],-->
<!--                        data: [-->
<!--                            {value: this.getList('其他'), name: '其他', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('餐饮'), name: '餐饮', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('外卖'), name: '外卖', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('食材'), name: '食材', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('零食'), name: '零食', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('购物'), name: '购物', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('衣服'), name: '衣服', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('化妆'), name: '化妆', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('交通'), name: '交通', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('游戏'), name: '游戏', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('电影'), name: '电影', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('运动'), name: '运动', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('医药'), name: '医药', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('水务'), name: '水务', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('话费'), name: '话费', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('红包'), name: '红包', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('工作'), name: '工作', label: {show: true}, labelLine: {show: true}},-->
<!--                            {value: this.getList('投资'), name: '投资', label: {show: true}, labelLine: {show: true}},-->
<!--                        ],-->
<!--                        animationEasing: 'cubicInOut',-->
<!--                        animationDuration: 2600,-->
<!--                        label: {-->
<!--                            emphasis: mylabel,-->
<!--                            normal: {-->
<!--                                position: 'outer',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'-->
<!--                                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}-->
<!--                                // {a}指series.name  {b}指series.data的name-->
<!--                                // {c}指series.data的value  {d}%指这一部分占总数的百分比-->
<!--                                formatter: '{b}'-->
<!--                            }-->
<!--                        }-->
<!--                    }-->
<!--                ]-->
<!--            })-->
<!--        }-->

<!--        getList(dataName: string) {-->
<!--            if (this.recordList.filter(i=>i.type==="-").filter(t => t.tags[0].name === dataName).map(i => i.amount).reduce((sum, n) => sum + n, 0) !== 0)-->
<!--                return this.recordList.filter(i=>i.type==="-").filter(t => t.tags[0].name === dataName).map(i => i.amount).reduce((sum, n) => sum + n, 0)-->
<!--        }-->

<!--        beforeCreate() {-->
<!--            this.$store.commit('fetchRecords')-->
<!--        }-->

<!--        tagString(tags: Tag[]) {-->
<!--            return tags.length === 0 ? '无' : tags.map(t => t.name).join('，')-->
<!--        }-->

<!--        get recordList() {-->
<!--            return (this.$store.state as RootState).recordList-->
<!--        }-->
<!--    }-->
<!--</script>-->

<!--<style lang="scss">-->
<!--    .noResult {-->
<!--        padding: 16px;-->
<!--        text-align: center;-->
<!--    }-->
<!--    .pie-wrap {-->
<!--        width: 100%;-->
<!--        height: 400px;-->
<!--    }-->
<!--</style>-->