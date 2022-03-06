<template>
  <div class="main">
    <el-menu
        class="el-menu-vertical-demo"
        default-active="1"
    >
      <el-menu-item index="1">
        <router-link to="/discoverMusic">
          发现音乐
        </router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/blog">
          博客
        </router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="/mv">
          视频
        </router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/follow">
          关注
        </router-link>
      </el-menu-item>
      <el-menu-item index="5">
        <router-link to="/live">
          直播
        </router-link>
      </el-menu-item>
      <el-menu-item index="6">
        <router-link to="/personalFM">
          私人FM
        </router-link>
      </el-menu-item>
      <!--? 我的音乐 -->
      <p>我的音乐</p>
      <el-menu-item index="7">
        <router-link to="/my/localDownload">
          本地与下载
        </router-link>
      </el-menu-item>
      <el-menu-item index="8">
        <router-link to="/my/recentPlay">
          最近播放
        </router-link>
      </el-menu-item>
      <el-menu-item index="9">
        <router-link to="/my/myMusicCloud">
          我的音乐云盘
        </router-link>
      </el-menu-item>
      <el-menu-item index="10">
        <router-link to="/my/myBlog">
          我的博客
        </router-link>
      </el-menu-item>
      <el-menu-item index="11">
        <router-link to="/my/myCollection">
          我的收藏
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "NavMenu"
}
</script>

<style scoped lang="less">
.main {
  min-width: 180px;
  min-height: 550px;

  .router-link-active {
    height: 30px;
    line-height: 35px;
    background: #f6f6f7;
    border-radius: 5px;
    font-weight: bold;
    padding: 5px 7px;
  }

  li {
    height: 40px;
  }

  li:hover {
    background: #f6f6f7;
  }

  a {
    display: block;
    width: 100%;
    height: 80%;
    letter-spacing: .2em;
  }

  p {
    color: #9f9f9f;
    font-size: 13px;
    margin: 10px 15px;
  }
}

</style>