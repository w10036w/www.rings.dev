<template>
<nav class="fixed-top border-btm" v-if="nav.render">
  <div class="title ellipsis" v-if="nav.iTitle">{{nav.title}}</div>
  <div class="search-bar" v-if="nav.search">
    <input id="keyword" type="text" v-model="keyword" @keyup.enter="searchEventsChannels" />
  </div>
  <div class="nav-btn-box left" v-if="nav.iBack">
    <i class="i-ic_browser_backward i-30" @click="goBack"></i>
  </div>
  <div class="nav-btn-box left" v-if="nav.iMenu">
    <i class="i i-menu i-30" @click="openMenu"></i>
  </div>
  <i class="i i-ringstv i-90-30 logo" v-if="nav.logo"></i>
  <div class="nav-btn-box right" v-if="nav.iSearch">
    <router-link to="/search">
      <i class="i i-ic_search i-30"></i>
    </router-link>
  </div>
  <div class="nav-btn-box right" v-if="nav.iSort">
    <i class="i i-ic_sort i-30"
       @click="toggleHomeRank"></i>
  </div>
  <div class="nav-btn-box right" v-if="nav.iShare">
    <i class="i-ic_browser_share i-30"
       @click="snsShare"></i>
  </div>
</nav>
</template>
<script>
export default {
  name: 'nav-bar',
  data(){
    return {
      keyword: ''
    }
  },
  computed: {
    nav() { return this.$store.getters.navBar },
    homeRank() { return this.$store.getters.homeRank },
  },
  methods: {
    goBack(){this.$router.go(-1)},
    snsShare(){
      this.$store.dispatch('toggle_share_box', true)
    },
    toggleHomeRank(){
      this.$store.dispatch('toggle_home_rank', !this.homeRank)
    },
    openMenu(){},
    searchEventsChannels() {
      const kw = encodeURIComponent(this.keyword)
      this.$store.dispatch('search_events_channels', kw)
    }
  },
  activated(){
    if(this.search && window){
      document.getElementById('keyword').focus()
    }
  },
}
</script>
<style lang="stylus">
@import '~styl_var'
nav
  left 0
  width 100%
  z-index z-nav
  height h-nav
  line-height h-nav
  background-color white
  .nav-btn-box
    height h-nav
    width h-nav
    padding 7.5px
  .logo
    vertical-align middle
  .title
    position absolute
    width 100%
    height 100%
    text-align center
    padding 0 h-nav
    z-index -1
  .search-bar
    position absolute
    width 100%
    height 100%
    z-index -1
    padding-left h-nav
    input
      width 97%
      height 35px
      line-height 20px
      background-color #eaebed
      border 1px solid c-border
      color #4a4a4a
      padding-left 5px
      font-size 16px
      border-radius 5px
      vertical-align middle
  &.bg-white
    background-color white!important
</style>
