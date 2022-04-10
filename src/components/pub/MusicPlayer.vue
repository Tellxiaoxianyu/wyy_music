<template>
  <div class="main">

    <audio :src="url" ref="audio" @ended="endAudio" @timeupdate="getTimeupdate" @loadedmetadata="getLoadedmetadata">
      对不起,你的浏览器暂不支持audio控件
    </audio>

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
              <div class="hover_over" @click="toSongLyric">
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

export default {
  name: "MusicPlayer",
  data() {
    return {
      //歌曲顺序
      index: 0,
      duration: 0,
      currentTime: 0,
      lyric: [],//歌词
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
        console.log('已经是第一首了', this.index)
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
      setTimeout(() => {
        this.playMusic()
      }, 500)
    },
    nextSong() {
      this.index++
      if (this.index >= this.songLists.length) {
        console.log('全部播放结束', this.index)
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
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
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists, this.index)
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
        dt: array[index].time
      }
    },
    //  ?获取歌词
    getSongWords(id) {
      /*
        [00:00.000] 作曲 : 蔡德才
        [00:07.590]越过生死一刻跟你电单车之中狭路再相逢
        [00:15.210]大概你嘴边伤口与我发端都一般大紫大红
        [00:22.900]下半生不要只要下秒钟
        [00:27.000]再不敢吻你你便再失踪
        [00:30.659]抑或有 谁高呼 不要动
        [00:37.620]
        [00:38.969]未怕挨紧颈边穿过横飞的子弹跟你去走难
        [00:46.960]但怕结婚生子的平庸麻木地活着亦一样难
        [00:55.069]若与不心爱的每夜晚餐
        [00:58.490]也不知哪个故事更悲惨
        [01:02.440]只愿我 能够与你过得今晚
        [01:09.400]
        [01:10.419]世界将我包围 誓死都一齐
        [01:14.199]壮观得有如 悬崖的婚礼
        [01:18.520]也许生于世上 无重要作为
        [01:22.699]仍有这种真爱会留低
        [01:26.060]我已不顾安危 誓死都一齐
        [01:29.949]看不起这个繁华盛世
        [01:34.359]纵使天主不忍心我们如垃圾般污秽
        [01:40.960]抱着你不枉献世
        [01:45.340]
        [01:58.699]别理三餐一宿得到牧师的祝福需要那种运
        [02:06.660]让我满足于飞车之中抱紧苦恋的做一类人
        [02:14.450]面对这都市所有霓虹灯
        [02:18.400]我敢说我爱到动魄惊心
        [02:22.210]不负你 陪过我刹那的兴奋
        [02:29.000]
        [02:29.950]世界将我包围 誓死都一齐
        [02:33.900]壮观得有如 悬崖的婚礼
        [02:38.050]也许生于世上 无重要作为
        [02:41.770]仍有这种真爱耀眼生辉
        [02:46.760]我已不顾安危 誓死都一齐
        [02:50.390]看不起这个繁华盛世
        [02:54.950]纵使天主不忍心我们如垃圾般污秽
        [03:01.450]抱着你不枉献世
        [03:05.610]
        [03:10.540]世界将我包围 誓死都一齐
        [03:14.520]壮观得有如 悬崖的婚礼
        [03:18.620]也许生于世上 无重要作为
        [03:22.490]仍有生死之交可超越一切
        [03:26.370]我已不顾安危 誓死都一齐
        [03:30.290]爱得起你 为何还忌讳
        [03:34.750]也许出生当天本以为谁待我像公仔
        [03:41.220]最后却苦恋蚂蚁
        [03:47.300]难自爱都懂得怎相爱找得到一个人共我分享这身世
        [03:54.760]还未算失礼
        [03:58.980]
        */
      this.axios.get(`/lyric`, {
        params: {
          id
        }
      }).then(response => {
        // console.log(response.data.lrc.lyric);
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
    toSongLyric() {
      this.$router.push("/my/lyric")
      let box = this.$refs.left_box
      box.removeAttribute('class')
      box.setAttribute('class','left_box box_up')
    },
    backSong() {
      this.$router.go(-1)
      let box = this.$refs.left_box
      box.removeAttribute('class')
      box.setAttribute('class','left_box box_down')
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
    }
  },
  mounted() {
    this.$bus.$on('songLists', async (val) => {
      // console.log('songLists==>',JSON.parse(JSON.stringify(val)))
      this.songLists = JSON.parse(JSON.stringify(val))
      await this.getUrl(this.songLists[this.index].id)
      this.getSongWords(this.songLists[this.index].id)
      this.hasSong = true
      this.isPlaying = true
      setTimeout(() => {
        this.playMusic()
        this.voice = this.$refs.audio.volume * 100
      }, 500)
      this.setInfo(this.songLists, this.index)
    })
  }
}
</script>

<style scoped lang="less">
.box_up{
  transform: translateY(0);
}
.box_down{
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

  i {
    cursor: pointer;
  }

  .left_box{
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
        border: 1px solid #000;

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
      padding: 25px;
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