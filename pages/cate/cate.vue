<template>
    <view>
        <view class="scroll-view-container">
            <!-- 左侧的滑动区域 -->
            <scroll-view scroll-y="true" class="left-scroll-view" :style="{height:wh + 'px'}">
                <block v-for="(item,index) in cateList" :key="index">
                <view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="changeAct(index)">{{item.cat_name}}</view>
                </block>
            </scroll-view>
            <!-- 右侧的滑动区域 -->
            <scroll-view scroll-y="true" class="right-scroll-view" :style="{height:wh + 'px'}" :scroll-top="scrollTop">
                <view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="index2">
                    <!-- 二级分类的标题 -->
                    <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
                    <!-- 当前二级分类下的三级分类列表 -->
                    <view class="cate-lv3-list">
                        <view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3" @click="gotoGoodsList(item3)">
                            <!-- 三级分类的图片 -->
                            <image :src="item3.cat_icon"></image>
                            <!-- 三级分类的文本 -->
                            <text>{{item3.cat_name}}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                // 当前设备可用的高度
                wh: 0,
                active: 0,
                cateList:[],
                // 二级分类的列表数据
                cateLevel2:[],
                scrollTop: 0
            };
        },
        onLoad() {
            const sysInfo = uni.getSystemInfoSync()
            this.wh = sysInfo.windowHeight
            
            this.getCateList()
        },
        methods:{
            // 获取分类列表的数据
            async getCateList() {
                const {data: res} = await uni.$http.get('/api/public/v1/categories')
                if(res.meta.status != 200) return uni.$showMsg()
                this.cateList = res.message
                
                // 为二级分类列表赋值
                this.cateLevel2 = res.message[0].children
            },
            changeAct(index) {
                this.active = index
                // 重新为二级分类赋值
                this.cateLevel2 = this.cateList[index].children
                this.scrollTop = this.scrollTop === 0 ? 1 : 0
            },
            // 跳转到商品列表页面
            gotoGoodsList(item) {
                uni.navigateTo({
                    url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
                })
            }
        }
    }
</script>

<style lang="scss">
    .scroll-view-container {
        display: flex;

        .left-scroll-view {
            width: 240rpx;

            .left-scroll-view-item {
                background-color: #f7f7f7;
                line-height: 120rpx;
                text-align: center;
                font-size: 26rpx;
                
                &.active {
                    background-color: #fff;
                    position: relative;
                    &::before{
                        content: " ";
                        display: block;
                        width: 6rpx;
                        height: 60rpx;
                        background-color: #C00000;
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                    }
                }
            }
        }
        .right-scroll-view {
            .cate-lv2-title{
                font-size: 26rpx;
                font-weight: bold;
                text-align: center;
                padding: 40rpx 0;
            }
            .cate-lv3-list {
                display: flex;
                flex-wrap: wrap;
                .cate-lv3-item {
                    width: 33.33%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 40rpx;
                    image{
                        width: 120rpx;
                        height: 120rpx;
                    }
                    text{
                        font-size: 26rpx;
                    }
                }
            }
        }
    }
</style>
