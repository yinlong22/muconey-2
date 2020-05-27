<template>
    <ul class="tabs" :class="{[classPrefix+'-tabs']:classPrefix}">
        <li v-for="item in dataSource" :key="item.value"
            class="tabs-item" :style="{height:height}"
            :class="liClass(item)" @click="select(item)">
            {{item.text}}
        </li>
    </ul>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'

    type DataSourceItem = { text: string; value: string }

    @Component
    export default class Tabs extends Vue {
        @Prop({required: true, type: Array})
        dataSource!: DataSourceItem[]
        @Prop({type: String, default: '58px'})
        height!: string
        @Prop(String) readonly value!: string
        @Prop(String) classPrefix?: string

        liClass(item: DataSourceItem) {
            return {
                [this.classPrefix + '-tabs-item']: this.classPrefix,
                selected: item.value === this.value
            }
        }

        select(item: DataSourceItem) {
            this.$emit('update:value', item.value)
        }
    }

</script>

<style lang="scss" scoped>
    .tabs {
        background: gold;
        display: flex;
        text-align: center;
        font-size: 18px;
        align-items: center;
        justify-content: center;
        color: #333;

        &-item { //异己选择器 优先级较低
            width: 26%;
            /*height: 65px;*/
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translate(0,10px);
            position: relative;

            &.selected::after { //选中后的效果
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                justify-content: center;
                align-items: center;
                width: 4em;
                height: 2px;
                background: #333;
                transform: translateX(13px)translateY(-10px);
            }
        }
    }
</style>