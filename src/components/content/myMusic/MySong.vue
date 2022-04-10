<template>
  <el-container>
    <div class="song_container" ref="context">
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
            :cell-style="cellStyle"
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
              width="300"
              prop="name"
              label="标题">
          </el-table-column>
          <el-table-column
              width="200"
              prop="ar[0][name]"
              label="歌手">
          </el-table-column>
          <el-table-column
              width="250"
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
      songData: [],//? 存储当前歌单所有歌曲
      currentPage: 0, //? 当前页
      pageSize: 20,
      totalPage: 0, //? 总页数
      songLists: [],//? 用来保存需要播放的可取
      songInfo: {},
    }
  },
  methods: {
    handleSelect(key) {
      console.log(key)
    },
    handleLike(index, row) {
      console.log(index, row);
    },
    //? 传输需要播放的音乐
    sendSongLists() {
      this.$bus.$emit("songLists", this.songLists)
    },
    async rowDblclick(row) {
      //?歌曲详情
      // console.log(row);
      if (row.success) {
        this.songLists.push({
          name: row.name,
          singer: row.ar[0].name,
          id: row.id,
          al: row.al,
          album: row.al.name,
          time: row.dt
        })
        this.sendSongLists()
      } else {
        this.$alert('因版权方要求,该资源暂时无法播放,我们正在争取歌曲回归', '当前歌曲暂无音源', {
          confirmButtonText: '知道了',
          confirmButtonClass: 'confirm',
          center: true,
          callback: () => {
            this.$message({
              type: 'info',
              message: `已取消`
            });
          }
        });
      }
    },
    getUrl(id) {
      return new Promise((resolve, reject) => {
        this.axios.get(`/song/url`, {
          params: {
            id
          }
        }).then(response => {
          resolve(response.data.data[0])
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 判断歌曲是否有版权
    checkSong(id) {
      return new Promise((resolve) => {
        this.axios.get(`/check/music`, {
          params: {
            id
          }
        }).then(response => {
          resolve(response.data.success)
        }).catch((err) => {
          resolve(err.response.data.success)
        })
      })
    },
    cellStyle(row) {
      if (row.column.label === '标题') {
        if (!row.row.success) {
          return 'color: #c3c3d3;'
        }
        return 'cursor:text;'
      }
    },
    //?获取歌单全部歌曲
    getAllPlaylist(offset) {
      this.axios.get(`/playlist/track/all`, {
        params: {
          id: this.$route.params.id,
          limit: this.pageSize,
          offset,
          cookie: localStorage.getItem('MUSIC_U')
        }
      }).then(response => {
        // console.log(response.data.songs);
        let newArr = [...this.songData, ...response.data.songs]
        let hash = {}; //去重
        let arr = newArr.reduce((preVal, curVal) => {
          hash[curVal.id]		//id就是数组中的id字段
              ? ""
              : (hash[curVal.id] = true && preVal.push(curVal));
          return preVal;
        }, []);
        // 获取新增
        let newAddArr = []
        for (let i = this.songData.length; i < arr.length; i++) {
          newAddArr.push(arr[i])
        }

        this.songData = arr
        for (let item of newAddArr) {
          item.durationTime = item.dt
          item.dt = moment(item.dt).format('mm:ss')
          this.checkSong(item.id).then((res) => {
            res ? this.$set(item, 'success', true) : this.$set(item, 'success', false)
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    getDetails() {
      this.axios.get(`/playlist/detail`, {
        params: {
          id: this.$route.params.id,
          cookie: localStorage.getItem('MUSIC_U')
        }
      }).then(response => {
        console.log('getDetails', response.data);
        let {playlist} = response.data
        this.name = playlist.name;
        this.coverImgUrl = playlist.coverImgUrl
        this.creator.nickname = playlist.creator.nickname
        this.creator.avatarUrl = playlist.creator.avatarUrl
        this.createTime = moment(playlist.createTime).format("YYYY-MM-DD")
        this.trackCount = playlist.trackCount
        this.playCount = playlist.playCount

        this.totalPage = playlist.tracks.length
      }).catch(err => {
        console.log(err);
      })
    },
    playAll() {
      //覆盖全部
      this.songLists = []
      for (let s of this.songData) {
        if (s.success) {
          this.songLists.push({
            name: s.name,
            singer: s.ar[0].name,
            id: s.id,
            al: s.al,
            album: s.al.name,
            time: s.dt
          })
        } else {
          continue
        }
      }
      this.sendSongLists()
    }
  },
  mounted() {
    console.log(this.$route.params.id);
    this.getDetails()
    console.log('现在是第', this.currentPage + 1)
    this.getAllPlaylist(this.currentPage)
    let dom = this.$refs.context
    this.$nextTick(() => {
      dom.addEventListener('scroll', () => {
        //? 表格一格高度为48 一页15行高度为720
        let pageHeight = 48 * this.pageSize
        /**  scrollHeight 是一个元素能够展示其所有内容所需要的最小高度 总高度
         *   clientHeight 是一个元素的 content + padding 的高度
         *   scrollTop 元素的垂直滚动条位置 272开始为表格部分 进度条移动高度
         *   0 21 41
         * */
        if (dom.scrollTop >= 270 + 200) { // 进入表格区域
          if (dom.scrollTop - 270 - 200 >= pageHeight * this.currentPage) {
            this.currentPage++
            console.log('换页啦,现在是第', this.currentPage + 1)
            this.getAllPlaylist(this.currentPage)
          }
        }
      })
    })
  },

}
</script>

<style scoped lang="less">
.song_container {
  padding: 20px;
  width: 100%;
  height: calc(100vh - 180px);
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

    .like {
      color: #ec4141;
    }
  }
}
</style>