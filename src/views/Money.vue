<template>
    <Layout class-prefix="layout" id="all">
        <NumberPad :value.sync="record.amount" @submit="saveRecord"/>
        <div class="notes">
            <Icon class="notes-svg" name="备注"/>
            <FormItem field-name="备注" :value.sync="record.notes"
                      placeholder="可以写点东西吖~"/>
        </div>
        <Tags @update:value="record.tags=$event"/>
        <Tabs :data-source="recordTypeList"
              :value.sync="record.type"
        />
    </Layout>
</template>

<script lang="ts">
    // import Nav from '@/components/Nav.vue'
    import Vue from 'vue'
    import NumberPad from '@/components/Money/NumberPad.vue'
    import FormItem from '@/components/Money/FormItem.vue'
    import Tags from '@/components/Money/Tags.vue'
    import {Component} from 'vue-property-decorator'
    import Tabs from '@/components/Tabs.vue'
    import recordTypeList from '@/constants/recordTypeList'


    // const model = require('@/model.js').model

    // const version = window.localStorage.getItem('version') || '0'
    // if (version === '0.0.1') {//数据库升级，数据迁徙
    //     store.recordList.forEach(record => {
    //         record.createdAt = new Date(2020, 0, 1)
    //     })
    //     window.localStorage.setItem('recordList', JSON.stringify(store.recordList))// 保存数据
    // } else
    //     window.localStorage.setItem('version', '0.0.2')
    // 重置数据库版本

    @Component({
        components: {Tabs, Tags, FormItem, NumberPad},
    })
    export default class Money extends Vue {
        get recordList() {
            return this.$store.state.count
        }

        recordTypeList = recordTypeList
        record: RecordItem = {tags: [], notes: '', type: '-', amount: 0}

        created() {
            this.$store.commit('fetchRecords')
        }

        saveRecord() {
            if (!this.record.tags || this.record.tags.length === 0) {
                return window.alert('请至少选择一个标签')
            }
            this.$store.commit('createRecord', this.record)
            this.record.notes=''
        }
    }
</script>

<style lang="scss">
    //空格.是tags里面的，没有.是当前tags
    #all{
        height: 100vh;
    }
    .layout-content {
        display: flex;
        flex-direction: column-reverse
    }

    .notes {
        padding-left: 10px;
        display: flex;
        background:snow;


    > .notes-svg {

        transform: translateY(12px);
       }
    }
</style>