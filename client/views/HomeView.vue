<template>
<div class="view-home">
  <div class="home-tabs row">
    <div class="home-tab btn" :class="!tab||tab==='lives'?'em':''"
         @click="switchTab('lives')">LIVE</div>
    <div class="home-tab btn" :class="tab==='upcomings'?'em':''"
         @click="switchTab('upcomings')">UPCOMING</div>
    <div class="home-tab btn" :class="tab==='replays'?'em':''"
         @click="switchTab('replays')">REPLAY</div>
  </div>
  <main class="home-panels">
    <transition name="slide-left" mode="in-out">
    <div class="panel" v-if="!tab||tab==='lives'" key="lives">
      <home-banner></home-banner>
      <div id="lives" v-if="home_lives.length">
        <home-live v-for="e in home_lives"
                   :e="e" :key="e.video_session_id"></home-live>
      </div>
      <div id="nolives" v-else>
        No Lives
      </div>
    </div>
    <div class="panel" v-else-if="tab==='upcomings'" key="upcomings">
      <div id="upcomings" v-if="home_upcomings.length">
        <home-upcoming v-for="e in home_upcomings"
                       :e="e" :key="e.event_id"></home-upcoming>
        <div class="loading-bar" v-show="mScrollBtmWait && !home_upcomings_end">
          <i class="i-loading-bubble i-50"></i>
        </div>
      </div>
      <div id="noupcomings" v-else>
        No Upcomings
      </div>
    </div>
    <div class="panel" v-else key="replays">
      <div id="replays" v-if="home_replays.length">
        <home-replay v-for="e in home_replays"
                     :e="e" :key="e.video_session_id"></home-replay>
      </div>
      <router-link to="/replays/?sort=2">
        <div class="btn act-recent_replays">
          <b>Watch recent videos</b></div>
      </router-link>
    </div>
    </transition>
    <transition name="fade">
      <home-rank v-show="homeRank"></home-rank>
    </transition>
  </main>
</div>
</template>
<script>
import HomeLive from '../components/listItem/HomeLive.vue'
import HomeUpcoming from '../components/listItem/HomeUpcoming.vue'
import HomeReplay from '../components/listItem/HomeReplay.vue'
import HomeRank from '../components/widget/HomeRank.vue'
import HomeBanner from '../components/widget/HomeBanner.vue'
import { mapGetters } from 'vuex'
import { cached } from 'util/network'
import { ifBtm, smoothScroll, scrollBtm } from 'util/dom'
import { scrollBtmLoadMore } from 'mixin'

function fetchData(store, force) {
  if(!force && cached(store.state.logs, 'fetch_home_lives'))
    return Promise.resolve()
  store.dispatch('update_loading')
  let navObj = Object.assign({}, store.state.widget._navBar, {
    render: true,
    iMenu: true,
    iSearch: true,
    iSort: true,
    logo: true
  })
  return Promise.all([
    store.dispatch('fetch_home_lives'),
    store.dispatch('fetch_home_upcomings'),
    store.dispatch('fetch_home_replays'),
    store.dispatch('fetch_home_banner'),
    store.dispatch('update_nav_bar', navObj),
  ]).then(function(){
    return store.dispatch('update_loading', {visible:false})
  })
}

export default {
  name: 'view-home',
  mixins: [ scrollBtmLoadMore ],
  // mixins for infinite scroll, to solve directives ssr window/document undefined issues
  components: { HomeLive, HomeUpcoming, HomeReplay,
    HomeRank, HomeBanner },
  data() {
    return {
      tab: this.$route.hash.replace('#', ''),
    }
  },
  preFetch: fetchData,
  beforeMount() {
    fetchData(this.$store)
  },
  methods: {
    switchTab(tab) {
      this.tab = tab
      this.$router.push(`#${tab}`)
      smoothScroll(0,0)
    },
    openDrawer() {
      console.log('open drawer')
    },
    // for mixins for infinite scroll,
    mScrollBtmTrigger() {
      return !this.home_upcomings_end && this.tab==='upcomings'
    },
    mScrollBtmCb() {
      const self = this
      const start = self.home_upcomings.length
      return self.$store.dispatch('append_home_upcomings', {start})
    }
  },
  computed: {
    ...mapGetters([
      'home_lives', 'home_upcomings', 'home_upcomings_end', 'home_replays',
      'flash', 'logs', 'homeRank', 'loading', 'sort_flag',
    ]),
  },
  watch: {
    tab(){
      let curNavBar = this.$store.getters.navBar
      let navObj_w_sort = Object.assign({}, curNavBar, {
        iSort: true
      })
      let navObj_wo_sort = Object.assign({}, curNavBar, {
        iSort: false
      })
      if(this.tab==='replays')
        this.$store.dispatch('update_nav_bar', navObj_wo_sort)
      else
        this.$store.dispatch('update_nav_bar', navObj_w_sort)
    }
  }
}
</script>
<style lang="stylus">
@import '~styl_var'
.view-home
  .home-tabs
    position fixed
    top h-nav
    width 100%
    left 0
    z-index 100
    height h-nav
    line-height h-nav
    font-size 13px
    background-color white
    border-bottom 1px solid c-border
    .home-tab
      float left
      width 33.3%
      text-align center
      color c-text-grey
      &.em
        color c-text
        font-weight bold
  main
    position relative
    margin-top 90px
    >.panel
      background-color c-grey
      padding-bottom 15px
      padding-top 15px
      transition all .3s
      .loading-bar
        height 60px
        text-align center
        padding-top 5px
      .act-recent_replays
        margin 20px 15px 0 15px
        padding 10px 0
        background-color white
        border-radius 10px
        color c-blue
</style>