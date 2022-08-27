export default {
    namespaced: true,
    state: () => ({
        // 购物车的数组，用来存储购物车中每个商品的信息对象
        // 每个商品的信息对象，都包含如下 6 个属性：
        // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
        cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
    }),
    mutations: {
        addToCart(state, goods) {
            // 判断是否存在该商品
            const findResult = state.cart.find((x)=> x.goods_id === goods.goods_id)
            
            if(!findResult) {
                // 如果购物车中没有这件商品，则直接 push
                state.cart.push(goods)
            } else {
                // 如果购物车有这件商品，则更新数量
                findResult.goods_count ++
            }
            this.commit('m_cart/saveToStorage')
        },
        // 持久化存储商品信息
        saveToStorage(state) {
            uni.setStorageSync('cart', JSON.stringify(state.cart))
        },
        // 更新购物车中商品的勾选状态
        updateGoodsState(state, goods) {
            const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
            if(findResult) {
                findResult.goods_state = goods.goods_state
                this.commit('m_cart/saveToStorage')
            }
        },
        // 更新购物车中商品的数量
        updateGoodsCount(state, goods) {
            const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
            if(findResult) {
                findResult.goods_count = goods.goods_count
                // 持久化存储
                this.commit('m_cart/saveToStorage')
            }
        },
        // 删除购物车中的某个商品
        removeGoodsById(state, goods_id) {
            // 过滤出不删除的商品
            state.cart = state.cart.filter(x => x.goods_id !== goods_id)
            // 持久化存储
            this.commit('m_cart/saveToStorage')
        },
        // 更新购物车中所有的商品的勾选状态
        updateAllGoodsState(state, newState) {
            state.cart.forEach(x => x.goods_state = newState)
            this.commit('m_cart/saveToStorage')
        }
    },
    getters: {
        // 购物车中所有商品的总数量
        total(state) {
            // let c = 0
            // // 循环统计商品数量，累加到变量 c 中
            // state.cart.forEach(goods => c += goods.goods_count)
            // return c
            
            return state.cart.reduce((total,item) => total += item.goods_count, 0)
        },
        // 购物车中已勾选商品的总数量
        checkoutCount(state) {
            // 先使用 filter 方法，从购物车中过滤器已勾选的商品
            // 再使用 reduce 方法，将已勾选的商品总数量进行累加
            // reduce() 的返回值就是已勾选的商品的总数量
            return state.cart.filter(x=> x.goods_state).reduce((total, item) => total += item.goods_count, 0)
        },
        // 购物车中已勾选商品的总价格
        checkoutedGoodsAmount(state) {
            return state.cart.filter(x => x.goods_state)
                             .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
                             .toFixed(2)
        }
    }
}
