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
            <router-link to="labels">---管理标签</router-link>
        </div>
        <ul class="current">
            <li v-for="tag in tagList" :key="tag.id"
                :class="{selected: selectedTags.indexOf(tag)>=0}"
                @click="toggle(tag)">
                 <span class="tmd" v-if="tag.name==='其他'">
                    <Icon name="其他"/>
                </span>
                <span class="tmd" v-if="tag.name==='餐饮'">
                    <Icon name="餐饮"/>
                </span> <span class="tmd" v-if="tag.name==='外卖'">
                    <Icon name="外卖"/>
                </span> <span class="tmd" v-if="tag.name==='食材'">
                    <Icon name="食材"/>
                </span> <span class="tmd" v-if="tag.name==='零食'">
                    <Icon name="零食"/>
                </span> <span class="tmd" v-if="tag.name==='购物'">
                    <Icon name="购物"/>
                </span> <span class="tmd" v-if="tag.name==='衣服'">
                    <Icon name="衣服"/>
                </span> <span class="tmd" v-if="tag.name==='化妆'">
                    <Icon name="化妆"/>
                </span> <span class="tmd" v-if="tag.name==='交通'">
                    <Icon name="交通"/>
                </span> <span class="tmd" v-if="tag.name==='住宿'">
                    <Icon name="住宿"/>
                </span>
                <span class="tmd" v-if="tag.name==='游戏'">
                    <Icon name="游戏"/>
                </span>
                <span class="tmd" v-if="tag.name==='电影'">
                    <Icon name="电影"/>
                </span> <span class="tmd" v-if="tag.name==='运动'">
                    <Icon name="运动"/>
                </span> <span class="tmd" v-if="tag.name==='医药'">
                    <Icon name="医药"/>
                </span> <span class="tmd" v-if="tag.name==='水务'">
                    <Icon name="水务"/>
                </span>
                <span class="tmd" v-if="tag.name==='话费'">
                    <Icon name="话费"/>
                </span><span class="tmd" v-if="tag.name==='工作'">
                    <Icon name="工作"/>
                </span><span class="tmd" v-if="tag.name==='投资'">
                    <Icon name="投资"/>
                </span>
                <span class="tmd" v-if="tag.name==='投资'">
                    <Icon name="投资"/>
                </span>
                <span class="tmd" v-if="tag.name==='红包'">
                    <Icon name="红包"/>
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
            } else {
                this.selectedTags.push(tag)//点击后执行这个函数，当选中后，tag会被push到selectedTags上
            }
            this.$emit('update:value', this.selectedTags)
        }
    }
</script>

<style lang="scss" scoped>
    .tags {
        background: white;
        flex-grow: 1;
        font-size: 16px;
        padding: 16px;
        display: flex;

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
                    transform: translateY(-8px);
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