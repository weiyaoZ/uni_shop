<template>
    <view>
        <!-- 选择收获地址 -->
        <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
            <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
        </view>
        
        <!-- 渲染收货信息的盒子 -->
        <view class="address-info-box" v-else @click="chooseAddress">
            <view class="row1">
                <view class="row1-left">
                    <view class="username">收货人：{{address.userName}}</view>
                </view>
                <view class="row1-right">
                    <view class="phone">电话：{{address.telNumber}}</view>
                    <uni-icons type="arrowright" size="14"></uni-icons>
                </view>
            </view>
            <view class="row2">
                <view class="row2-left">收获地址：</view>
                <view class="row2-right">{{addstr}}</view>
            </view>
        </view>
        
        <!-- 底部的边框线 -->
        <image src="@/static/cart_border@2x.png" class="address-border"></image>
    </view>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex'
    export default {
        name:"my-address",
        data() {
            return {
            };
        },
        methods:{
            ...mapMutations('m_user', ['updateAddresss']),
           async chooseAddress() {
                const [err, succ] = await uni.chooseAddress().catch( err => err)
                if(err === null && succ.errMsg === 'chooseAddress:ok') {
                    this.updateAddresss(succ)
                }
            }
        },
        computed: {
            ...mapState('m_user', ['address']),
            ...mapGetters('m_user', ['addstr'])
        }
    }
</script>

<style lang="scss">
.address-border {
    display: block;
    width: 100%;
    height: 10rpx;
}

.address-choose-box {
    height: 180rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.address-info-box {
    font-size: 24rpx;
    height: 180rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10rpx;
    .row1{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .row1-right{
            display: flex;
            justify-content: space-between;
            .phone {margin-right: 10rpx;}
        }
    }
    .row2 {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        .row2-left{
            white-space: nowrap;
        }
    }
}
</style>