<template>
<div class="home-category-box">
  <div class="category">
    <div class="name">
      {{ e.category_info.name }}
    </div>
    <router-link :to="'/replays/?category='+e.category_info.id"
                 class="ctrl">See All ></router-link>
    <div class="replays">
      <div v-for="r in e.replays" class="category-replay-box">
        <div class="poster"
             @click="goVideo(r.channel.channel_id,r.video_session_id)"
             :style="'background-image:url('+r.event_poster1+')'"></div>
        <router-link :to="'/u/'+r.channel.user_id">
          <div class="info-area">
            <div class="i-rad i-30 i-cover avatar"
                 :style="'background-image:url('+r.channel.avatar+')'"></div>
            <div class="text">
              <div class="title ellipsis">{{r.event_title}}</div>
              <div class="info">
                <i class="i-watch i-16"></i>
                <span>{{r.replay_stream_info.watched_count}}</span>
                <span>|</span>
                <i class="i-like i-16"></i> <span>{{r.like_count}}</span>
              </div>
            </div>

          </div>
        </router-link>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default{
  name: 'item-home-replay',
  props: ['e'],
  methods: {
    goVideo(cid, sid) {
      this.$router.push(`/s/${cid}/${sid}`)
    }
  }
}

</script>
<style lang="stylus">
@import '~styl_var'
.home-category-box
  width 100%
  overflow hidden
  margin-bottom 10px
  padding-left 15px
  position relative
  .category
    width auto
  .name
    height 45px
    line-height 45px
    font-size 21px
    font-weight bold
    color c-text
  .ctrl
    position absolute
    top 0
    right 15px
    font-size 14px
    color #71717b
    height 55px
    line-height 55px
  .replays
    display flex
    height 190px
    overflow-x scroll
    margin-right 10px
    &:after
      display inline-block
      height 100%
    .category-replay-box
      width 240px
      height 100%
      margin-right 10px
      .poster
        width 240px
        height 135px
        background-size cover
        background-position center
      .info-area
        width 240px
        height 55px
        background-color white
        padding-left 45px
        padding-top 10px
        position relative
        line-height 20px
        .avatar
          position absolute
          top 13px
          left 9px
        .title
          font-size 13px
          font-weight medium
          color c-text
        .info
          font-size 13px
          color c-text-grey
          span
            display inline-block
            vertical-align top
            margin-top -2px
            margin-right 8px


</style>
