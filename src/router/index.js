import Vue from 'vue';
import VueRouter from 'vue-router';

import DiscoverMusic from "@/components/content/DiscoverMusic";
import Blog from "@/components/content/Blog";
import Mv from "@/components/content/Mv";
import Follow from "@/components/content/Follow";
import Live from "@/components/content/Live";
import PersonalFM from "@/components/content/PersonalFM";

import LocalDownload from "@/components/content/myMusic/LocalDownload";
import RecentPlay from "@/components/content/myMusic/RecentPlay";
import MyMusicCloud from "@/components/content/myMusic/MyMusicCloud";
import MyBlog from "@/components/content/myMusic/MyBlog";
import MyCollection from "@/components/content/myMusic/MyCollection";
import MySong from "@/components/content/myMusic/MySong";

Vue.use(VueRouter)

const routes = [
    {path: '/',redirect:'/discoverMusic', component: DiscoverMusic},
    //?发现音乐
    {path: '/discoverMusic', component: DiscoverMusic},
    //?博客
    {path: '/blog', component: Blog},
    //?mv
    {path: '/mv', component: Mv},
    //?关注
    {path: '/follow', component: Follow},
    //?直播
    {path: '/live', component: Live},
    //?私人FM
    {path: '/personalFM', component: PersonalFM},
    //?我的音乐
    //?本地下载
    {path: '/my/localDownload', component: LocalDownload},
    //?最近播放
    {path: '/my/recentPlay', component: RecentPlay},
    //?我的音乐云盘
    {path: '/my/myMusicCloud', component: MyMusicCloud},
    //?我的博客
    {path: '/my/myBlog', component: MyBlog},
    //?我的收藏
    {path: '/my/myCollection', component: MyCollection},
    //?创建的歌单
    {path: '/my/mySong/:id', component: MySong},
]

const router = new VueRouter({
    routes
});

//抛出这个这个实例对象方便外部读取以及访问
export default router