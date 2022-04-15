<template>
  <div id="app">
    <Top class="top"></Top>
    <div class="nav">
      <el-row>
        <el-col :span="6" :lg="6">
          <NavMenu class="menu" @routerRefresh="routerRefresh"></NavMenu>
        </el-col>
        <el-col :span="18">
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
  data(){
    return{
      routerAlive:true,
      islogin:false
    }
  },
  components: {
    Top,
    NavMenu,
    MusicPlayer
  },
  methods:{
    routerRefresh(){
      this.routerAlive = false;
      this.$nextTick(()=>{
        this.routerAlive = true;
      });
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: #000;
}

ul{
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

.el-loading-spinner .circular{
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
  display: none;
}
.el-loading-spinner{
  background: url("assets/images/loading.gif") no-repeat;
  background-size: 48px 48px;
  width: 100%;
  height: 100%;
  position: relative;
  top: 50%;
  left: 50%;
}

::-webkit-scrollbar {/*滚动条整体样式*/
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  background: #535353;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
  border-radius: 10px;
  background: #EDEDED;
}
.confirm{
  background: #ec4141 !important;
  border: 1px solid #ec4141 !important;
}
#app {
  min-width: 900px;
  width: 100%;

  .nav {
    min-width: 900px;
    width: 100%;
    overflow-y: hidden;
    .menu{
      height: calc(100vh - 160px);
      overflow-y: scroll;
    }
    .context {
      //width: 100vw;
      height: calc(100vh - 160px);
      overflow-y: scroll;
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
.el-popover{
  height: 100px;
  min-width: 20px !important;
  width: 20px !important;
}
.el-slider__runway{
  margin-left: 7px !important;
}
.el-slider__bar{
  background-color: #ec4141 !important;
}
.el-slider__button{
   border:2px solid #ec4141 !important;
 }
.el-tooltip__popper{
  margin-left: -10px;
}
.current-row{
  background-color: #fff !important;
  color: #ec4141 !important;
}
</style>
