import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export class TagHelper extends Vue {
    createTag() {
        window.alert('亲，用原来的标签更好看哦')
        const name = window.prompt('请输入标签名')
        if (!name) {return window.alert('标签名不能为空')}
        this.$store.commit('createTag', name)
    }
}

export default TagHelper