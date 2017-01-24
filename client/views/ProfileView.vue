<template>
<transition name="fade">
<div class="view-profile" v-if="!loading.visible">
  <nav class="fixed-top" :class="navTitleOpacity===1?'bg-white':''">
    <div class="title ellipsis"
        :style="'opacity:'+navTitleOpacity">{{p.name}}</div>
    <div class="nav-btn-box left">
      <i class="i-ic_browser_backward i-30" @click="goBack"></i>
    </div>
    <div class="nav-btn-box right">
      <i class="i-ic_browser_share i-30" @click="snsShare"></i>
    </div>
  </nav>
  <div class="host-box">
    <div class="host-profile">
      <div class="avatar i-70 i-rad i-cover">
      <img :src="p.avatar">
    </div>
    <div class="name">{{p.name}}</div>
    <div class="info">USER ID: {{p.user_id}}</div>
    <div class="btn btn-blue-h btn-follow-host-small"
         @click="followUser">Follow</div>
    </div>
    <div class="tabs flex align_center" :class="{'fixed-tabs':navTitleOpacity===1}">
      <div class="tab grow_1" :class="{active:tab==='event'}"
           @click="switchTab('event')">
        <div class="num">{{p.replay_count}}</div>
        <div class="sub">Broadcast</div>
      </div>
      <div class="tab grow_1" :class="{active:tab==='follower'}"
           @click="switchTab('follower')">
        <div class="num">{{p.follower_count}}</div>
        <div class="sub">Followers</div>
      </div>
      <div class="tab grow_1" :class="{active:tab==='following'}"
           @click="switchTab('following')">
        <div class="num">{{p.following_count}}</div>
        <div class="sub">Following</div>
      </div>
      <span class="dot" :class="tab"></span>
    </div>
    <div class="panels" :class="{'padding-panels':navTitleOpacity===1}">
      <transition name="fade">
      <div class="panel event-panel" v-show="tab==='event'">
        <home-live v-for="e in ev_filter(events, 2)"
                   :e="e" :mode="mode"></home-live>
        <home-upcoming v-for="e in ev_filter(events, 1)"
                       :e="e" :mode="'profile'"></home-upcoming>
        <h3 class="tag">REPLAY</h3>
        <replay v-for="e in ev_filter(events, 3)"
                :e="e" :mode="mode"></replay>
        <div class="loading-bar" v-show="mScrollBtmWait && !home_upcomings_end">
          <i class="i-loading-bubble i-50"></i>
        </div>
      </div>
      </transition>
      <transition name="fade">
      <div class="panel" v-show="tab==='follower'">
        <host-item :mode="mode" v-for="e in followers"
                   :e="e"></host-item>
      </div>
      </transition>
      <transition name="fade">
      <div class="panel" v-show="tab==='following'">
        <host-item :mode="mode" v-for="e in followings"
                   :e="e"></host-item>
      </div>
      </transition>
    </div>
  </div>
</div>
</transition>
</template>
<script>
import HostItem from '../components/listItem/HostItem.vue'
import HomeLive from '../components/listItem/HomeLive.vue'
import HomeUpcoming from '../components/listItem/HomeUpcoming.vue'
import Replay from '../components/listItem/Replay.vue'
import { cached } from 'util/network'
import { scrollBtmLoadMore } from 'mixin'

function fetchData(store, force) {
  if(!force && cached(store.state.logs, 'fetch_profile'))
    return Promise.resolve()
  const uid = store.state.route.params.uid
  store.dispatch('update_loading',{visible:true})
  store.dispatch('update_nav_bar')
  return store.dispatch('fetch_profile_details', uid)
    .then(function(){
      store.dispatch('update_loading', {visible:false})
    })
}
function scrollFixedTab(self, on) {
  if (on)
    document.addEventListener('scroll', self.scrollListener)
  else
    document.removeEventListener('scroll', self.scrollListener)
}

export default {
  name: 'view-profile',
  mixins: [ scrollBtmLoadMore ],
  components: { HostItem, HomeLive, HomeUpcoming, Replay },
  preFetch: fetchData,
  data(){
    return {
      navTitleOpacity: 0,
      tab: 'event',
      fixedTab: false,
      mode: 'profile',
    }
  },
  computed: {
    loading() {return this.$store.getters.loading},
    events() {return this.$store.getters.user_events},
    events_end() {return this.$store.getters.user_events_end},
    followers() {return this.$store.getters.user_followers},
    followers_end() {return this.$store.getters.user_followers_end},
    followings() {return this.$store.getters.user_followings},
    followings_end() {return this.$store.getters.user_followings_end},
    p() {return this.$store.getters.profile.profile},
    ua() {return this.$store.getters.ua},
  },
  watch: {
    '$route.params.uid'() {
      console.log('changed')
      return fetchData(this.$store)
        .then(_=>this.updateShareData())
    }
  },
  methods:{
    goBack(){this.$router.go(-1)},
    snsShare() {this.$store.dispatch('toggle_share_box', true)},
    switchTab(tab) {
      this.tab = tab
    },
    // scroll listener for title opacity and fixedTab
    // do it in a mixin in future
    scrollListener(){
      const pY = window.scrollY
      if(pY<=55) this.navTitleOpacity = 0
      else if(pY>55 && pY<=185)
        this.navTitleOpacity = (pY-55)/130
      else this.navTitleOpacity = 1
      //this.fixedTab = true
      //this.fixedTab = false
    },
    followUser() {
      //console.log('follow '+this.p.user_id)
      if(this.ua.bApp) {

      }else this.$store.dispatch('toggle_modal', 'app-follow')
    },
    ev_filter(events, num) {
      return events.filter(function(e){
        return e.event_status===num
      });
    },
    updateShareData() {
      const self = this
      let opts = {
        redirect: 'https://rings.tv'+location.pathname,
        img: self.p.avatar,
        title: self.p.name,
        link: 'https://rings.tv'+location.pathname,
        desc: self.p.tagline.substr(0,21)+'...',
      }
      return self.$store.dispatch('update_share_data', opts)
    },
    // for mixins
    mScrollBtmTrigger() {
      return !this[`${this.tab}s_end`]
    },
    mScrollBtmCb() {
      const uid = this.p.user_id
      return this.$store.dispatch(`fetch_user_${this.tab}s`,
        { uid, _init:false})
    }
  },
  beforeMount() {
    const self = this
    fetchData(this.$store)
      .then(_=>this.updateShareData())
  },
  mounted() {
    scrollFixedTab(this, true)
  },
  deactivated(){
    scrollFixedTab(this)
  },
}
</script>
<style lang="stylus">
.view-profile
  nav
    text-align center
    background-color rgba(white, .7)
  .host-box
    position relative
    padding-top 45px//h-nav
    background-color white
    .host-profile
      text-align center
      .avatar
        display inline-block
        margin-top 10px
        margin-bottom 13px
      .name
        font-weight bold
        line-height 1.4
      .info
        font-size 13px
        color #71717b
      .btn-follow-host-small
        display inline-block
        margin-top 30px
        border-radius 25px
        width 80px
        height 25px
        line-height 23.5px
        font-size 13px
        font-weight 400
    .tabs
      height 60px
      text-align center
      background-color white
      &.fixed-tabs
        position fixed
        top 45px//h-nav
        left 0
        width 100%
        z-index: 100//z-nav
        border-bottom .5px solid #e2e2e2
        border-top .5px solid #e2e2e2
      .tab
        .num
          font-weight 600
          line-height 1.4
        .sub
          color #71717b
          font-size 10px
          font-weight 200
        &.active
          .num, .sub
            color #0db8f6
    .panels
      &.padding-panels
        padding-top 60px
      .event-panel
        padding-top 15px
      .panel
        background-color #e2e2e2
        .tag
          height 18px
          padding-left 15px//l-pad
          font-size 13px
      .loading-bar
        height 60px
        text-align center
        padding-top 5px
</style>
