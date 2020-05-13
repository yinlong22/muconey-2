import Vue from 'vue'
import Vuex from 'vuex'
import clone from '@/lib/clone'
import createId from '@/lib/createId'

Vue.use(Vuex)//把 store 帮到vue.prototype.$store=store

const store = new Vuex.Store({
    state: {
        recordList: [],
        tagList: [],
        currentTag: undefined,
    } as RootState,//data
    mutations: {//methods
        removeTag(state, id: string) {
            let index = -1
            for (let i = 0; i < state.tagList.length; i++) {
                if (state.tagList[i].id === id) {
                    index = i
                    break
                }
            }
            state.tagList.splice(index, 1)
            store.commit('saveTags')
        },
        updateTag(state, payload: { id: string; name: string }) {
            const {id, name} = payload
            const idList = state.tagList.map(item => item.id)
            if (idList.indexOf(id) >= 0) {
                const names = state.tagList.map(item => item.name)
                if (names.indexOf(name) >= 0) {
                    window.alert('标签名重复了')
                } else {
                    const tag = state.tagList.filter(item => item.id === id)[0]
                    tag.name = name
                    store.commit('saveTags')
                }
            } else {
                return 'not found'
            }
        },
        setCurrentTag(state, id: string) {
            state.currentTag = state.tagList.filter(t => t.id === id)[0]
        },
        fetchRecords(state) {
            state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[]
        },
        createRecord(state, record: RecordItem) {
            const record2 = clone(record)
            record2.createdAt = new Date().toISOString()
            state.recordList.push(record2)
            store.commit('saveRecords')
            // recordStore.saveRecords()
        },
        saveRecords(state) {
            window.localStorage.setItem('recordList', JSON.stringify(state.recordList))
        },
        fetchTags(state) {
            state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]')
            if (!state.tagList || state.tagList.length === 0) {
                store.commit('createTag', '其他')
                store.commit('createTag', '餐饮')
                store.commit('createTag', '外卖')
                store.commit('createTag', '食材')
                store.commit('createTag', '零食')
                store.commit('createTag', '购物')
                store.commit('createTag', '衣服')
                store.commit('createTag', '化妆')
                store.commit('createTag', '交通')
                store.commit('createTag', '游戏')
                store.commit('createTag', '电影')
                store.commit('createTag', '运动')
                store.commit('createTag', '医药')
                store.commit('createTag', '水务')
                store.commit('createTag', '话费')
                store.commit('createTag', '红包')
                store.commit('createTag', '工作')
                store.commit('createTag', '投资')

            }
        },
        createTag(state, name: string) {
            const names = state.tagList.map(item => item.name)
            if (names.indexOf(name) >= 0) {
                window.alert('标签名重复了')
            } else {
                const id = createId().toString()
                state.tagList.push({id, name: name})
                store.commit('saveTags')
            }
        },
        saveTags(state) {
            window.localStorage.setItem('tagList', JSON.stringify(state.tagList))
        },
    }
})

export default store
