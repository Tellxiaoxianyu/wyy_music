<template>
  <el-container>
    <div class="song_container">
      <el-backtop target=".song_container" :bottom="200">
        <div
            style="{
                height: 100%;
                width: 100%;
                background-color: #ec4141;
                box-shadow: 0 0 6px rgba(0,0,0, .12);
                border-radius: 50%;
                text-align: center;
                line-height: 40px;
                color: #ffffff;
            }"
        >
          up
        </div>
      </el-backtop>
      <div class="top">
        <div class="top_left">
          <img :src="coverImgUrl" alt="">
        </div>
        <div class="top_right">
          <div class="right_top">
            <div class="up">
              <span>歌单</span>
              <h2>{{ name }}</h2>
            </div>
            <div class="down">
              <img :src="creator.avatarUrl" alt="">
              <p class="name">{{ creator.nickname }}</p>
              <p class="time">{{ createTime }}创建</p>
            </div>
          </div>
          <div class="right_mid">
            <el-button class="do_it" type="danger" icon="iconfont icon-xiayishou"
            @click="playAll">
              播放全部
            </el-button>
          </div>
          <div class="right_down">
            <p>歌曲: {{ trackCount }}</p>
            <p>播放: {{ playCount }}</p>
          </div>
        </div>
      </div>
      <div class="content">
        <el-menu default-active="1" active-text-color="#ec4141" class="el-menu-demo" mode="horizontal"
                 @select="handleSelect">
          <el-menu-item index="1">歌曲列表</el-menu-item>
          <el-menu-item index="2">评论</el-menu-item>
          <el-menu-item index="3">收藏者</el-menu-item>
        </el-menu>
        <el-table
            :data="songData"
            @row-dblclick="rowDblclick"
            stripe>
          <el-table-column
              type="index"
              width="50">
          </el-table-column>
          <el-table-column
              width="60"
              label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-xiai-copy like"
                 @click="handleLike(scope.$index, scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column
              width="350"
              prop="name"
              label="标题">
          </el-table-column>
          <el-table-column
              width="200"
              prop="ar[0][name]"
              label="歌手">
          </el-table-column>
          <el-table-column
              width="200"
              prop="al[name]"
              label="专辑">
          </el-table-column>
          <el-table-column
              prop="dt"
              label="时间">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-container>
</template>

<script>
import moment from "moment";

export default {
  name: "MySong",
  data() {
    return {
      name: '',
      coverImgUrl: '',
      creator: {
        avatarUrl: '',
        nickname: ''
      },
      createTime: '',
      trackCount: 0,
      playCount: 0,
      songData: [],
      songInfo:{}
    }
  },
  methods: {
    handleSelect(key) {
      console.log(key)
    },
    handleLike(index, row){
      console.log(index, row);
    },
    rowDblclick(row){
      //?歌曲详情
      console.log(row);
      this.getUrl(row.id)
      this.$bus.$emit('getSongInfo',row)
    },
    getUrl(id){
      this.axios.get(`/song/url`,{
        params:{
          id
        }
      }).then(response => {
        console.log(response.data.data[0]);
        this.$bus.$emit('getSongUrl',response.data.data[0])
      }).catch(err=>{
        console.log(err);
      })
    },
    getDetails(){
      this.axios.get(`/playlist/detail`, {
        params: {
          id: this.$route.params.id,
          cookie: this.$cookie.get('MUSIC_U')
        }
      }).then(response => {
        console.log('getDetails',response);
        this.name = response.data.playlist.name;
        this.coverImgUrl = response.data.playlist.coverImgUrl
        this.creator.nickname = response.data.playlist.creator.nickname
        this.creator.avatarUrl = response.data.playlist.creator.avatarUrl
        this.createTime = moment(response.data.playlist.createTime).format("YYYY-MM-DD")
        this.trackCount = response.data.playlist.trackCount
        this.playCount = response.data.playlist.playCount

        this.songData = response.data.playlist.tracks
        for (let i = 0; i < this.songData.length; i++) {
          this.songData[i].durationTime = this.songData[i].dt
          this.songData[i].dt = moment(this.songData[i].dt).format('mm:ss')
        }
      }).catch(err => {
        console.log(err);
      })
    },
    playAll(){
      let songLists = []
      this.songData.forEach(item=>{
        songLists.push({
          name:item.name,
          singer:item.ar[0].name,
          id:item.id,
          al:item.al,
          album:item.al.name,
          time:item.dt
        })
      })
      this.$bus.$emit("songLists", songLists)
    }
  },
  mounted() {
    console.log(this.$route.params.id);
    this.getDetails()
  }
}
</script>

<style scoped lang="less">
.song_container {
  padding: 20px;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;

  .top {
    display: flex;

    .top_left {
      margin-right: 15px;

      img {
        width: 190px;
        height: 190px;
        border-radius: 10px;
      }
    }

    .top_right {
      display: flex;
      flex-direction: column;

      .right_top {
        margin-bottom: 10px;

        .up {
          display: flex;
          margin-bottom: 10px;

          span {
            width: 40px;
            height: 20px;
            text-align: center;
            border-radius: 5px;
            font-size: 13px;
            color: #ec4141;
            border: 1px solid #ec4141;
            margin-right: 10px;
            margin-top: 6px;
          }
        }

        .down {
          display: flex;
          height: 30px;
          line-height: 25px;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .name {
            color: #767db6;
            margin-right: 10px;
          }

          .time {
            font-size: 13px;
          }
        }
      }
    }

    .right_mid {
      .do_it {
        border-radius: 20px;
        background: #ec4141;
      }
    }

    .right_down {
      display: flex;
      margin-top: 10px;

      p {
        font-size: 13px;
      }

      & > p:nth-child(1) {
        margin-right: 10px;
      }
    }
  }

  .content {
    width: 100%;
    .like{
      color: #ec4141;
    }
  }
}
</style>