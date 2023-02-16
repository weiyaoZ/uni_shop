<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 获取用户的基本信息
      getUserInfo(e) {
        // 判断是否获取用户信息成功过
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')

        // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
        this.updateUserInfo(e.detail.userInfo)

        this.getToken(e.detail)
      },
      async getToken(info) {
        // 获取 code 对应的值
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginResult.meta.status !== 200) {
          this.updateToken(loginResult.meta.msg)
          uni.$showMsg('登录成功！')
          this.navigeteBack()
        }
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')

        // 直接把 token 保存到 vuex 中
        // this.updateToken(loginResult.message.token)
      },

      navigeteBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;

    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 80rpx;
      left: 0;
      bottom: 0;
      background-color: #fff;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 30rpx 0;
      background-color: #C00000;
    }

    .tips-text {
      color: gray;
      font-size: 24rpx;
    }
  }
</style>
