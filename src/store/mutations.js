const mutations =  {
    setRouteId(state, payload){
        state.routeId = payload
    },
    getUid(state, payload) {
        state.uid = payload.uid
    },
    setLyric(state, payload){
        state.lyric = payload
    },
    setColor(state, payload){
        console.log('改了颜色'+payload)
        state.theme_color = payload
        if (payload=='#fff'){
            document.querySelector('body').style.setProperty('--theme-color','#f5f5f5')
            document.querySelector('body').style.setProperty('--active-color','#ec4141')
            localStorage.setItem('themeColor','#f5f5f5')
            localStorage.setItem('activateColor','#ec4141')
        }else {
            document.querySelector('body').style.setProperty('--theme-color',payload)
            document.querySelector('body').style.setProperty('--active-color',payload)
            localStorage.setItem('themeColor',payload)
            localStorage.setItem('activateColor',payload)
        }
    },
}
export {
    mutations
}