<template>
<div id="app-bridge" class="fixed-btm" v-show="appBridge">
  <h4>Install & open our app to get notified when this event goes live.</h4>
  <div class="btn-group flex space_around align_center">
    <div class="btn btn-blue" @click="openApp">Open in App</div>
    <div class="btn btn-blue-h" @click="downloadApp">Download App</div>
  </div>
</div>
</template>
<script>
import { invokeApp, appInfo } from 'util/client'
export default {
  name: 'widget-app-bridge',
  props: ['action'],
  computed: {
    appBridge() {return this.$store.getters.appBridge},
    ua() {return this.$store.getters.ua},
  },
  methods: {
    openApp() {
      invokeApp.home(device.ios() && !this.ua.webview)
    },
    downloadApp() {
      let link
      if(this.ua.os==='ios')
        link = appInfo.download.appStore
      else if(this.ua.webview==='wechat')
        link = appInfo.download.yingyongbao
      else if(this.ua.os==='android')
        link = appInfo.download.playStore
      location.href = link
    },
  },
  beforeMount(){
    if(!this.ua.bApp) {
      return this.$store.dispatch('toggle_app_bridge', true)
    }
  }
}
</script>
<style lang="stylus">
#app-bridge
  width 100%
  height 130px
  left 0
  background-color white
  border-top 1px solid #e2e2e2
  h4
    height 30px
    line-height 35px
    color #2c2c30
    font-size 11px
    text-align center
  .btn-group
    height 60px
  .btn
    width 150px
    height 40px
    line-height 40px
    border-radius 25px
</style>
