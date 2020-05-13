<template>
    <div class="numberPad">
        <div class="output">{{output}}</div>
        <div class="buttons">
            <button class="btn" @click="inputContent">1</button>
            <button class="btn" @click="inputContent">2</button>
            <button class="btn" @click="inputContent">3</button>
            <button class="btn" id="btn1" @click="remove"><Icon name="退格"/></button>
            <button class="btn" @click="inputContent">4</button>
            <button class="btn" @click="inputContent">5</button>
            <button class="btn" @click="inputContent">6</button>
            <button class="btn" @click="clear">清空</button>
            <button class="btn" @click="inputContent">7</button>
            <button class="btn" @click="inputContent">8</button>
            <button class="btn" @click="inputContent">9</button>
            <button class="btn" @click="ok" id="ok">OK</button>
            <button class="btn" @click="inputContent" id="zero">0</button>
            <button class="btn" @click="inputContent"><strong>.</strong></button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'

    @Component
    export default class NumberPad extends Vue {
        // output = '0'  /有.sync了，在Money里初始化数据
        @Prop(Number) readonly value!: number
        output = this.value.toString()

        inputContent(event: MouseEvent) {//传的的参数为点击事件的参数
            const button = (event.target as HTMLButtonElement)//强制将这个event.target改为按钮事件
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const input = button.textContent! //!排除input为空的情况
            if (this.output.length === 16) {
                return
            }
            if (this.output === '0') {
                if ('0123456789'.indexOf(input) >= 0) {
                    this.output = input
                } else {
                    this.output += input
                }
                return
            }
            //如果output的.大于0或者输入· 就拜拜
            if (this.output.indexOf('.') >= 0 && input === '.') {
                return
            }
            this.output += input
        }

        remove() {
            if (this.output.length === 1) {
                this.output = '0'
            } else {
                this.output = this.output.slice(0, -1)
            }
        }

        clear() {
            this.output = '0'
        }

        ok() {
            const number=parseFloat(this.output)
            this.$emit('update:value',number)
            this.$emit('submit', number)
            this.output = '0'
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/assets/style/reset.scss";

    .numberPad {
        .output {
            @extend %clearFix;
            @extend %innerShadow;
            font-size: 24px;
            font-family: Consolas, monospace; //monospace等宽字体
            padding: 3px 16px;
            margin-right: 6px;
            text-align: right;
            height: 36px;
        }
        #btn1{
            font-size: 26px;
        }
        .buttons {
            @extend %clearFix; //如果子元素用到了float布局，父元素必须加上clearFix属性
            > button {
                float: left;
                width: 25%;
                height: 7vh;
                background: transparent;
                border: none;

                &#ok {
                    height: 14vh;
                    float: right;
                }

                &.btn:active {
                    background: rosybrown;

                }

                &#zero {
                    width: 25*2%;
                }

                $bg: #f2f2f2;

                &:nth-child(1) {
                    background: $bg;
                }

                &:nth-child(2), &:nth-child(5) {
                    background: darken($bg, 4%);
                }

                &:nth-child(3), &:nth-child(6), &:nth-child(9) {
                    background: darken($bg, 4*2%);
                }

                &:nth-child(4), &:nth-child(7), &:nth-child(10) {
                    background: darken($bg, 4*3%);
                }

                &:nth-child(8), &:nth-child(11), &:nth-child(13) {
                    background: darken($bg, 4*4%);
                }

                &:nth-child(14) {
                    background: darken($bg, 4*5%);
                }

                &:nth-child(12) {
                    background: darken($bg, 4*6%);
                }
            }
        }
    }
</style>