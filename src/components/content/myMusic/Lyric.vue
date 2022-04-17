<template>
  <div class="lyric_main">
    <el-row :gutter="20">
      <el-col :sm='{span:12,offset:6}' :xs='{span:5,offset:4}'>
        <div class="lyric_top">
          <h2>{{ info.name }}</h2>
          <span>{{ info.ar[0].name }} - {{ info.album }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="lyric_down">
          <el-row :gutter="20">
            <el-col :sm='{span:8,offset:2}' :xs='{span:5,offset:2}'>
              <div class="lyric-left">
                <img :class="['needle',isStart?'needleRotate':'']" src="../../../assets/images/song/needle.png">
                <div :class="['discContainer',isStart?'dicAnimation':'dicAnimation dicAnimation_pause']">
                  <img class="disc" src="../../../assets/images/song/disc.png">
                  <img class="musicImg" :src="info.al.picUrl">
                </div>
              </div>
            </el-col>
            <el-col :span="12" :offset="2" :xs="0">
              <div class="lyric_box">
<!--                <div class="coverTop"></div>-->
                <div class="lyric_right" ref="lyric">
                  <ul :style="{'padding-top': pt+'px','transition':'.5s'}">
                    <li :class="[item.time==currentTime?'currentLine':'']"
                        v-for="(item,index) in currentLyric"
                        :key="'id_'+index">
                      {{ item.text }}
                    </li>
                  </ul>
                </div>
<!--                <div class="coverBottom"></div>-->
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Lyric",
  props: ["info", "currentLyric", "time","isStart"],
  data() {
    return {
      currentTime: 0,
      pt:90
    }
  },
  computed: {
    timeToSecond() {
      return (this.time / 1000).toFixed(0)
    }
  },
  watch: {
    info() {
      this.pt = 90
      console.log(this.info);
    },
    currentLyric() {
    },
    timeToSecond() {
      for (let key in this.currentLyric) {
        if (this.timeToSecond == this.currentLyric[key].time) {
          this.currentTime = this.timeToSecond
          if (key>=5){
            this.pt = 0
            this.$nextTick(()=>{
              this.$refs.lyric.scrollTop = 30 * (key - 5)
            })
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.lyric_main {
  min-width: 900px;
  z-index: 90;
  .lyric_top {
    text-align: center;
    margin-top: 20px;
    letter-spacing: .2rem;
    h2 {
      margin-bottom: 10px;
    }
  }
  .lyric_down {
    .lyric-left {
      /*摇杆*/
      .needle {
        position: relative;
        z-index: 99;
        top: 15px;
        left: 140px;
        width: 140px;
        height: 200px;
        transform-origin: 20px 15px;
        transform: rotate(-20deg);
        transition: transform 1s;
      }
      .needleRotate {
        transform: rotate(0deg);
      }
      /*磁盘*/
      .discContainer {
        position: relative;
        top: -80px;
        left: 0;
        width: 328px;
        height: 328px;
        .disc {
          width: 328px;
          height: 328px;
        }
        .musicImg {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
          width: 220px;
          height: 220px;
          border-radius: 50%;
        }
      }
      .dicAnimation {
        animation: disc 6s linear infinite;
        animation-delay: 1s;
      }
      .dicAnimation_pause{
        animation-play-state: paused;
      }
    }
    @keyframes disc {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .lyric_box {
      position: relative;
      width: 600px;
      height: 300px;
      .coverTop, .coverBottom {
        position: absolute;
        width: 100%;
        height: 20px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(232, 233, 232, .7), rgba(255, 255, 255, 0));
      }
      .coverTop {
        top: 0;
        left: 0;
      }
      .coverBottom {
        bottom: 0;
        left: 0;
      }
      .lyric_right {
        transform: scale(1);
        transition: 1s;
        width: 560px;
        height: 260px;
        //border: 1px solid #000;
        overflow: hidden;
        padding: 20px;
        margin-top: 100px;
        text-align: center;
        font-size: 16px;
        color: #737373;
        &:hover {
          overflow-y: scroll;
        }
        li {
          transition: .5s;
          margin-bottom: 10px;
        }
        .currentLine {
          font-size: 20px;
          color: #000;
        }
      }
    }
  }
}
</style>