<template>
    <view>
        <view class="good-list">
            <view v-for="(goods, index) in goodsList" :key="index" @click="gotoDetail(goods)">
                <my-goods :goods='goods'></my-goods>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                // 请求参数对象
                queryObj: {
                    // 查询关键词
                    query: '',
                    // 商品分类Id
                    cid: '',
                    // 页码值
                    pagenum: 1,
                    // 每页显示多少条数据
                    pagesize: 10
                },
                // 商品列表的数据
                goodsList: [],
                // 商品列表的总数量
                total: 0,
                // 节流阀
                isLoading: false
            };
        },
        onLoad(options) {
            // 将页面参数转存到 this.queryObj 对象中
            this.queryObj.query = options.query || ''
            this.queryObj.cid = options.cid || ''

            // 获取商品列表的数据
            this.getGoodsList()
        },
        methods: {
            async getGoodsList(cb) {
                // 打开节流阀
                this.isLoading = true
                // 发送请求
                const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
                // 关闭节流阀
                this.isLoading = false
                // 当传递了回调函数，就执行
                cb && cb()
                if (res.meta.status !== 200) return uni.$showMsg()
                // 为数据赋值
                this.goodsList = [...this.goodsList, ...res.message.goods]
                this.total = res.message.total
            },
            gotoDetail(good){
                uni.navigateTo({url:'/subpkg/goods_detail/goods_detail?goods_id=' + good.goods_id})
            },
            // 上拉触底函数
            onReachBottom() {
                // 判断是否还有下一页的数据
                if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
                
                if(this.isLoading) return
                // 让页面值自增加 1
                this.queryObj.pagenum++
                this.getGoodsList()
            },
            onPullDownRefresh() {
                // 重置关键数据
                this.queryObj.pagenum = 1
                this.total = 0
                this.isLoading = false
                this.goodsList = []
                
                // 重新获取商品列表数据
                this.getGoodsList(()=> uni.stopPullDownRefresh())
            }
        }
    }
</script>

<style lang="scss">

</style>
