<template>
<div class="host-item" >
  <i class="i-cover i-44 i-rad avatar"
     :style="'background-image:url('+e.avatar+')'"
     @click="openProfile">
  </i>
  <div class="text" @click="openProfile">
    <div class="title ellipsis"
        :class="{no_info:mode!=='host'}">
      {{e.user_name||e.name}}</div>
    <div class="info" v-if="mode==='host'">
      <span v-if="mode!=='search'">{{e.broadcast_count}} broadcasts</span>
      <span>{{e.follower_count}} followers</span>
    </div>
  </div>
  <div class="btn btn-hollow btn-blue-h" @click="followUser">Follow</div>
</div>
</template>
<script>
export default {
  name: 'item-host-item',
  props: ['e', 'mode'],
  computed:{
    ua(){return this.$store.getters.ua},
  },
  methods: {
    // in util
    followUser() {
      const uid = this.e.user_id
      if(this.ua.bApp){ //in app

      }else{ //not in app
        this.$store.dispatch('toggle_modal', 'app-follow')
      }
    },
    openProfile() {
      const uid = this.e.user_id
      if(this.ua.bApp){

      }else if(this.mode==='widget'){
        this.$store.dispatch('toggle_widget_profile', uid)
      }else{
        this.$router.push(`/u/${uid}`)
      }

    }
  },
}
</script>
<style lang="stylus">
.host-item
  position relative
  width 100%
  height 60px
  background-color white
  border-top 1px solid #e2e2e2
  .avatar
    position absolute
    top 8px
    left 15px
  .text
    color #abadbb
    padding 10px 105px 10px 70px
    line-height 22px
    .title
      color #2c2c30
      font-size 14px
      font-weight 500
      &.no_info
        line-height 40px
    .info
      color #71717b
      font-size 11px
      span
        margin-right 10px
  .btn
    position absolute
    top 15px
    right 15px
    width 88px
    height 32px
    line-height 30px
    border-radius 25px
    font-size 14px
    border-width 1.5px
    font-weight 500
</style>
