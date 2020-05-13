<template>
    <svg class="icon" @click="$emit('click',$event)">
        <!--      引用时 用use标签-->
        <use :xlink:href="'#'+name"/>
        <!--      ↑ ↑简写<use v-bind:xlink:href="name"/>-->
    </svg>
</template>

<script lang="ts">
    // import x from '@/assets/icons/label.svg' /先导入
    // import y from '@/assets/icons/money.svg'
    // import z from '@/assets/icons/statistics.svg'
    // console.log(x) /然后svg loader会自动打印出来symbol标签并放在body里，最后会把标签包在svg标签里
    // console.log(y)
    // console.log(z)
    //下面的代码能解决以上代码重复的问题 ↓ ↓
    const importAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().forEach(requireContext)
    try {
        importAll(require.context('../assets/icons', true, /\.svg$/))
    } catch (error) {
        console.log(error)
    }
    //require.content意思是指定在那个目录搜索。将一个目录的.svg文件引入到当前文件
    export default {
        props: ['name'],
        name: 'Icon'
    }
</script>

<style lang="scss" scoped>
 .icon{
     width: 1em;
     height: 1em;
     vertical-align: -0.15em;
     fill: currentColor;
     overflow: hidden;
 }
</style>