<template>
  <div id="app">
    <Top class="top"></Top>
    <div class="nav">
      <el-row :gutter="10">
        <el-col :span="5" :lg="3">
          <NavMenu></NavMenu>
        </el-col>
        <el-col :span="6">
          <div class="context">
            <router-view></router-view>
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
  components: {
    Top,
    NavMenu,
    MusicPlayer
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
  overflow: hidden;
  .nav {

    .context{
      min-width: 600px;
    }
  }

  .top {
    z-index: 99;
  }
  .down{
    z-index: 99;
  }
}

</style>
