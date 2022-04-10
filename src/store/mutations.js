const mutations =  {
    getUid(state, payload) {
        state.uid = payload.uid
    },
    setLyric(state, payload){
        state.lyric = payload
    }
}
export {
    mutations
}