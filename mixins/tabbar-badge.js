import {
  mapGetters
} from 'vuex';

export default {
  methods: {
    setBadge() {
      if (this.total) {
        uni.setTabBarBadge({
          index: 2,
          text: this.total + ''
        })
      }
    }
  },
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  watch: {
    total() {
      this.setBadge()
    }
  },
  onShow() {
    this.setBadge()
  }
}
