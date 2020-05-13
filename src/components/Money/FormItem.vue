<template>
    <label class="formItem">
        <span class="name">{{this.fieldName}}</span>
        <input type="text"
               :value="value"
               @input="onValueChanged($event.target.value)"
               :placeholder="placeholder">
        <!--        :value="value"
                    @input='value=$event.target.value' / ↓ ↓
                    当先绑定:value='你的数据'，input事件将'你的数据'赋值为$event.target.value输入值时,就可以简化为 v-module='x'-->
    </label>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'

    @Component
    export default class FormItem extends Vue {
        @Prop({default: ''}) readonly value!: string
        @Prop({required: true}) fieldName!: string
        @Prop() placeholder?: string

        onValueChanged(value: string) {
            this.$emit('update:value', value)//拿到input的值，回传给update:value
        }
    }
</script>

<style lang="scss" scoped>
    .formItem {
        font-size: 16px;
        display: flex;
        padding-left: 16px;
        align-items: center;

        .name {
            padding-right: 16px;
        }

        input {
            height: 40px;
            flex-grow: 1;
            background: transparent;
            border: none;
            padding-right: 16px;
        }
    }
</style>