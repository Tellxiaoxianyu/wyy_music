<template>
  <div class="main">

    <audio :src="url" ref="audio" @ended="endAudio" @timeupdate="getTimeupdate" @loadedmetadata="getLoadedmetadata">
      对不起,你的浏览器暂不支持audio控件
    </audio>

    <el-row>
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
            <span @click="playOrPause">
              <i class="iconfont icon-zanting2 stop" v-if="isPlaying"></i>
              <i class="iconfont icon-zantingbofang stop" v-else></i>
            </span>
            <i class="iconfont icon-xiayishou"></i>
            <i class="iconfont icon-geci"></i>
          </div>
          <div class="player_bottom">
            <span>{{ currentTimeMoment }}</span>
            <div class="line" ref="line" @click="changeTime">
              <div class="last" ref="last"
                   :style="{width: audioWidth + 'px'}"></div>
              <div class="bot" @click="changeTimeByBot" ref="dot" style="user-select: none;"></div>
            </div>
            <span>{{ durationMoment }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" v-show="hasSong">
        <div class="main_right">
          <div class="level">极高</div>
          <el-popover
              style="display: flex;justify-content: center;padding-left: -30px!important;"
              popper-class="pop"
              placement="top"
              trigger="hover">
            <el-slider
                @change="changeVoice"
                v-model="voice"
                vertical
                height="100px">
            </el-slider>
            <i class="iconfont icon-24gl-volumeZero" slot="reference"></i>
          </el-popover>
          <i class="iconfont icon-haoyou"></i>
          <i class="iconfont icon-qukuchaxun" @click="table = true"></i>
          <el-drawer
              title="当前播放"
              :visible.sync="table"
              direction="rtl"
              :modal-append-to-body="false"
              size="40%">
            <div class="song_list">
              <div class="top" style="display: flex;justify-content: space-between">
                <span style="color: #9f9f9f">总 {{ songLists.length }} 首</span>
                <span style="color: #1b7cc4">清空列表</span>
              </div>
              <el-table class="list"
                        :data="songLists"
                        stripe
                        style="width: 100%">
                <el-table-column
                    prop="name"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="singer"
                    width="150">
                </el-table-column>
                <el-table-column
                    width="90"
                    prop="time">
                </el-table-column>
              </el-table>
            </div>
          </el-drawer>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "MusicPlayer",
  data() {
    return {
      //歌曲顺序
      index: 0,
      duration: 0,
      currentTime: 0,
      //?判断是否有音乐在播放
      hasSong: false,
      isPlaying: false,
      //播放器声音
      voice: 0,
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
      },
      table: false,
      songLists: [],

      audioWidth: 0,
      audioInterval: ''
    }
  },
  methods: {
    //?开始暂停
    playOrPause() {
      this.isPlaying ? this.pauseMusic() : this.playMusic()
    },
    playMusic() {
      let audio = this.$refs.audio
      this.isPlaying = true
      audio.play()
    },
    pauseMusic() {
      this.isPlaying = false
      this.$refs.audio.pause()
    },
    getTimeupdate(e) {
      // 实时获取当前audio的currentTime
      this.currentTime = e.target.currentTime * 1000;
    },
    getLoadedmetadata(e) {
      this.duration = e.target.duration * 1000;
    },
    changeTimeByBot() {
      let line = this.$refs.line;
      let lineWidth = line.clientWidth;
      let audio = this.$refs.audio
      document.onmousemove = (e) => {
        let targetLeft = Math.floor(e.clientX - line.offsetLeft);
        // 计算点击长度百分比
        let percentage = targetLeft / lineWidth;
        if (targetLeft >= 0) {
          this.audioWidth = targetLeft
        }
        document.onmouseup = function () {
          // 设置audio的时间
          this.currentTime = (percentage * this.duration) / 1000
          audio.currentTime = this.currentTime
          this.onmousemove = null
        }
      }
    },
    changeTime(e) {
      let line = this.$refs.line;
      let audio = this.$refs.audio
      let targetLeft = Math.floor(e.clientX - line.offsetLeft);
      let lineWidth = line.clientWidth;
      // 计算点击长度百分比
      let percentage = targetLeft / lineWidth;
      if (targetLeft >= 0) {
        this.audioWidth = targetLeft
        // 设置audio的时间
        this.currentTime = (percentage * this.duration) / 1000
        audio.currentTime = this.currentTime
      }
    },
    changeVoice(val){
      let audio = this.$refs.audio
      audio.volume = val / 100
    },
    getUrl(id) {
      this.axios.get(`/song/url`, {
        params: {
          id
        }
      }).then(response => {
        this.hasSong = true
        this.isPlaying = true
        this.url = response.data.data[0].url
      }).catch(err => {
        console.log(err);
      })
    },
    endAudio() {
      this.index++
      if (this.index >= this.songLists.length) {
        console.log('重新开始')
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
    },
    setInfo(array, index) {
      this.info = {
        name: array[index].name,
        al: {
          picUrl: array[index].al.picUrl
        },
        ar: [{
          name: array[index].singer
        }],
        dt: array[index].time
      }
    }
  },
  computed: {
    currentTimeMoment() {
      return moment(this.currentTime).format("mm:ss")
    },
    durationMoment() {
      return moment(this.duration).format("mm:ss")
    }
  },
  watch: {
    currentTimeMoment() {
      let line = this.$refs.line;
      // 灰色进度条总长度 500
      let lineWidth = line.clientWidth;
      // 获取时间百分比
      let percentage = (this.currentTime / this.duration).toFixed(4) * 1;
      // 设置红色进度条长度
      this.audioWidth = lineWidth * percentage;
    }
  },
  mounted() {
    this.$bus.$on('getSongUrl', (val) => {
      // console.log('控制器url', val);
      this.url = val.url
      setTimeout(() => {
        this.playMusic()
        this.voice = this.$refs.audio.volume * 100
      }, 500)
    })
    this.$bus.$on('getSongInfo', (val) => {
      console.log('控制器Info', val);
      this.info = val
      this.hasSong = true
      this.isPlaying = true
      this.songLists.push({
        id: this.info.id,
        name: this.info.name,
        singer: this.info.ar[0].name,
        time: this.info.dt,
        picUrl: this.info.al.picUrl
      })
    })
    this.$bus.$on('songLists', (val) => {
      this.songLists = val
      this.getUrl(val[0].id)
      this.setInfo(val, 0)
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
          overflow: hidden; /*设置超出的部分进行影藏*/
          text-overflow: ellipsis; /*设置超出部分使用省略号*/
          white-space: nowrap; /*设置为单行*/
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
      }
    }

    .player_bottom {
      display: flex;
      justify-content: center;
      margin-top: 25px;
      line-height: 3px;

      span {
        user-select: none;
      }

      .line {
        cursor: pointer;
        width: 700px;
        height: 3px;
        background: #9f9f9f;
        margin: 0 15px;
        display: flex;

        .last {
          height: 3px;
          background: #ec4141;
        }

        .bot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ec4141;
          margin-top: -3px;
          margin-left: -10px;
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

    .line_voice {
      cursor: pointer;
      width: 100px;
      height: 3px;
      background: #9f9f9f;
      margin: 0 15px;
      display: flex;

      .last_voice {
        height: 3px;
        width: 100px;
        background: #ec4141;
      }
    }

    .song_list {
      padding: 30px;
    }

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