<template>
<div class="item-home-upcoming">
  <router-link :to="'/share/event/'+e.event_id">
    <div class="video-area">
      <div class="video-poster">
        <img :src="e.event_poster1" />
      </div>
      <div class="video-info">
        <div class="title ellipsis">{{e.event_title}}</div>
        <div class="info">
          <span>{{ e.event_start_time|recent }}</span>
          <span>{{e.upcoming_info.register_count}} Interested</span>
        </div>
      </div>
    </div>
  </router-link>
  <router-link :to="'/u/'+e.channel.user_id">
    <div class="profile-area" v-if="mode!=='profile'">
      <i class="i-stroke i-rad i-30 avatar"
        :style="'background-image:url('+e.channel.avatar+')'">
      </i>
      <div class="name ellipsis">{{e.channel.user_name}}</div>
    </div>
  </router-link>
  <i class="act-reg-event i-register i-38 i-rad" @click="regEvent"></i>
</div>
</template>
<script>
export default{
  name: 'item-home-upcoming',
  props: ['e', 'mode'],
  methods:{
    regEvent(){
      const eid = this.e.event_id
      this.$store.dispatch('toggle_modal', 'app-reg')
    }
  },
}

</script>
<style lang="stylus">
.item-home-upcoming
  position relative
  margin-bottom 15px
  .video-area
    background-color white
    width 100%
    .video-poster
      width 100%
      height 56.25vw
      overflow hidden
      img
        width 100%
    .video-info
      position relative
      width 100%
      height 60px
      padding-left 15px
      padding-top 5px
      .title, .info
        line-height 28px
      .title
        font-size 14px
        font-weight medium
        color #2c2c30
      .info
        font-size 13px
        color #abadbb
        .event-type
          margin-right 10px
        span
          display inline-block
          vertical-align top
          margin-top -4px
          margin-right 8px
  .profile-area
    position absolute
    top 0
    left 0
    width 100%
    height 50px
    background-image linear-gradient(to bottom, rgba(black,.6),rgba(black,0))
    .avatar
      position absolute
      top 10px
      left 15px
    .name
      line-height 50px
      padding-left 50px
      padding-right 4rem
      color white
  .act-reg-event
    position absolute
    top 10px
    right 15px
    background-size 140%
</style>
