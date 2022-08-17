<template>
    <view class="goods_detail_container">
        <!-- 轮播图区域 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" :circular="true">
            <swiper-item v-for="(item, index) in goods_info.pics" :key="index">
                <image :src="item.pics_big" @click="preview(index)"></image>
            </swiper-item>
        </swiper>
        <!-- 商品信息区域 -->
        <view class="goods-info-box">
            <view class="price" v-if="goods_info.goods_price">￥{{goods_info.goods_price}}</view>
            <!-- 信息主体的区域 -->
            <view class="goods-info-body">
                <!-- 商品名称 -->
                <div class="goods-name">{{goods_info.goods_name}}</div>
                <!-- 收藏 -->
                <div class="favi">
                    <uni-icons type="star" size="18" color="gray"></uni-icons>
                    <text>收藏</text>
                </div>
            </view>
            <!-- 运费 -->
            <view class="yf">快递：免运费</view>
        </view>

        <!--  商品详情信息 -->
        <rich-text :nodes="goods_info.goods_introduce"></rich-text>

        <!-- 商品导航组件区域 -->
        <view class="goods_nav">
            <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                // 商品详情的数据
                goods_info: {},
                // 底部导航栏配置项
                options: [{
                    icon: 'shop',
                    text: '店铺'
                }, {
                    icon: 'cart',
                    text: '购物车',
                    info: 2
                }],
                // 右侧按钮组的配置对象
                buttonGroup: [{
                        text: '加入购物车',
                        backgroundColor: '#ff0000',
                        color: '#fff'
                    },
                    {
                        text: '立即购买',
                        backgroundColor: '#ffa200',
                        color: '#fff'
                    }
                ]
            };
        },
        onLoad(options) {
            const goods_id = options.goods_id
            this.getGoodsDetail(goods_id)
        },
        methods: {
            async getGoodsDetail(goods_id) {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/detail', {
                    goods_id
                })
                if (res.meta.status !== 200) return uni.$showMsg()

                // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片空白间隙的问题
                res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g,
                    '<img style="display:block;"').replace(/webp/g, 'jpg')

                this.goods_info = res.message
            },
            preview(currentIndex) {
                uni.previewImage({
                    // 预览时，默认显示图片的索引
                    current: currentIndex,
                    // 利用数组的 map 方法
                    urls: this.goods_info.pics.map(x => x.pics_big)
                })
            },
            onClick(e) {
                // 当触发事件的元素是购物车的时候跳转
                if(e.content.text = '购物车') {
                    // 切换到购物车页面
                    uni.switchTab({
                        url: '/pages/cart/cart'
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    swiper {
        height: 750rpx;

        image {
            width: 100%;
            height: 100%;
        }
    }
    
    .goods_detail_container {
        padding-bottom: 50px;
    }

    .goods-info-box {
        padding: 20rpx 0 20rpx 20rpx;
        padding-right: 0;

        .price {
            color: #C00000;
            font-size: 36rpx;
            margin: 20rpx 0;
        }

        .goods-info-body {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .goods-name {
                font-size: 26rpx;
                margin-right: 20rpx;
            }

            .favi {
                width: 240rpx;
                font-size: 24rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-left: 2rpx solid #efefef;
                color: gray;
            }
        }

        .yf {
            font-size: 24rpx;
            color: gray;
            margin: 20rpx 0;
        }
    }
    
    .goods_nav {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
    }
</style>
