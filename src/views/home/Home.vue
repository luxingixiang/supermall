<template>
  <div id="home">
    <nav-bar class="home-nav"> <div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tabControl"
      v-show="isTabFixed"
    />
    <!-- 此处probe-type前面不加冒号,穿过去的是字符串 -->
    <scroll
      class="content"
      :probe-type="3"
      @scroll="contentScroll"
      ref="scroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners.list" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends.list" />
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

import NavBar from "components/common/navbar/NavBar.vue";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll.vue";
import BackTop from "components/content/backTop/BackTop.vue";

import { getHomeMultdata, getHomeGoods } from "network/home";

export default {
  name: "Home",
  data() {
    return {
      banners: [],
      recommends: [],
      keywords: [],
      dKeywords: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffSetTop: 0,
      isTabFixed: false,
    };
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    Scroll,

    NavBar,
    TabControl,
    GoodsList,
    BackTop,
  },
  created() {
    //1 请求多个数据
    this.getHomeMultdata();
  },
  mounted() {
    //2 请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
    // 监听item中图片加载完成
    const refresh = this.debounce(this.$refs.scroll.refresh, 500);
    this.$bus.$on("itemImageLoad", () => {
      refresh();
      // this.$refs.scroll.refresh();
      // console.log("---");
    });
  },

  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  methods: {
    //时间监听
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl2.currentIndex = index;
      this.$refs.tabControl1.currentIndex = index;
    },
    contentScroll(position) {
      // console.log(position);
      //1 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
      //2 决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabOffSetTop;
    },
    backClick() {
      // console.log(this.$refs);
      this.$refs.scroll.scrollTo(0, 0);
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    debounce(func, delay) {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
    swiperImageLoad() {
      this.tabOffSetTop = this.$refs.tabControl2.$el.offsetTop;
      console.log(this.tabOffSetTop);
    },

    // 网络请求
    getHomeMultdata() {
      getHomeMultdata().then((res) => {
        // console.log(res);
        this.banners = res.data.data.banner;
        this.recommends = res.data.data.recommend;
        this.keywords = res.data.data.keywords;
        this.dKeywords = res.data.data.dKeyword;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // console.log(res);
        this.goods[type].list.push(...res.data.data.list);
        this.goods[type].page += 1;
        // console.log(ths.goods[type]);
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
        // console.log(this.$refs);
      });
    },
  },
};
</script>

<style scoped>
#home {
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tabControl {
  position: relative;
  z-index: 9;
}
</style>