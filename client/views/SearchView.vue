<template>
<transition name="zoomInSmall">
<div class="view-search">
  <div class="search-tabs">
    <div class="search-tab" :class="{em:tab==='events'}"
         @click="switchTab('events')">EVENTS</div>
    <div class="search-tab" :class="{em:tab==='channels'}"
         @click="switchTab('channels')">CHANNELS</div>
  </div>
  <div class="search-panels">
    <transition name="slide-right">
    <div id="search-panel-events" class="search-panel"
         v-show="tab==='events'">
      <replay v-for="e in ev_filter(events, 3)" :e="e"></replay>
    </div>
    </transition>
    <transition name="slide-right">
      <div id="search-panel-channels" class="search-panel"
           v-show="tab==='channels'">
        <host-item v-for="e in channels" :e="e" :mode="'search'"></host-item>
      </div>
    </transition>
  </div>
</div>
</transition>
</template>
<script>
import Replay from '../components/listItem/Replay.vue'
import HostItem from '../components/listItem/HostItem.vue'
import { cached } from 'util/network'

function fetchData(store, force) {
  let _navBar = Object.assign({}, store.state.widget._navBar, {
    render: true,
    iBack: true,
    search: true,
  })
  store.dispatch('update_nav_bar', _navBar)
  if(!force && cached(store.state.logs, 'search_events_channels', 3))
    return Promise.resolve()
  const keyword = store.state.route.query.keyword
  if(!keyword) return
  store.dispatch('update_loading',{visible:true})

  return store.dispatch('search_events_channels', decodeURIComponent(keyword))
    .then(_=>store.dispatch('update_loading', {visible:false}))
}
export default {
  name: 'view-search',
  components: { Replay, HostItem },
  data() {
    return {
      keyword: '',
      tab: 'events',
    }
  },
  computed: {
    events(){return this.$store.getters.search_events},
    channels(){return this.$store.getters.search_channels},
  },
  preFetch: fetchData,
  methods: {
    ev_filter(events, num) {
      return events.filter(function(e){
        return e.event_status===num
      });
    },
    switchTab(tab){
      this.tab = tab
    }
  },
  beforeMount(){
    fetchData(this.$store)
  }
}
</script>
<style lang="stylus">
@import '~styl_var'
.view-search
  .search-tabs
    position fixed
    top h-nav
    width 100%
    left 0
    z-index z-nav
    height h-nav
    line-height h-nav
    font-size 13px
    background-color white
    border-bottom 1px solid c-border
    .search-tab
      float left
      width 50%
      text-align center
      color c-text-grey
      &.em
        color c-text
        font-weight bold
  .search-panels
    position relative
    margin-top 90px
    .search-panel
      background-color c-grey
      padding-bottom 15px
</style>
