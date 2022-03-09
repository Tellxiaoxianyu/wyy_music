<template>
  <div id="app">
    <Top class="top"></Top>
    <div class="nav">
      <el-row :gutter="15">
        <el-col :span="5" :lg="3">
          <NavMenu class="menu" @routerRefresh="routerRefresh"></NavMenu>
        </el-col>
        <el-col :span="10">
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
      routerAlive:true
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

input {
  background: none;
  outline: none;
  border: none;
}

input:focus {
  border: none;
}

#app {
  min-width: 900px;
  width: 100%;

  .nav {
    min-width: 900px;
    width: 100%;
    overflow: hidden;
    .menu{
      height: calc(100vh - 100px);
      overflow-y: scroll;
    }
    .context {
      width: 100vw;
      height: calc(100vh - 100px);
      overflow-y: scroll;
    }
  }

  .top {
    z-index: 99;
  }

  .down {
    z-index: 98;
    min-width: 800px;
  }
}

</style>
