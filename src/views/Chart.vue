<template>
    <Layout class="all">
        <div class="top-bar">
            <div class="type">
                <span :class="{active:type==='-'}" @click="changeType('-')">支出</span>
                <span :class="{active:type==='+'}" @click="changeType('+')">收入</span>
            </div>

            <ul class="company-date">
                <li @click="changeCompanyDate('week')" :class="{active:companyDate==='week'}">周</li>
                <li @click="changeCompanyDate('month')" :class="{active:companyDate==='month'}">月</li>
                <li @click="changeCompanyDate('year')" :class="{active:companyDate==='year'}">年</li>
            </ul>
        </div>

        <div class="class-wrapper">
            {{getTimeText}}
            <div>{{type==='-'?'总支出：':'总收入：'}}{{parseFloat(totalAmount).toFixed(2)}}</div>
            <div>{{type==='-'?'平均支出：':'平均收入：'}}{{pingjunshu}}</div>
        </div>
        <div id="lineChart"></div>
        <pie></pie>
    </Layout>
</template>

<script>
    import dayJs from "dayjs";
    import myChart from "@/lib/echarts.js";
    import Pie from "@/views/pie";
    export default {
        name: "ReportForm",
        components: {Pie},
        data() {
            return {
                type: "-",
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
                let type = this.type;
                this.totalAmount = 0;
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
                let allRecord = this.recordList; //获取所有账单数据
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
                        newArr2.map(v => {
                            dayJs(v.createTime).month() === dayJs(new Date()).month() &&
                            newArr.push(v);
                        }); //筛选出账单类别中所有属于本月的账单newArr
                        let tempPieData = {};
                        newArr.map(value => {
                            if (value.type === type) {
                                let valueType = value.type;
                                if (tempPieData[valueType] === undefined) {
                                    tempPieData[valueType] = value.amount;
                                } else {
                                    tempPieData[valueType] += value.amount;
                                }
                            }
                        });

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
                        let tempPieData = {};
                        newArr.map(value => {
                            if (value.type === type) {
                                let valueType = value.type;
                                if (tempPieData[valueType] === undefined) {
                                    tempPieData[valueType] = value.amount;
                                } else {
                                    tempPieData[valueType] += value.amount;
                                }
                            }
                        });

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
            tagList() {
                return this.$store.state.tagList
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
        },
        created() {
            this.$store.commit("initRecordList");
        }
    };
</script>

<style lang="scss" scoped>
    $base-color: rgb(255, 218, 71);
    .all{
        height: 100vh;
    }
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
