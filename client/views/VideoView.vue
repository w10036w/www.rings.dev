<template>
<div class="view-video view-full_page flex redirect_col" v-show="!loading.visible">
  <video-box></video-box>
  <div class="stat-box">
    <div class="title ellipsis">{{e.title}}</div>
    <div class="info">
      <i class="event-type"
         :class="e.status===2?'i-live i-40-16':'i-replay i-40-16'"></i>
      <i class="i-watch i-16"></i> <span>
      {{e.watchCount}}</span>
      <span>|</span>
      <i class="i-like i-16"></i> <span>{{e.likeCount}}</span>
    </div>
    <i class="btn i-btn-like i-40" @click="likeUser"></i>
  </div>
  <fan-box></fan-box>
  <div class="flex redirect_col interaction-area" v-if="e.status===3">
    <div class="replay-tab-box" >
      <div class="replay-tabs flex">
        <div class="replay-tab replay-tab-replays"
             :class="{active:tab==='replays'}"
             @click="switchTab('replays')">Replays</div>
        <div class="replay-tab replay-tab-msg"
             :class="{active:tab==='msg'}"
             @click="switchTab('msg')">Comments</div>
      </div>
    </div>
    <div class="msg-area grow_1" v-show="tab==='msg'">
      <msg v-for="e in replay_msg" :e="e"></msg>
    </div>
    <div class="replays-area grow_1" v-show="tab==='replays'">
      <replay v-for="e in video_replays" :e="e" :mode="'profile'"></replay>
    </div>
  </div>
  <div class="flex redirect_col interaction-area" v-else>
    <div class="msg-area" id="live-msg">
      <msg v-for="e in live_msg" :e="e"></msg>
    </div>
  </div>
</div>
</template>
<script>
import FanBox from '../components/item/FanBox.vue'
import VideoBox from '../components/item/VideoBox.vue'
import Replay from '../components/listItem/Replay.vue'
import Msg from '../components/listItem/Msg.vue'
import { mapActions, mapGetters } from 'vuex'
import { cached } from 'util/network'
import { smoothScroll } from 'util/dom'
import chat from 'util/chat'
import { websocketHost } from 'config'

function fetchData(store, force) {
  if(!force && cached(store.state.logs, 'fetch_video', 2))
    return Promise.resolve()
  store.dispatch('update_loading',{visible:true})
  const cid = store.state.route.params.cid
  const sid = store.state.route.params.sid
  //TODO: validation
  return Promise.all([
    store.dispatch('fetch_video', { cid, sid }),
  ]).then(_=>{
    const hid = store.getters.player.hid
    const status = store.getters.player.status
    if(!hid) return Promise.resolve()
    return Promise.all([
      store.dispatch('fetch_video_top_fans', {cid, sid}),
      store.dispatch('fetch_video_host_replays', {hid}),
      store.dispatch('fetch_video_stat', {cid, sid}),
      store.dispatch('update_nav_bar'),
      status==2?
        store.dispatch('fetch_live_msg', {cid}):
        store.dispatch('fetch_replay_msg', {sid}),
    ])
  }).then(_=>{
    return store.dispatch('update_loading', {visible:false})
  })
}

export default {
  name: 'view-video',
  components: { VideoBox, FanBox, Replay, Msg },
  data() {
    return {
      bLiveEnd: false,
      bFullScreen: false,
      tab: 'replays',
    }
  },
  computed: {
    e(){return this.$store.getters.player},
    video(){return this.$store.getters.video},
    video_stat(){return this.$store.getters.video_stat},
    video_replays(){return this.$store.getters.video_host_replays},
    ua(){return this.$store.getters.ua},
    loading(){return this.$store.getters.loading},
    live_msg(){return this.$store.getters.live_msg},
    replay_msg(){return this.$store.getters.replay_msg},
  },
  preFetch: fetchData,
  watch:{
    '$route.params.sid'() {
      video.pause()
      return fetchData(this.$store)
        .then(_=>{
          document.getElementById('video').load()
          this.connectWS()
        })
    },
    live_msg() {
      this.$nextTick(_=>{
        this.liveMsg2Btm()
      })
    }
  },
  methods: {
    toggleWidgetProfile(uid) {
      this.$store.dispatch('toggle_widget_profile', uid)
    },
    likeUser() {
      if(this.$store.state.ua.bApp){
        // TODO: inApp logic
      } else {
        this.$store.dispatch('toggle_modal', 'app-interaction')
      }
    },
    switchTab(tab){
      this.tab = tab
    },
    connectWS() {
      const cid = this.$store.state.route.params.cid
      const sid = this.$store.state.route.params.sid
      chat.connect(websocketHost, {
        userID: uid,
        roomID: cid
      }, this.live_msg)
    },
    liveMsg2Btm() {
      let dom = document.getElementById('live-msg')
      smoothScroll(0, dom.scrollHeight, dom)
    }
  },
  beforeMount() {
    fetchData(this.$store).then(_=>{
      if(this.e.status===2) {
        this.connectWS()
        this.liveMsg2Btm()
      }
    })
  },
}
</script>
<style lang="stylus">
@import '~styl_var'
.view-video
  .stat-box
    position relative
    width 100%
    padding-left 15px
    padding-top 10px
    height 64px
    line-height 26px
    background-color white
    .title
      margin-right 65px
    .info
      font-size 13px
      .event-type
        margin-right 10px
      span
        display inline-block
        vertical-align top
        margin-top -4px
        margin-right 8px
        color c-text-grey
    .i-btn-like
      position absolute
      top 12px
      right 15px
  .replay-tab-box
    width 100%
    height h-nav
    padding 8px 10%
    background-color white
    border-bottom .5px solid c-border
    font-size 13px
    .replay-tabs
      height 100%
    .replay-tab
      width 50%
      height 100%
      text-align center
      line-height 26px
      color c-blue
      border .5px solid c-blue
      &.active
        border none
        color white
        background-color c-blue
    .replay-tab-replays
      border-top-left-radius 28px
      border-bottom-left-radius 28px
    .replay-tab-msg
      border-top-right-radius 28px
      border-bottom-right-radius 28px
  .replays-area, .msg-area
    width 100%
    overflow scroll
.portrait
  .interaction-area
    flex 1
.landscape
  .interaction-area
    display none
  .stat-box
    display none
  .fan-box
    position absolute
    top 0
    left 0
</style>
