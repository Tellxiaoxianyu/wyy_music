<template>
  <div class="discover_container">
    <el-container>
      <el-header>
        <el-menu default-active="1"
                class="el-menu-demo"
                mode="horizontal"
                active-text-color="red">
          <el-menu-item index="1">
            <router-link to="/discoverMusic">
              个性推荐
            </router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link to="/discoverMusic/customization">
              专属定制
            </router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/discoverMusic/songList">
              歌单
            </router-link>
          </el-menu-item>
          <el-menu-item index="4">
            <router-link to="/discoverMusic/rankingList">
              排行榜
            </router-link>
          </el-menu-item>
          <el-menu-item index="5">
            <router-link to="/discoverMusic/singer">
              歌手
            </router-link>
          </el-menu-item>
          <el-menu-item index="6">
            <router-link to="/discoverMusic/newMusic">
              最新音乐
            </router-link>
          </el-menu-item>
        </el-menu>
        <router-view></router-view>
      </el-header>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "DiscoverMusic",
}
</script>

<style scoped>
.is-active{
  color: var(--active-color) !important;
  border-bottom: 2px solid var(--active-color) !important;
}
.el-menu-item.is-active {
  font-size: 20px;
  color: black !important;
  font-weight: bold;
}
.discover_container{
  overflow-y: scroll;
  width: 100%;
  height: calc(100vh - 180px);
}
</style>