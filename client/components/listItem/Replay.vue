<template>
<router-link :to="'/s/'+e.channel.channel_id+'/'+e.video_session_id">
<div class="item-replay">
  <div class="poster">
    <img width="100%" :src="e.event_poster1">
  </div>
  <div class="text">
    <div class="title ellipsis">{{e.event_title}}</div>
    <div class="info">
      <i class="i-watch i-16"></i>
      <span>{{e.replay_stream_info.watched_count}}</span>
      <span>|</span>
      <i class="i-like i-16"></i>
      <span>{{e.like_count}}</span></div>
    <div>
      <div v-if="mode!=='profile'">
        <i class="avatar i-16 i-rad"
           :style="'background-image:url('+e.channel.avatar+')'">
        </i>
        <span>{{e.channel.user_name}}</span>
        <span class="right">{{e.replay_stream_info.recorded_time|recent}}</span>
      </div>
      <div v-else>
        <span>{{e.replay_stream_info.recorded_time|timeAgo}}</span>
      </div>
    </div>
  </div>
</div>
</router-link>
</template>
<script>
export default{
  name: 'item-replay',
  props: ['e', 'mode'],
  methods: {

  },
}
</script>
<style lang="stylus">
.item-replay
  position relative
  height 90px
  border-bottom 1px solid #e2e2e2
  padding 11px 15px
  background-color white
  .poster
    position absolute
    width 120px
    height 68px
  .text
    padding-left 130px
    .title
      font-size 14px
      font-weight medium
      color #1b1b1b
      height 28px
      line-height 20px
      margin-right 15px
    .info
      font-size 13px
      color #71717b
      height 25px
      span
        display inline-block
        vertical-align top
        margin-right 8px
    div
      font-size 13px
      color #71717b
      .avatar
        vertical-align bottom
</style>