<template>
<div class="video-box">
  <div class="player-box full" v-if="e.status!==-1">
    <video id="video" class="full" playsinline :poster="e.poster" controls>
      <source :src="e.src" type="application/x-mpegURL">
      <p>Your browser does not support html HLS video.</p>
    </video>
    <div id="video-controls" class="hide">
      <button type="button" id="play-pause">Play</button>
      <input type="range" id="seek-bar" value="0">
      <button type="button" id="mute">Mute</button>
      <input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1">
      <button type="button" id="full-screen">Full-Screen</button>
    </div>
    <header>
      <div class="nav-btn-box right">
        <i class="i-ic_live_close i-25" @click="goHome"></i>
      </div>
    </header>
    <footer></footer>
  </div>
  <div class="player-err full" v-if="!e||(e.status!==2&&e.status!==3)">
    <router-link to="/">
      <div class="full">Video may be deleted or never exist, click to Home</h1>
    </router-link>
  </div>
  <div class="video-info" v-if="e.status===2&&e.ended">
    <div>Live has ended</div>
  </div>
</div>
</template>
<script>
export default {
  name: 'video-box',
  data(){
    return {
      fullScreen: false,
    }
  },
  computed: {
    e(){return this.$store.getters.player},
    ua(){return this.$store.getters.ua},
  },
  methods:{
    goHome(){
      this.$router.push('/')
    },
    toggleFullScreen(){
      this.fullScreen = !this.fullScreen
    }
  }
}
</script>
<style lang="stylus">
.video-box
  position relative
  width 100%
  height 56.25vw
  background-color #71717b
  overflow hidden
  .player-box
    header
      position absolute
      top 0
      left 0
      width 100%
      height 45px
      .nav-btn-box
        height 45px//h-nav
        width 45px//h-nav
        padding 7.5px
  .player-err
    h1
      font-size 14px
      color white
      line-height 56.25vw
      text-align center

.portrait
  .video-box
    height 56.25vw
.landscape
  .video-box
    height 100%
</style>
