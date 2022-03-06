<template>
  <div class="top">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="12">
        <div class="main_left">
          <!--  logo  -->
          <img src="../../assets/images/logo.png" class="logo" alt="">
          <!--    搜索框    -->
          <div class="search_box">
            <i class="iconfont icon-search"></i>
            <input type="text" class="search" placeholder="一点点喜欢">
          </div>
        </div>
      </el-col>
      <!--   个人信息 信息   -->
      <el-col :span="12">
        <div class="main_right">
          <div class="tx_box">
            <img src="../../assets/images/tx.jpg" alt="">
            <span>aaronmoomin</span>
          </div>
          <div class="mail">
            <i class="iconfont icon-icon-mail"></i>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Top"
}
</script>

<style scoped lang="less">
.top {
  padding: 10px;
  background: #f5f5f5;
  height: 40px;
  position: sticky;
  top: 0;

  .main_left {
    display: flex;
    justify-content: space-around;

    img {
      width: 116px;
      height: 40px;
    }

    .search_box {
      display: flex;
      height: 20px;
      line-height: 20px;
      margin: 5px auto;
      padding: 5px;
      background: #eaeaea;
      border-radius: 20px;

      .iconfont{
        margin-right: 5px;
      }

      .search {
        font-size: 13px;
      }
    }
  }
  .main_right{
    display: flex;
    float: right;
    line-height: 40px;

    .tx_box{
      display: flex;
      img{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 5px 10px 5px auto;
      }
      span{
        margin: 0 10px 0 0;
      }
    }
  }
}
</style>