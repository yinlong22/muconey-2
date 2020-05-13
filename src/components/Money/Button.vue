<template>
    <button @click="$emit('click',$event)">
        <slot/>
    </button>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'

    @Component
    export default class Button extends Vue {

    }
</script>

<style lang="scss" scoped>
    .button {
        background: red;
        color: whitesmoke;
        border-radius: 6px;
        border: none;
        height: 36px;
        padding: 0 16px;
    }
</style>