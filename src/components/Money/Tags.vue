<template>
    <div class="tags">
        <div class="new">
            <div class="zhaopai">
                <div class="zhaopai2">
                    <Icon name="欢迎页"/>
                </div>
                <div>M</div>
                <div>U</div>
                <div>C</div>
                <div>O</div>
                <div>N</div>
                <div>E</div>
                <div>Y</div>
            </div>
            <!--            <button @click="createTag">管理标签</button>-->
            <router-link to="labels">--
                <div>管</div>
                <div>理</div>
                <div>标</div>
                <div>签</div>
            </router-link>
        </div>
        <ul class="current">
            <li v-for="tag in tagList" :key="tag.id"
                :class="{selected: selectedTags.indexOf(tag)>=0
                &&selectedTags.indexOf(tag)<1}"
                @click="toggle(tag)">
                 <span class="tmd" v-if="tag.name">
                    <Icon :name="tag.name"/>
                </span>
                <span class="tmd2">{{tag.name}}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator'
    import {mixins} from 'vue-class-component'
    import TagHelper from '@/mixins/TagHelper'

    @Component({})
    export default class Tags extends mixins(TagHelper) {
        selectedTags: string[] = []

        get tagList() {
            return this.$store.state.tagList
        }

        created() {
            this.$store.commit('fetchTags')
        }

        toggle(tag: string) {
            const index = this.selectedTags.indexOf(tag)
            if (index >= 0) {
                this.selectedTags.splice(index, 1)
            }
            else{
                this.selectedTags.splice(index, 1)
                this.selectedTags.push(tag)//点击后执行这个函数，当选中后，tag会被push到selectedTags上
            }
            this.$emit('update:value', this.selectedTags)
        }
    }
</script>

<style lang="scss" scoped>
    .tags {
        background: white;
        height: 49vh;
        font-size: 16px;
        padding: 16px;
        display: flex;
        overflow-y: scroll;

        > .current {
            overflow: scroll;
            display: flex;
            flex-wrap: wrap;

            > li {
                box-sizing: border-box;
                position: relative;
                height: 62px;
                width: 20%;
                padding: 0 30px;
                margin-right: 12px;
                margin-top: 10px;
                justify-content: space-between;

                > .tmd {
                    justify-content: center;
                    text-align: center;
                    align-items: center;
                    position: absolute;
                    font-size: 39px;
                    transform: translate(-1px, -9px);
                }

                > .tmd2 {
                    position: absolute;
                    font-size: 13px;
                    transform: translateY(42px) translateX(5px);
                }

                &.selected {
                    color: orangered;
                }
            }
        }

        > .new {
            padding-top: 16px;
            margin-left: -8px;
        }
    }

    .zhaopai {
        margin-top: -10px;
        margin-bottom: 36px;
        color: deeppink;

        > .zhaopai2 {
            font-size: 22px;
            color: red;
            transform: translateX(-4px);
        }
    }

</style>