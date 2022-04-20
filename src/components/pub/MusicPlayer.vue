<template>
  <div class="main">

    <audio :src="url" ref="audio" @ended="endAudio" @timeupdate="getTimeupdate" @loadedmetadata="getLoadedmetadata">
      对不起,你的浏览器暂不支持audio控件
    </audio>
    <transition
        enter-active-class="animate__animated animate__slideInLeft"
        leave-active-class="animate__animated animate__slideOutRight">
      <Lyric class="lyric" v-if="showLyric"
             :info="toLyricInfo"
             :currentLyric="showLyric?lyric:[]"
             :time="currentTime"
             :isStart="isPlaying"></Lyric>
    </transition>

    <el-row>
      <el-col :span="6" v-show="hasSong">
        <div class="left_box box_down" ref="left_box">
          <div
              class="main_left2">
            <div class="back">
              <i class="iconfont icon-shangjiantou" @click="backSong"></i>
            </div>
          </div>
          <div
              class="main_left">
            <div class="hover_box">
              <img :src="info.al.picUrl" alt="">
              <div class="hover_over" @click="showSongLyric">
                <i class="iconfont icon-shangjiantou"></i>
              </div>
            </div>
            <div class="info">
              <div class="singer">
                <p>{{ info.name }}</p>
                <i class="iconfont icon-xihuan1"></i>
              </div>
              <p>{{ info.ar[0].name }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div :class="['music_player',hasSong?'':'cent']">
          <div class="player_top">
            <i class="iconfont icon-icon-test"></i>
            <i class="iconfont icon-shangyishou" @click="preSong"></i>
            <span @click="playOrPause">
              <i class="iconfont icon-zanting2 stop" v-if="isPlaying"></i>
              <i class="iconfont icon-zantingbofang stop" v-else></i>
            </span>
            <i class="iconfont icon-xiayishou" @click="nextSong"></i>
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
              :modal="false"
              size="30%">
            <div class="song_list">
              <div class="top" style="display: flex;justify-content: space-between">
                <span style="color: #9f9f9f">总 {{ songLists.length }} 首</span>
                <span style="color: #1b7cc4" @click="open">清空列表</span>
              </div>
              <el-table ref="songListTable"
                        class="list"
                        :data="songLists"
                        style="width: 100%"
                        @row-click="rowClick"
                        highlight-current-row
                        @current-change="handleCurrentChange">
                <el-table-column
                    prop="name"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="singer"
                    width="130">
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
import Lyric from "@/components/content/myMusic/Lyric";
export default {
  name: "MusicPlayer",
  components: {
    Lyric
  },
  data() {
    return {
      //歌曲顺序
      index: 0,
      duration: 0,
      currentTime: 0,
      lyric: [],//歌词
      showLyric:false,
      toLyricInfo:'',
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
      dialogVisible: false,
      songLists: [],
      currentRow: null,//当前选中
      audioWidth: 0,
      audioInterval: '',
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
    preSong() {
      this.index--
      if (this.index < 0) {
        this.index = 0
        this.$message('已经是第一首了噢~~~')
        console.log('已经是第一首了', this.index)
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
      this.getSongWords(this.songLists[this.index].id)
      this.toLyricInfo = this.info
      setTimeout(() => {
        this.playMusic()
      }, 500)
    },
    nextSong() {
      this.index++
      if (this.index >= this.songLists.length) {
        this.index  = this.songLists.length-1
        this.$message('没有下一首了噢~~~')
        console.log('全部播放结束', this.index)
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
      this.getSongWords(this.songLists[this.index].id)
      this.toLyricInfo = this.info
      setTimeout(() => {
        this.playMusic()
      }, 500)
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
    changeVoice(val) {
      let audio = this.$refs.audio
      audio.volume = val / 100
    },
    endAudio() {
      this.index++
      if (this.index >= this.songLists.length) {
        console.log('全部播放结束')
        this.isPlaying = false
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
      this.getSongWords(this.songLists[this.index].id)
      this.toLyricInfo = this.info
      setTimeout(() => {
        this.playMusic()
      }, 500)
    },
    open() {
      this.$confirm('此操作将清除播放列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cleanList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      })
    },
    //? 清空列表
    cleanList() {
      this.index = 0
      this.songLists = []
      this.url = ""
      this.hasSong = false
      this.isPlaying = false
    },
    rowClick(row) {
      this.index = this.songLists.indexOf(row)
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
      this.toLyricInfo = this.info
      setTimeout(() => {
        this.playMusic()
      }, 500)
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getUrl(id) {
      this.axios.get(`/song/url`, {
        params: {
          id
        }
      }).then(response => {
        console.log(response);
        this.url = response.data.data[0].url
      }).catch(err => {
        console.log(err)
      })
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
        dt: array[index].time,
        album:array[index].album
      }
    },
    //  ?获取歌词
    getSongWords(id) {
      this.axios.get(`/lyric`, {
        params: {
          id
        }
      }).then(response => {
        // console.log(response.data.lrc.lyric);
        this.lyric = []
        //? 处理歌词
        this.formatLyric(response.data.lrc.lyric)
        console.log(this.lyric);
      }).catch(err => {
        console.log(err);
      })
    },
    formatLyric(text) {
      let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
      let row = arr.length; //获取歌词行数
      for (let i = 0; i < row; i++) {
        let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
        let temp_arr = temp_row.split("]");//我们可以通过“]”对时间和文本进行分离
        let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
        //再对剩下的歌词时间进行处理
        temp_arr.forEach(element => {
          let obj = {};
          let time_arr = element.substr(1, element.length - 1).split(":");//先把多余的“[”去掉，再分离出分、秒
          let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
          obj.time = s;
          obj.text = text;
          this.lyric.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
        });
      }
      this.lyric.sort(this.sortRule); //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
      this.$store.commit("setLyric", this.lyric);
      console.log(this.$store.state);
    },
    sortRule(a, b) { //设置一下排序规则
      return a.time - b.time;
    },
    showSongLyric() {
      let box = this.$refs.left_box
      box.removeAttribute('class')
      box.setAttribute('class', 'left_box box_up')
      this.showLyric = true
      this.toLyricInfo = this.info
    },
    backSong() {
      let box = this.$refs.left_box
      box.removeAttribute('class')
      box.setAttribute('class', 'left_box box_down')
      this.showLyric = false
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
    },
    table() {
      this.$nextTick(() => {
        this.$refs.songListTable.setCurrentRow(this.songLists[this.index])
      })
    },
    songLists(){
      if (this.songLists.length==1) {
        this.getUrl(this.songLists[this.index].id)
        this.getSongWords(this.songLists[this.index].id)
        this.hasSong = true
        this.isPlaying = true
        setTimeout(() => {
          this.playMusic()
          this.voice = this.$refs.audio.volume * 100
        }, 500)
        this.setInfo(this.songLists, this.index)
      }else {
        console.log('下一首')
        this.nextSong()
      }
    }
  },
  mounted() {
    this.$bus.$on('songLists', (val) => {
      // console.log('songLists==>',JSON.parse(JSON.stringify(val)))
      this.songLists = JSON.parse(JSON.stringify(val))
    })
  }
}
</script>

<style scoped lang="less">
.box_up {
  transform: translateY(0);
}
.box_down {
  transform: translateY(-90px);
}
.main {
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #d9d9da;
  background: #fff;
  width: 100%;
  height: 90px;
  padding-top: 10px;
  overflow: hidden;
  .lyric {
    position: fixed;
    bottom: 100px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 100px);
    z-index: 100;
    background: #f8f8f8;
  }
  i {
    cursor: pointer;
  }
  .left_box {
    transition: .5s;
    width: 100%;
    overflow: hidden;
    //?歌手信息
    .main_left {
      display: flex;
      margin-left: 10px;
      .hover_box {
        position: relative;
        img {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          margin-right: 10px;
          border: 1px solid #9f9f9f;
        }
        .hover_over {
          position: absolute;
          top: 1px;
          left: 1px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 70px;
          height: 70px;
          opacity: 0;
          border-radius: 10px;
          i {
            font-size: 24px;
          }
        }
        .hover_over:hover {
          opacity: .5;
          background: #fff;
          cursor: pointer;
        }
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
    .main_left2 {
      display: flex;
      margin-left: 10px;
      margin-bottom: 30px;
      .back {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 70px;
        border-radius: 10px;
        margin-right: 10px;
        //border: 1px solid #000;
        i {
          font-size: 24px;
          transform: rotate(180deg);
        }
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
          background: var(--active-color);
        }
        .bot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--active-color);
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
        background: var(--active-color);
      }
    }
    .song_list {
      padding: 25px;
    }
    .iconfont {
      font-size: 20px;
    }
    .level {
      font-size: 12px;
      color: var(--active-color);
      border: 1px solid var(--active-color);
      padding: 1px 3px;
    }
  }
}
</style>