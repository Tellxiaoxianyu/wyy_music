import Vue from 'vue'
import Vuex from 'vuex'
import { mutations } from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        routeId:0,//路由id
        uid: 0,//歌单id
        lyric:[],//歌词
        theme_color:'#fff',//全局颜色
    },
    mutations,
})

export default store