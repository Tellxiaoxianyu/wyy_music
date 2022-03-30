<template>
  <div class="main">

    <audio :src="url" ref="audio" @ended="endAudio">
      对不起,你的浏览器暂不支持audio控件
    </audio>

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
            <span @click="playOrPause">
              <i class="iconfont icon-zanting2 stop" v-if="isPlaying"></i>
              <i class="iconfont icon-zantingbofang stop" v-else></i>
            </span>
            <i class="iconfont icon-xiayishou"></i>
            <i class="iconfont icon-geci"></i>
          </div>
          <div class="player_bottom">
            <span>{{ currentTimeMoment }}</span>
            <div class="line" ref="line" @mousedown.self="handleMouseDown">
              <div class="last" ref="last" @mousedown.self="handleLastMouseDown"
                   :style="{width: audioWidth + 'px'}">
                <div class="bot" @mousedown.self="handleDrag" ref="dot"></div>
              </div>
            </div>
            <span>{{ duration }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" v-show="hasSong">
        <div class="main_right">
          <div class="level">极高</div>
          <i class="iconfont icon-24gl-volumeZero"></i>
          <i class="iconfont icon-haoyou"></i>
          <el-popover
              popper-class="pop"
              placement="top"
              width="400"
              trigger="click">
            <div class="song_list">
              <h3 style="margin-bottom: 10px;">当前播放</h3>
              <div class="top" style="display: flex;justify-content: space-between">
                <span style="color: #9f9f9f">总 {{ songLists.length }} 首</span>
                <span style="color: #1b7cc4">清空列表</span>
              </div>
              <el-table class="list"
                        height="500"
                        :data="songLists"
                        stripe
                        style="width: 100%">
                <el-table-column
                    prop="name"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="singer"
                    width="100">
                </el-table-column>
                <el-table-column
                    width="100"
                    prop="time">
                </el-table-column>
              </el-table>
            </div>
            <i class="iconfont icon-qukuchaxun" slot="reference"></i>
          </el-popover>
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
      index:0,
      duration: '00:00',
      currentTime: 0,
      //?判断是否有音乐在播放
      hasSong: false,
      isPlaying: false,
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
      this.currentTime = audio.currentTime
    },
    pauseMusic() {
      this.isPlaying = false
      this.$refs.audio.pause()
    },
    //#register
    // handleMouseDown(e) {
    //   if (this.url == "") return
    //   let line = this.$refs.line
    //   let audio = this.$refs.audio
    //   //鼠标点击位置
    //   let targetLeft = Math.floor(e.clientX - line.offsetLeft)
    //   //进度条总长
    //   let targetWidth = e.target.offsetWidth
    //   let play_live = (targetLeft / targetWidth).toFixed(3)
    //   let currentTime = (play_live * audio.duration).toFixed(3)
    //   console.log('currentTime','点击的时间',currentTime,'当前时间',audio.currentTime,"总时间",audio.duration,'比例',play_live);
    //   audio.currentTime = (currentTime * 1)
    //   this.currentTime = (currentTime * 1)
    // },
    // handleLastMouseDown(e) {
    //   if (this.url == "") return
    //   let audio = this.$refs.audio
    //   let last = this.$refs.last
    //   let line = this.$refs.line
    //   //鼠标点击位置
    //   let targetLeft = Math.floor(e.clientX - last.offsetLeft)
    //   //总进度条总长
    //   let targetWidth = line.offsetWidth
    //   let play_live = ((Math.floor((targetLeft / targetWidth) * 100)) / 100).toFixed(2)
    //   let currentTime = (play_live * audio.duration).toFixed()
    //   audio.currentTime = currentTime*1
    //   this.currentTime = (Math.floor(currentTime)) * 1000
    // },
    // handleDrag() {
    //   if (this.url == "") return
    //   let audio = this.$refs.audio
    //   let line = this.$refs.line
    //   let lineOffsetLeft = line.offsetLeft
    //   clearInterval(this.audioInterval)
    //   document.onmousemove = (e) => {
    //     console.log('拖动')
    //     this.audioWidth = (e.clientX - lineOffsetLeft).toFixed(2) + 10
    //     let play_live = (Math.floor((this.audioWidth / lineOffsetLeft) * 100)) / 100
    //     let currentTime = (play_live * audio.duration).toFixed(2)
    //     audio.currentTime = currentTime
    //     this.currentTime = moment((Math.floor(currentTime)) * 1000).format('mm:ss')
    //     document.onmouseup = function () {
    //       console.log('松开')
    //       this.audioInterval = setInterval(() => {
    //         this.currentTime = moment((Math.floor(audio.currentTime)) * 1000).format('mm:ss')
    //       }, 1000)
    //       this.onmousemove = null
    //     }
    //   }
    // },
    getUrl(id){
      this.axios.get(`/song/url`,{
        params:{
          id
        }
      }).then(response => {
        console.log(response.data.data[0]);
        this.hasSong = true
        this.isPlaying = true
        this.url = response.data.data[0].url
      }).catch(err=>{
        console.log(err);
      })
    },
    endAudio(){
      this.index++
      if (this.index >= this.songLists.length) {
        console.log('重新开始')
        return
      }
      this.getUrl(this.songLists[this.index].id)
      this.setInfo(this.songLists,this.index)
    },
    setInfo(array,index){
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
      this.duration = array[index].time
    }
  },
  computed:{
    currentTimeMoment(){
      return moment(this.currentTime).format("mm:ss")
    }
  },
  watch: {
    url() {  //监听正在播放的歌曲改变
      this.$nextTick(() => {
        console.log('正在播放的歌曲')
        let audio = this.$refs.audio
        this.$refs.audio.play()
        this.audioInterval = setInterval(() => {
          this.currentTime = (Math.floor(audio.currentTime)) * 1000
        }, 1000)
      })
    },
    currentTime() {
      let audio = this.$refs.audio
      let line = this.$refs.line
      let duration = this.songLists[this.index].durationTime
      let len = ((audio.currentTime.toFixed(3)*1000 / duration).toFixed(3) * line.clientWidth).toFixed(3)
      console.log('当前时间',audio.currentTime.toFixed(3)*1000,'总时长',duration)
      console.log('比例',(audio.currentTime.toFixed(3)*1000 / duration).toFixed(3));
      this.audioWidth = (len * 1).toFixed(2)
    }
  },
  mounted() {
    this.$bus.$on('getSongUrl', (val) => {
      // console.log('控制器url', val);
      this.url = val.url
    })
    this.$bus.$on('getSongInfo', (val) => {
      console.log('控制器Info', val);
      this.info = val
      this.duration = this.info.dt
      this.hasSong = true
      this.isPlaying = true
      this.songLists.push({
        id:this.info.id,
        name:this.info.name,
        singer:this.info.ar[0].name,
        time:this.info.dt,
        durationTime:this.info.durationTime,
        picUrl:this.info.al.picUrl
      })
    })
    this.$bus.$on('songLists', (val) => {
      this.songLists = val
      this.getUrl(val[0].id)
      this.setInfo(val,0)
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
          width: 100px;
          height: 3px;
          background: #ec4141;
          position: relative;
          .bot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ec4141;
            margin-top: -3px;
            position: absolute;
            right: -1px;
          }
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