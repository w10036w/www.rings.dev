<template>
<div class="homeRank-wrapper full" v-show="homeRank">
  <div class="homeRank-mask full" @click="toggleHomeRank"></div>
  <div id="homeRank">
    <div class="selection" @click="switchSort(0)">
      Sort by recommendation
      <i class="i-checkbox-checked i-30" v-show="flag===0"></i>
    </div>
    <div class="selection" @click="switchSort(1)">
      Sort by popularity
      <i class="i-checkbox-checked i-30" v-show="flag===1"></i>
    </div>
    <div class="selection" @click="switchSort(2)">
      Sort by time
      <i class="i-checkbox-checked i-30" v-show="flag===2"></i>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'widget-home-rank',
  computed: {
    flag() { return this.$store.getters.sort_flag },
    homeRank() { return this.$store.getters.homeRank }
  },
  methods: {
    toggleHomeRank() {
      return this.$store.dispatch('toggle_home_rank', !this.homeRank)
    },
    switchSort(flag) {
      const self = this
      if(this.flag!==flag){
        self.$store.dispatch('update_loading', { visible:true })
        return self.$store.dispatch('switch_sort_flag', flag)
          .then(function(){
            return Promise.all([
              self.$store.dispatch('fetch_home_lives'),
              self.$store.dispatch('fetch_home_upcomings'),
            ])
          }).then(function(){
          self.$store.dispatch('update_loading', { visible:false })
          return self.toggleHomeRank()
        })
      } else return self.toggleHomeRank()
    },
  }
}
</script>
<style lang="stylus">
@import '~styl_var'
.homeRank-wrapper
  position fixed
  top h-nav
  z-index 800
  .homeRank-mask
    background-color rgba(black, .3)
#homeRank
  .selection
    position relative
    padding-left 15px
    height h-nav
    line-height h-nav
    border-bottom 1px solid c-border
    background-color white
    i
      position absolute
      top 7px
      right 13px
</style>
