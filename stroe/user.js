export default {
    namespaced: true,
    state: () => ({
        address: JSON.parse(uni.getStorageSync('address') || '{}')
    }),
    mutations: {
        updateAddresss(state, address) {
            state.address = address
            this.commit('m_user/saveAddressToStorage')
        },
        // 定义将 address 持久化存储的方法
        saveAddressToStorage(state) {
            uni.setStorageSync('address', JSON.stringify(state.address))
        }
    },
    getters: {
        addstr(state) {
            if(!state.address.provinceName) return ''
            // 拼接 省，市，区，详细地址 的字符串并返回给用户
            return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
        }
    }
}