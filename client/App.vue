<template>
<div id="app">
  <div class="app-wrapper">
    <transition :name="tranName">
      <nav-bar></nav-bar>
    </transition>
    <transition :name="tranName">
      <router-view class="view"></router-view>
    </transition>
    <widget></widget>
    <div id="iframe-app-bridge"></div>
  </div>
</div>
</template>
<script>
import NavBar from './components/widget/NavBar.vue'
import Widget from './components/widget/index.vue'
export default{
  name: 'app',
  components: { NavBar, Widget },
  data() {
    return {
      tranName: 'slide-right'
    }
  },
  computed:{
    ua() {return this.$store.getters.ua}
  },
  watch: {
    '$route'(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.tranName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
  beforeMount() {
    const self = this
    const userAgent = navigator.userAgent.toLowerCase()
    return self.$store.dispatch('update_ua', userAgent)
      .then(function(){
        if(self.ua.bApp) {
          const auth = {
            uid: self.$route.query.userId,
            token: self.$route.query.token
          }
          self.$store.dispatch('update_auth', auth)
        }
      })
  }
}
</script>
<style lang="stylus">
@import app
#iframe-app-bridge
  display none
</style>
