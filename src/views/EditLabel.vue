<template>
    <Layout>
        <div class="navBar">
            <router-link to="/labels">
                <Icon class="leftIcon" name="left"/>
            </router-link>
            <span>编辑标签</span>
            <span class="rightItem"/>
        </div>
        <div class="form-wrapper">
            <FormItem :value="currentTag.name"
                      @update:value="update"
                      field-name="标签名" placeholder="请输入标签名"/>
        </div>
        <div class="button-wrapper">
            <router-link to="/labels">
                <Button class="button" @click="remove">删除标签</Button>
            </router-link>
        </div>
    </Layout>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import FormItem from '@/components/Money/FormItem.vue'
    import Button from '@/components/Money/Button.vue'

    @Component({
        components: {FormItem, Button},
    })
    export default class EditLabel extends Vue {
        get currentTag() {
            return this.$store.state.currentTag
        }

        created() {
            const id = this.$route.params.id
            this.$store.commit('fetchTags')
            this.$store.commit('setCurrentTag', id)
            //params可以拿到route里所有的参数
            if (!this.currentTag) {
                this.$router.replace('/404')
            }
        }

        update(name: string) {
            if (this.currentTag) {
                this.$store.commit('updateTag', {id: this.currentTag.id, name})
            }
        }

        remove() {
            if (this.currentTag) {
                this.$store.commit('removeTag', this.currentTag.id)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navBar {
        text-align: center;
        font-size: 19px;
        padding: 13px 16px;
        background: white;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > .title {

        }

        .leftIcon {
            color: brown;
            width: 25px;
            height: 25px;
        }

        .rightItem {
            width: 25px;
            height: 25px;
        }
    }

    .form-wrapper {
        background: white;
        margin-top: 9px;
    }

    .button-wrapper {
        text-align: center;
        padding: 18px;
        margin-top: 36px;
    }
</style>