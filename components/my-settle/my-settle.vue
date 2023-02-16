<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullcheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkoutedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkoutCount}})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        second: 3,
        timer: null
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkoutCount', 'total', 'checkoutedGoodsAmount']),
      ...mapGetters('m_user', ['addStr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullcheck() {
        return this.total === this.checkoutCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullcheck)
      },
      // 用户点击了结算按钮
      settlement() {
        // 先判断是否勾选了要结算的商品
        if (!this.checkoutCount) return uni.$showMsg('请选择要结算的商品！')

        // 在判断用户是否选择了收货地址
        if (!this.addStr) return uni.$showMsg('请选择收货地址！')

        // 最后判断用户是否登录了
        if (!this.token) return this.delayNavigate
        
        this.payOrder()
      },
      
      async payOrder() {
        // 1 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // 商品总价格
          oeder_price: this.checkoutedGoodsAmount,
          // 订单收货地址
          consignee_addr: this.addStr,
          // 商品信息
          goods: this.cart.filter(good => good.goods_state).map(good => ({
            goods_id: good.goods_id,
            goods_number: good.goods_count,
            goods_price: good.goods_price
          }))
        }
        
        // 1.2 发起请求创建订单
        const {data: res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if( res.meta.status !== 200 ) return uni.$showMsg('创建订单失败')
        
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number
        
        // 2 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {data: res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber})
        
        // 2.2 预付订单生成失败
        if(res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败')
        
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        
        // 3 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        
        // 3.2 未完成支付
        if(err) return uni.$showMsg('支付失败')
        
        // 3.3 完成了支付，进一步查询支付的结果
        const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
        
        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        
       // 3.5 检测到订单支付完成
       uni.showToast({
         title: '支付完成！',
         icon: 'success'
       })
      },

      // 若未登录，延时导航到 my 页面
      delayNavigate() {
        this.second = 3
        this.showTips(this.second)
        this.timer = setInterval(() => {
          this.second--
          if (this.second <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.second)
        }, 1000)
      },
      // 展示倒计时的提示信息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算，' + n + '后跳转到登录页',
          mask: true,
          duration: 1500
        })
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

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
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
