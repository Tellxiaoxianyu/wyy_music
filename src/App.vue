<template>
  <div id="app">
    <Top class="top"></Top>
    <div class="nav">
      <el-row>
        <el-col :span="5" :lg="4">
          <NavMenu class="menu" @routerRefresh="routerRefresh"></NavMenu>
        </el-col>
        <el-col :span="19" :lg="20">
          <div class="context">
            <router-view v-if="routerAlive"></router-view>
          </div>
        </el-col>
      </el-row>
    </div>
    <MusicPlayer class="down"></MusicPlayer>
  </div>
</template>

<script>
import Top from "@/components/pub/Top";
import NavMenu from "@/components/pub/NavMenu";
import MusicPlayer from "@/components/pub/MusicPlayer";

export default {
  name: 'App',
  data() {
    return {
      routerAlive: true,
      islogin: false,
      theme_color:''
    }
  },
  components: {
    Top,
    NavMenu,
    MusicPlayer
  },
  methods: {
    routerRefresh() {
      this.routerAlive = false;
      this.$nextTick(() => {
        this.routerAlive = true;
      });
    }
  },
  mounted() {
    if (localStorage.getItem('themeColor')&&localStorage.getItem('activateColor')){
      document.querySelector('body').style.setProperty('--theme-color',
          localStorage.getItem('themeColor'))
      document.querySelector('body').style.setProperty('--active-color',
          localStorage.getItem('activateColor'))
    }else {
      document.querySelector('body').style.setProperty('--theme-color','#f5f5f5')
      document.querySelector('body').style.setProperty('--active-color','#ec4141')
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

body {
  --Cfff: '#f5f5f5';
  --Cff5c8a: '#ff5c8a';
  --Cff7a9e: '#ff7a9e';
  --C717ff9: '#717ff9';
  --C4791eb: '#4791eb';
  --C39afea: '#39afea';
  --C2bb669: '#2bb669';
  --C6acc19: '#6acc19';
  --Ce2ab12: '#e2ab12';
  --Cff8f57: '#ff8f57';
  --Cfd726d: '#fd726d';
  --Cfd544e: '#fd544e';
  --theme-color:'#f5f5f5';
  --active-color:'#ec4141';
}

a {
  text-decoration: none;
  color: #000;
}

ul {
  list-style: none;
}

input {
  background: none;
  outline: none;
  border: none;
}

input:focus {
  border: none;
}

.el-loading-spinner .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
  display: none;
}

.el-loading-spinner {
  background: url("assets/images/loading.gif") no-repeat;
  background-size: 48px 48px;
  width: 100%;
  height: 100%;
  position: relative;
  top: 50%;
  left: 50%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}

::-webkit-scrollbar { /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  border-radius: 10px;
  background: #535353;
}

::-webkit-scrollbar-track { /*滚动条里面轨道*/
  border-radius: 10px;
  background: #EDEDED;
}

.confirm {
  background: var(--active-color) !important;
  border: 1px solid var(--active-color) !important;
}

#app {
  min-width: 900px;
  width: 100%;

  .nav {
    min-width: 900px;
    width: 100%;
    overflow-y: hidden;

    .menu {
      height: calc(100vh - 160px);
      overflow-y: scroll;
    }

    .context {
      //width: 100vw;
      height: calc(100vh - 160px);
      //overflow-y: scroll;
    }
  }

  .top {
    z-index: 98;
  }

  .down {
    z-index: 98;
    min-width: 800px;
  }

}

.el-popover {
  height: 100px;
  min-width: 20px !important;
  width: 20px !important;
}

.el-slider__runway {
  margin-left: 7px !important;
}

.el-slider__bar {
  background-color: var(--active-color) !important;
}

.el-slider__button {
  border: 2px solid var(--active-color) !important;
}

.el-tooltip__popper {
  margin-left: -10px;
}

.current-row {
  background-color: #fff !important;
  color: var(--active-color) !important;
}
</style>
