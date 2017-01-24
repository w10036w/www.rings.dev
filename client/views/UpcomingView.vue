<template>
<div class="view-upcoming" v-if="!loading.visible">
  <div class="cd-box">
    <div class="pre-start" v-if="e.event_start_time>Date.now()">
      <div>GO LIVE Countdown <span>{{e.event_start_time|ts2cd}}</span></div>
    </div>
    <div class="about-start" v-else>Live streaming is about to start</div>
  </div>
  <div class="upcoming-poster" :style="'background-image:url('+e.event_poster1+')'"></div>
  <div class="upcoming-text">
    <div class="title">{{e.event_title}}</div>
    <div class="info">
      {{e.event_start_time|ts2hiDdmy}}
      <span class="space-3"></span>
      {{e.upcoming_info.register_count}} Interested</div>
    <div class="intro">Introduction</div>
    <div class="desc" v-html="e.event_description"></div>
  </div>
  <host-item class="fixed-host-box" :e="e.channel" :mode="mode"></host-item>
  <div class="remind-box fixed-btm">
    <div v-if="ua.bApp">
      <div class="remind-upcoming" v-if="e.event_start_time>Date.now()">

      </div>
      <div class="remind-video" v-else>
        <div v-if="video.status===0" @click="openProfile">Go to Channel</div>
        <div v-else @click="watchVideo">
          {{video.status===2?'Watch Live':'Watch Replay'}}</div>
      </div>
    </div>
    <app-bridge v-else :action="video"></app-bridge>
  </div>
</div>
</template>
<script>
import HostItem from '../components/listItem/HostItem.vue'
import AppBridge from '../components/widget/AppBridge.vue'
import { cached } from 'util/network'
import { inApp, invokeApp } from 'util/client'

function fetchData(store, force){
  const _navBar = Object.assign({}, store.state.widget._navBar, {
    render:true,
    iBack: true,
    iShare: true,
    iTitle: true,
  })
  if(!force && cached(store.state.logs, 'fetch_upcoming_detail'))
    return Promise.resolve()
  store.dispatch('update_loading', {visible:true})
  const eid = store.state.route.params.eid
  const uid = store.state.route.query.uid
  return Promise.all([
    store.dispatch('update_nav_bar', _navBar),
    store.dispatch('fetch_upcoming_detail', { eid, uid }),
    store.dispatch('fetch_event_live_replay', { eid }),
  ]).then(_=>{
    let title = store.getters.upcoming_detail.event_title
    const _navBar = Object.assign({}, store.getters.navBar, {
      title
    })
    return store.dispatch('update_nav_bar', _navBar)
  }).then(function(){
    return store.dispatch('update_loading', {visible:false})
  })
}

export default {
  name: 'view-upcoming',
  components: { HostItem, AppBridge },
  preFetch: fetchData,
  data() {
    return {
      mode: 'host',
    }
  },
  computed: {
    ua() {return this.$store.getters.ua},
    loading() {return this.$store.getters.loading},
    e() {return this.$store.getters.upcoming_detail},
    r() {return this.$store.getters.upcoming_detail},
    e_ts() {return this.$store.getters.upcoming_detail_ts},
    e_ts() {return this.$store.getters.upcoming_detail_ts},
    video() {
      const events = this.$store.getters.event_live_replay
      //0 go to channel, 1 event, 2 live, 3 replay
      if(events.length) {
        const status = events[0].event_status
        const cid = events[0].channel.channel_id
        const sid = events[0].video_session_id
        const uid = events[0].channel.user_id
        return { status, cid, sid, uid }
      }
      return { status:0 }
    },
  },
  methods: {
    goBack() { this.$router.go(-1) },
    share() {
      //TODO
      //this.$store.dispatch('update_share_info', obj)
      this.$store.dispatch('toggle_share_box', true)
    },
    //TODO
    openProfile() {
      if(!this.ua.bApp) {

      }else{

      }
    },
    watchVideo() {
      if(!this.ua.bApp) {
        const os = this.ua.os
        const webview = this.ua.webview
        if(os==='desktop'&&os==='mac') {
          this.$router.push(`/s/${this.video.cid}/${this.video.sid}`)
        }else if(webview!=='wechat'&&os==='android') {

        }
        if(webview){
          invokeApp.video(this.video.cid, this.video.sid)
        }

        if(os==='android') {
          invokeApp.video(this.video.cid, this.video.sid)
        }
        if(os==='android')

        //fallback
        setTimeout(function(){
          this.$router.push(`/s/${this.video.cid}/${this.video.sid}`)
        }, 1000)
      }else{
        //in App
        inApp.openVideo(this.video.cid, this.video.sid)
      }
    },
    downloadApp() {
      const os = this.ua.os
      const webview = this.ua.webview
      if(os==='mac'){
        location.href = this.$store.state.appInfo.download.ios
      }
      if(webview&&os==='ios') {

      }
    }
  },
  beforeMount() {
    const self = this
    fetchData(this.$store).then(function(){
      let opts = {
        redirect: 'https://rings.tv'+location.pathname,
        img: self.e.event_poster1,
        title: self.e.event_title,
        link: 'https://www.rings.tv'+location.pathname,
        desc: self.e.event_description.substr(0,21)+'...',
      }
      return self.$store.dispatch('update_share_data', opts)
    })
  },

}
</script>
<style lang="stylus">
.view-upcoming
  padding-top 45px//h-nav
  padding-bottom 190px
  background-color white
  nav
    border-bottom 1px solid #e2e2e2
  .cd-box
    width 100%
    height 30px
    bottom 4px
    line-height 30px
    color white
    background-color rgba(black,.5)
    font-size 12px
    .pre-start
      padding-left 15px
      padding-right 15px
      span
        float right
    .about-start
      text-align center
  .upcoming-poster
    padding-bottom 56.25%
    background-size cover
  .upcoming-text
    padding 30px 15px 50px
    .title
      font-size 18px
      font-weight bold
    .info
      line-height 2.5
      font-weight 300
      color #71717b
    .intro
      line-height 1.8
      font-weight bold
      font-size 17px
    .desc
      color #71717b
      line-height 1.4
  .remind-box
    width 100%
    height 130px
  .fixed-host-box
    position fixed!important
    left 0
    bottom 130px
</style>
