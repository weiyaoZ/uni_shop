<template>
    <view class="cart-container" v-if="cart.length !== 0">
        <!-- 收获地址组件 -->
        <my-address></my-address>
        <!-- 商品列表的标题部分 -->
        <view class="cart-title">
            <!-- 左侧的图标 -->
            <uni-icons type="shop" size="18"></uni-icons>
            <!-- 右侧的文本 -->
            <text class="cart-title-text">购物车</text>
        </view>

        <!-- 商品列表区域 -->
        <!-- uni-swipe-action 是最外层包裹性质的容器 -->
        <uni-swipe-action>
            <block v-for="(goods, index) in cart" :key="index">
                <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
                <uni-swipe-action-item :options="options" @click="swipeActionClickHandler(goods)">
                    <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioClickHandler"
                        @num-change="numberChangeHandler"></my-goods>
                </uni-swipe-action-item>
            </block>
        </uni-swipe-action>

        <!-- 结算组件 -->
        <my-settle></my-settle>
    </view>
    
    <!-- 购物车 -->
    <view class="empty-cart" v-else>
        <image src="../../static/cart_empty@2x.png" class="empty-img"></image>
        <text class="tip-text">空空如也~</text>
    </view>
</template>

<script>
    import badgeMix from '@/mixins/tabbar-badge.js'
    import {
        mapState,
        mapGetters,
        mapMutations
    } from 'vuex'
    export default {
        mixins: [badgeMix],
        data() {
            return {
                options: [{
                    text: '删除',
                    style: {
                        backgroundColor: '#C00000' // 按钮的背景颜色
                    }
                }]
            };
        },
        computed: {
            ...mapState('m_cart', ['cart']),

        },
        methods: {
            ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
            radioClickHandler(e) {
                this.updateGoodsState(e)
            },
            numberChangeHandler(e) {
                this.updateGoodsCount(e)
            },
            swipeActionClickHandler(goods) {
                this.removeGoodsById(goods.goods_id)
            }
        }
    }
</script>

<style lang="scss">
    .cart-container {
        padding-bottom: 100rpx;

        .cart-title {
            height: 80rpx;
            display: flex;
            align-items: center;
            padding-left: 10rpx;
            border-bottom: 2rpx solid #efefef;

            .cart-title-text {
                font-size: 28rpx;
                margin-left: 20rpx;
            }
        }
    }
    
    .empty-cart{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 300rpx;
        .empty-img{
            width: 180rpx;
            height: 180rpx;
        }
        .tip-text{
            font-size: 24rpx;
            color: gray;
            margin-top: 30rpx;
        }
    }
</style>
