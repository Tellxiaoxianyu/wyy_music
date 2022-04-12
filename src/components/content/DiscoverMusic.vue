<template>
  <div>
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
        <router-link to="/discoverMusic/singer">
          最新音乐
        </router-link>
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "DiscoverMusic",
  data() {
    return {
      activeIndex: '1',
    }
  },
  methods: {
    // 页面跳转
    changePage(event) {
      switch (true) {
        case event.index == 1:
          this.activeIndex = "1";
          this.$router.push('/discoverMusic/recommend');
          break;
        case event.index == "2":
          this.$router.push('/discoverMusic/customization');
          break;
        case event.index == "3":
          this.$router.push('/discoverMusic/songList');
          break;
        case event.index == 4:
          this.$router.push('/discoverMusic/rankingList');
          break;
        case event.index == 5:
          this.$router.push('/discoverMusic/singer');
          break;
        case event.index == 6:
          this.$router.push('/discoverMusic/newMusic');
      }
    }
  },
  watch: {
    // 用于监听页面跳转
    activeIndex: {
      deep: true,
      handler() {
        //置空
      }
    }
  },
  mounted() {
    // 获取recommend组件的activeIndex值
    this.$bus.$on('toList', (data) => {
      this.activeIndex = data
    })
  }
}
</script>

<style scoped>
.el-menu-item.is-active {
  font-size: 20px;
  color: black !important;
  font-weight: bold;
}
</style>