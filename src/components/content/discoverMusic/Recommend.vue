<template>
  <div>
    <el-carousel :interval="4000" type="card" height="280px" style="width: 100%;">
        <el-carousel-item v-for="item in imgList" :key="item" style="border-radius: 5px; margin-top:5px" >
            <img style="width:100%;height:100%" :src="item" alt="">
        </el-carousel-item>
    </el-carousel>

    <ul class="recommenu">推荐歌单></ul>

    <div class="demo-image">
  <div class="block" v-for="(item,index) in comName" :key="index">
    <el-image class="hotCom"
      :src= "comPic[index]"
      fit="fill"></el-image><br>
    <span class="comCount">
      <i class="iconfont icon-zanting" style="font-size:15px;"></i>
      {{getNum[index]}}
    </span>
    <span class="demonstration">{{item}}</span><br>

      </div>
    </div>

    <ul class="recommenu">推荐MV></ul>

    <div class="demo-image__placeholder" v-for="(item,index) in mvName" :key="index">
      <div class="mv">
        <el-image :src="mvPic[index]" class="mvPic"></el-image>
        <span class="mvCount">
          <i class="iconfont icon-zanting" style="font-size:15px;"></i>
          {{mvCount[index]}}
        </span>
        <span class="demonstration" style="width:260px">{{item}}</span><br>
        <span style="font-size:12px;color:grey">{{mvSinger[index]}}</span>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "Recommend",
        data(){
          return {
            imgList: [],
            comName:[],
            comPic:[],
            playCount:[],
            src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            mvName:[],
            mvPic:[],
            mvSinger:[],
            mvCount:[],
          }          
        },
        computed:{
          //将播放量超过万/亿的数字加上万/亿的单位
          getNum(){
            let comCount = []
            this.playCount.forEach(item => {
              let num1 = Math.floor(item).toString();
              if (num1.length > 4) {
                if (num1.length > 8) {
                  let num2 = Math.floor(num1 / 100000000);
                  comCount.push(num2 + '亿');
                }else{
                let num2 = Math.floor(num1 / 10000);
                comCount.push(num2 + '万');
                }
              }
            })
            return comCount;
          },
        },
        mounted(){
          // 获取轮播图图片
          this.axios.get(`/banner`).then(response => {
            this.Lists = response.data.banners
            this.Lists.forEach(item => {
                this.imgList.push(item.imageUrl)
            })
          }).catch(err => {
            console.log(err)
          })

          // 获取每日推荐歌单
          this.axios.get(`/personalized?limit=12`).then(response => {
            this.Lists = response.data.result
            this.Lists.forEach(item => {
              this.comName.push(item.name)
              this.comPic.push(item.picUrl)
              this.playCount.push(item.playCount)
            })
          })

          this.axios.get(`/personalized/mv`).then(response => {
            console.log("MV",response);
            this.Lists = response.data.result
            this.Lists.forEach(item => {
              this.mvName.push(item.name)
              this.mvPic.push(item.picUrl)
              this.mvCount.push(item.playCount)
              this.mvSinger.push(item.artistName)
            })
            console.log(this.mvPic);
          })
        }
    }
</script>

<style>
.el-carousel__indicator--horizontal.is-active .el-carousel__button{
  background: var(--active-color) !important;
}
  .recommenu{
    font-size: 20px;
    font-weight: bold;
    padding: 20px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .block{
    position: relative;
    float:left;
    margin-left:10px;
    width: 220px;
    height: 265px;
  }

  .comCount{
    position: absolute;
    right: 30px;
    top: 0;
    color: white;
    font-size: 15px;
  }

  .hotCom{
    width: 200px; 
    height: 200px;
    border-radius: 10px
  }

  .mv{
    position: relative;
    margin-left: 10px;
    margin-right: 25px;
    float:left;
    width: 310px;
    height: 260px;
  }

  .mvCount{
    position: absolute;
    right: 10px;
    top: 0;
    color: white;
    font-size: 15px;
  }

  .mvPic{
    width: 310px;
    height: 180px;
    border-radius: 10px;
  }
  
  /* 设置轮播图的指示器为小圆点 */
  .el-carousel__indicator--horizontal .el-carousel__button {
      width: 10px;
      height: 10px;
      background: #E6E6E6;
      border: 1px solid #ffffff;
      border-radius: 50%;
      opacity: 1;
    }  
  .el-carousel__indicator--horizontal.is-active .el-carousel__button{
      width: 10px;
      height: 10px;
      background: red;
      border-radius: 50%;
      opacity: 1;
    }
</style>