<template>
    <view class="my-settle-container">
        <!-- 全选 -->
        <label class="radio" @click="changeAllState">
            <radio color="#C00000" :checked="isFullcheck"/><text>全选</text>
        </label>
        <!-- 合计 -->
        <view class="amount-box">
            合计：<text class="amount">￥{{checkoutedGoodsAmount}}</text>
        </view>
        <!-- 结算按钮 -->
        <view class="btn-settle">结算({{checkoutCount}})</view>
    </view>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    export default {
        name:"my-settle",
        data() {
            return {
                
            };
        },
        computed:{
            ...mapGetters('m_cart', ['checkoutCount', 'total', 'checkoutedGoodsAmount']),
            isFullcheck() {
                return this.total === this.checkoutCount
            }
        },
        methods:{
            ...mapMutations('m_cart', ['updateAllGoodsState']),
            changeAllState() {
                this.updateAllGoodsState(!this.isFullcheck)
            }
        }
    }
</script>

<style lang="scss">
.my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    background-color: #fff;
    font-size: 28rpx;
    padding-left: 10rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .radio{
        display: flex;
        align-items: center;
    }
    
    .amount-box{
       .amount{
           color: #C00000;
           font-weight: bold;
       } 
    }
    
    .btn-settle{
        background-color: #C00000;
        height: 100rpx;
        line-height: 100rpx;
        color: #fff;
        padding: 0 20rpx;
        min-width: 200rpx;
        text-align: center;
    }
}
</style>