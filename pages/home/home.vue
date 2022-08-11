<template>
    <view>
        <!-- 搜索组件 -->
        <view class="search-box">
            <my-search @click="gotoSearch"></my-search>
        </view>
        
        <!-- 轮播图区域 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" :circular="true">
            <swiper-item v-for="(item,index) in swiperList" :key="item.goods_id">
                <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id" class="swiper-item">
                    <image :src="item.image_src"></image>
                </navigator>
            </swiper-item>
        </swiper>
        <!-- 分类导航区域 -->
        <view class="nav_list">
            <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
                <image :src="item.image_src" class="nav-img"></image>
            </view>
        </view>
        <!-- 楼层区域 -->
        <view class="floor_list">
            <!-- 楼层 item 项 -->
            <view class="floor-item" v-for="(item, index) in floorList" :key="index">
                <!-- 楼层的标题 -->
                <image :src="item.floor_title.image_src" class="floor-title"></image>
                <!-- 楼层的图片区域 -->
                <view class="floor-img-box">
                    <!-- 左侧大图片 -->
                    <navigator :url="item.product_list[0].url" class="left-img-box">
                        <image mode="widthFix" :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"></image>
                    </navigator>
                    <!-- 右侧 4 个小图片 -->
                    <view class="right-img-box">
                        <navigator :url="item2.url" class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0">
                            <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
                        </navigator>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                // 轮播图的数据列表
                swiperList: [],
                // 分类导航的数据列表
                navList: [],
                // 楼层的数据列表
                floorList: []
            };
        },
        methods: {
            // 获取轮播图的数据
            async getSwiperList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/swiperdata')
                // 请求失败
                if (res.meta.status != 200) return uni.$showMsg()
                this.swiperList = res.message
                uni.$showMsg('数据请求成功！')
            },
            // 获取分类的数据
            async getNavList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/catitems')
                if (res.meta.status != 200) return uni.$showMsg()
                this.navList = res.message
            },
            // 获取楼层的数据
            async getFloorList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/floordata')
                if (res.meta.status != 200) return uni.$showMsg()
                res.message.forEach(floor => {
                    floor.product_list.forEach(prod => {
                        prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
                    })
                })
                this.floorList = res.message
            },
            // 跳转到分类页面
            navClickHandler(item) {
                if (item.name === '分类') {
                    uni.switchTab({
                        url: '/pages/cate/cate'
                    })
                }
            },
            // 跳转到搜索组件
            gotoSearch() {
                uni.navigateTo({url:'/subpkg/search/search'})
            }
        },
        onLoad() {
            // 调用方法，获取轮播图的数据
            this.getSwiperList()
            // 获取分类导航的数据
            this.getNavList()
            // 获取楼层的数据
            this.getFloorList()
        }
    }
</script>

<style lang="scss">
    swiper {
        height: 330rpx;

        .swiper-item,
        image {
            width: 100%;
            height: 100%;
        }
    }

    .nav_list {
        display: flex;
        justify-content: space-around;
        margin: 30rpx 0;

        .nav-img {
            width: 128rpx;
            height: 140rpx;
        }
    }

    .floor_list {
        .floor-item{
            padding: 20rpx 0;
            .floor-title {
                width: 100%;
                height: 60rpx;
                display: flex;
            }
            .floor-img-box {
                display: flex;
                justify-content: space-between;
                padding-left: 10rpx;
                
                .right-img-box {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-around;
                }
            }
        }
    }
    .search-box {
        position: sticky;
        z-index: 99;
        top: 0;
    }
</style>
