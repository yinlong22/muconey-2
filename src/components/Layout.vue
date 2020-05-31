<template>
    <div class="layout-wrapper" :class="classPrefix&&`${classPrefix}-wrapper`">
        <div class="content" :class="classPrefix&&`${classPrefix}-content` ">
            <!--     插槽slot：用户在layout内传进来的-->
            <slot/>
        </div>
        <Nav/>
    </div>
</template>

<script lang="ts">
    export default {
        props: ['classPrefix'],//在content容器里绑定一个ClassPrefix属性，外部传一个classPrefix='xxx'数据时，xxx属性就会绑定到content里
        name: 'Layout'
    }
</script>

<style lang="scss" scoped>
    .layout-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content {
        overflow: auto;
        flex-grow: 1; //尽量把所有高度给content
    }
</style>