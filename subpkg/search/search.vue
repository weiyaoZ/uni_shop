<template>
    <view>
        <view class="search-box">
            <!-- 使用 uni-ui 提供的搜索组件 -->
            <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
        </view>
        <!-- 搜索建议列表 -->
        <view class="sugg-list" v-if="searchResults.length !== 0">
            <view class="sugg-item" v-for="(item, index) in searchResults" :key="item.goods_id" @click="gotoDetail(item)">
                <view class="goods-name">{{item.goods_name}}</view>
                <uni-icons type="arrowright" size="16"></uni-icons>
            </view>
        </view>
        <!-- 搜索历史部分 -->
        <view class="history-box" v-else>
            <!-- 标题区域 -->
            <view class="history-title">
                <text>搜索历史</text>
                <uni-icons type="trash" size="17" @click="clean"></uni-icons>
            </view>
            <!-- 搜索历史关键字 -->
            <view class="history-list">
                <uni-tag :text="item" v-for="(item, index) in histories" :key="index" @click="gotoGoodsList(item)"></uni-tag>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                timer: null,
                kw: '',
                // 搜索的结果列表
                searchResults: [],
                // 搜索历史列表
                historyList: []
            };
        },
        onLoad() {
           this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
        },
        methods: {
            // input 输入事件的处理函数
            input(e) {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.kw = e.value
                    this.getSearchList()
                }, 500)
            },
            gotoDetail(item) {
                uni.navigateTo({
                    url:'/subpkg/goods_detail/goods_detail?goods_id' + item.goods_id
                })
            },
            saveSearchHistoty() {
                // 将 Array 数组转化为 Set 对象
                const set = new Set(this.historyList)
                // 调用 Set 对象的 delete 方法，移除对应的元素
                set.delete(this.kw)
                // 再来添加新的元素
                set.add(this.kw)
                // 最后将 Set 对象转化为 Array 数组
                this.historyList = Array.from(set)
                // 持久化存储历史记录
                uni.setStorageSync('kw', JSON.stringify(this.historyList))
            },
            // 清空历史记录
            clean() {
                this.historyList = []
                uni.clearStorageSync('kw')
            },
            gotoGoodsList(kw) {
                uni.navigateTo({
                    url:'/subpkg/goods_list/goods_list?query=' + kw
                })
            },
            async getSearchList() {
                if (this.kw.length === 0) {
                    this.searchResults = []
                    return
                }

                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/qsearch', {
                    query: this.kw
                })
                if (res.meta.status != 200) return uni.$showMsg()
                this.searchResults = res.message
                
                // 将搜索关键字保存起来
                this.saveSearchHistoty()
            }
        },
        computed:{
            histories() {
                return [...this.historyList].reverse()
            }
        }
    }
</script>

<style lang="scss">
    .search-box {
        position: sticky;
        top: 0;
        z-index: 99;
    }
    .sugg-list {
        padding: 0 10rpx;
        .sugg-item {
            font-size: 28rpx;
            padding: 30rpx 0;
            border: 2rpx solid #efefef;
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .goods-name {
                // 文字不允许换行
                white-space: nowrap;
                // 隐藏溢出部分
                overflow: hidden;
                // 文字溢出后，使用... 代替
                text-overflow: ellipsis;
                margin-right: 6rpx;
            }
        }
    }
    .history-box {
        padding: 0 20rpx;
        .history-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 80rpx;
            font-style: 28rpx;
            border-bottom:2rpx solid #efefef;
        }
        .history-list {
            display: flex;
            flex-wrap: wrap;
            
            uni-tag{
                margin-top: 10rpx;
                margin-right: 10rpx;
            }
        }
        
    }
</style>
