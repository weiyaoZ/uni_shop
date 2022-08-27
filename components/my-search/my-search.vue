<template>
    <view class="my-search-container" :style="{'background-color': bgColor}" @click="searchBoxHandler">
        <view class="my-search-box" :style="{'border-radius': radius + 'rpx'}">
            <uni-icons type="search" size="20"></uni-icons>
            <text class="placeholder">搜索</text>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            // 背景颜色
            bgColor: {
                type: String,
                default: '#C00000'
            },
            // 圆角尺寸
            radius: {
                type: Number,
                default: 40
            }
        },
        data() {
            return {

            };
        },
        methods:{
            searchBoxHandler() {
                this.$emit('click')
            }
        }
    }
</script>

<style lang="scss">
    .my-search-container {
        height: 100rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20rpx;

        .my-search-box {
            width: 100%;
            height: 72rpx;
            background-color: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;

            .placeholder {
                font-size: 30rpx;
                margin-left: 10rpx;
            }
        }
    }
</style>
