import Echarts from 'echarts'
const timeMap = {
    week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    month: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31'
    ],
    year: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
}

export default {
    createLineChart (dom, timeType, data, type) {
        const lineChart = Echarts.init(document.getElementById(dom))
        lineChart.setOption({
            title: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }
            },
            grid: {
                top: 5
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: { onZero: true },
                data: timeMap[timeType]
            },
            yAxis: {
                show: false
            },
            series: [{ name: type==='-'?'支出':'收入', data: data, type: 'line' }]
        })
    },

    createPieChart (dom, data) {
        let legendData = []
        data.map(v => {
            legendData.push(v.name)
        })
        const lineChart = Echarts.init(document.getElementById(dom))
        let option = {
            title: {
                text: '占比程度',
                subtext: '实时更新',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: legendData
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        lineChart.setOption(option)
    }
}