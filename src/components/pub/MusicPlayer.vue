<template>
  <div class="main">
    <audio :src="url" controls @canplay="getDuration" @timeupdate="updateTime" ref="audio"></audio>
    <el-row :gutter="24">
      <el-col :span="6" v-show="hasSong">
        <div class="main_left">
          <img :src="info.al.picUrl" alt="">
          <div class="info">
            <div class="singer">
              <p>{{ info.name }}</p>
              <i class="iconfont icon-xihuan1"></i>
            </div>
            <p>{{ info.ar[0].name }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div :class="['music_player',hasSong?'':'cent']">
          <div class="player_top">
            <i class="iconfont icon-icon-test"></i>
            <i class="iconfont icon-shangyishou"></i>
            <i class="iconfont icon-zanting1 stop"></i>
            <i class="iconfont icon-xiayishou"></i>
            <i class="iconfont icon-gedan"></i>
          </div>
          <div class="player_bottom">
            <span>00:00</span>
            <div class="line">
              <div class="last"></div>
              <div class="bot"></div>
            </div>
            <span>{{ info.dt }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" v-show="hasSong">
        <div class="main_right">
          <div class="level">极高</div>
          <i class="iconfont icon-24gl-volumeZero"></i>
          <i class="iconfont icon-haoyou"></i>
          <i class="iconfont icon-qukuchaxun"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  data() {
    return {
      duration:'',
      currentTime:'',
      //?判断是否有音乐在播放
      hasSong: false,
      url: "",
      info: {
        name: '',
        al: {
          picUrl: ''
        },
        ar: [{
          name: ''
        }],
        dt: ''
      }
    }
  },
  methods: {
    getDuration() {
      console.log(this.$refs.audio.duration);
      this.duration = this.$refs.audio.duration
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    }
  },
  watch: {
    currentSong() {  //监听正在播放的歌曲改变
      this.$nextTick(() => {
        this.$refs.audio.play();
        console.log(this.$refs.audio.duration); //此时duration为NaN
      })
    },
  },
  mounted() {
    this.$bus.$on('getSongUrl', (val) => {
      console.log('控制器url', val);
      this.url = val.url
    })
    this.$bus.$on('getSongInfo', (val) => {
      console.log('控制器Info', val);
      this.info = val
      this.hasSong = true
    })
  }
}
</script>

<style scoped lang="less">
.main {
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #d9d9da;
  background: #fff;
  width: 100%;
  height: 90px;
  padding-top: 10px;

  //?歌手信息
  .main_left {
    display: flex;
    margin-left: 10px;

    img {
      width: 70px;
      height: 70px;
      border-radius: 10px;
      margin-right: 10px;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .singer {
        width: 300px;
        line-height: 20px;
        display: flex;

        p {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 7px;
          margin-right: 10px;
        }
      }

      & > p:nth-child(2) {
        font-size: 12px;
      }
    }
  }

  //?播放器
  .music_player {
    margin: 0 auto;

    .player_top {
      display: flex;
      justify-content: center;
      justify-items: center;

      .iconfont {
        font-size: 20px;
        margin: 5px 30px 0;
      }

      .stop {
        font-size: 35px;
        color: #f4f4f4;
        background: #000;
        border-radius: 50%;
        margin-top: -1px;
      }
    }

    .player_bottom {
      display: flex;
      justify-content: center;
      margin-top: 25px;
      line-height: 3px;

      .line {
        width: 700px;
        height: 3px;
        background: #9f9f9f;
        margin: 0 4px;
        display: flex;

        .last {
          width: 100px;
          height: 3px;
          background: #ec4141;
        }

        .bot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ec4141;
          margin-top: -3px;
        }
      }

      span {
        color: #9f9f9f;
        font-size: 13px;
      }
    }
  }

  .cent {
    width: 100vw;
    user-select: none;
    opacity: .5;
  }

  //?其他
  .main_right {
    display: flex;
    justify-content: space-around;
    justify-items: center;
    margin-top: 20px;

    .iconfont {
      font-size: 20px;
    }

    .level {
      font-size: 12px;
      color: #ed5050;
      border: 1px solid #ed5050;
      padding: 1px 3px;
    }
  }
}
</style>