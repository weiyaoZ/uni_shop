import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from '@/stroe/cart.js'
import moduleUser from '@/stroe/user.js'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        m_cart: moduleCart,
        m_user: moduleUser
    }
})