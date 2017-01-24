<template>
<div class="home-live-box">
  <div class="video-area" @click="goVideo">
    <div class="video-poster i-loading-bg"
         :style="e.event_poster1?'background-image:url('+e.event_poster1+')':''"></div>
    <div class="video-info">
      <div class="title ellipsis">{{e.event_title}}</div>
      <div class="info">
        <i class="event-type"
          :class="e.event_status===2?'i-live i-40-16':'i-featured i-105-16'"></i>
        <i class="i-watch i-16"></i> <span>
        {{e.event_status===2?e.live_stream_info.webviewer_count:e.replay_stream_info.watched_count}}</span>
        <span>|</span>
        <i class="i-like i-16"></i> <span>{{e.like_count}}</span>
      </div>
    </div>
  </div>
  <router-link :to="'/u/'+e.channel.user_id">
    <div class="profile-area" v-if="mode!=='profile'">
      <i class="i-stroke i-rad i-28 avatar">
        <img :src="e.channel.avatar">
      </i>
      <div class="name ellipsis">{{e.channel.user_name}}</h4>
    </div>
  </router-link>
</div>
</template>
<script>
export default{
  name: 'item-home-live',
  props: ['e', 'mode'],
  methods: {
    goVideo() {
      this.$store.dispatch('update_loading', {poster: this.e.event_poster1})
      this.$router.push(`/s/${this.e.channel.channel_id}/${this.e.video_session_id}`)
    }
  }
}

</script>
<style lang="stylus">
.home-live-box
  position relative
  margin-bottom 15px
  .video-area
    background-color white
    width 100%
    .video-poster
      width 100%
      padding-bottom 56.25%
      height 0
      background-size cover
      background-repeat no-repeat
      background-position center
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
      left 10px
      background-size cover
      background-position center
    .name
      line-height 50px
      padding-left 50px
      color white
      font-weight regular
</style>
