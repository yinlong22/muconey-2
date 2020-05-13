<template>
    <Layout>
        <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type"/>
        <ol v-if="groupedList.length>0">
            <li v-for="(group,index) in groupedList" :key="index">
                <h3 class="title">{{beautify(group.title)}} <span>￥{{group.total}}</span></h3>
                <ol>
                    <li v-for="item in group.items"
                        :key="item.id" class="record">
                        <span>{{tagString(item.tags)}}</span>
                        <span class="note">{{item.notes}}</span>
                        <span>￥{{item.amount}}</span>
                    </li>
                </ol>
            </li>
        </ol>
        <div v-else class="noResult">
            目前没有相关记录
        </div>
    </Layout>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import Tabs from '@/components/Tabs.vue'
    import recordTypeList from '@/constants/recordTypeList'
    import dayjs from 'dayjs'
    import clone from '@/lib/clone'

    @Component({
        components: {Tabs},
    })
    export default class Statistics extends Vue {
        tagString(tags: Tag[]) {
            return tags.length === 0 ? '无' : tags.map(t => t.name).join('，')
        }

        beautify(string: string) {
            const now = dayjs()
            const day = dayjs(string)
            if (day.isSame(now, 'day')) {
                return '今天'
            } else if (day.isSame(now.subtract(1, 'day'), 'day')) {
                return '昨天'
            } else if (day.isSame(now.subtract(2, 'day'), 'day')) {
                return '前天'
            } else if (day.isSame(now, 'year')) {
                return day.format('M月D日')
            } else {
                return day.format('YYYY年M月D日')
            }
            // const d = new Date(Date.parse(string))
            // const y = d.getFullYear()
            // const m = d.getMonth()
            // const dd = d.getDay()
            // const now = new Date()
            // if (now.getFullYear() === y && now.getMonth() === m &&
            //     now.getDate() === dd) {
            //     return '今天'
            // }
        }

        get recordList() {
            return (this.$store.state as RootState).recordList
        }

        get groupedList() {
            const {recordList} = this
            const newList = clone(recordList)
                .filter(r => r.type === this.type)
                .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
            if (newList.length === 0) {return [] as Result}
            type Result = { title?: string; total?: number; items: RecordItem[] }[]
            const result: Result = [{title: dayjs(newList[0].createdAt).format('YYYY-MM-DD'), items: [newList[0]]}]
            for (let i = 1; i < newList.length; i++) {
                const current = newList[i]
                const last = result[result.length - 1]
                if (dayjs(last.title).isSame(dayjs(current.createdAt), 'day')) {
                    last.items.push(current)
                } else {
                    result.push({title: dayjs(current.createdAt).format('YYYY-MM-DD'), items: [current]})
                }

            }
            result.map(group => {
                group.total = group.items.reduce((sum, item) => sum + item.amount, 0)
            })
            return result
        }

        beforeCreate() {
            this.$store.commit('fetchRecords')
        }

        type = '-'
        recordTypeList = recordTypeList
    }
</script>

<style scoped lang="scss">
    .noResult {
        padding: 16px;
        text-align: center;
    }

    ::v-deep {
        .type-tabs-item { //::v-deep或/deep/可以影响外部传到里面的组件

            &.selected {

                &::after {
                    width: 60%;
                    height: 2px;
                    background: #333;
                    transform: translateX(16px)translateY(-10px);

                }
            }
        }

        .interval-tabs-item {
            /*height: 45px;*/
        }
    }

    %item {
        padding: 8px 16px;
        line-height: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        @extend %item
    }

    .record {
        background: white;
        @extend %item
    }

    .note {
        margin-right: auto;
        margin-left: 16px;
        color: #999;
    }
</style>