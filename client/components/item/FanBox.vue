<template>
<div class="fan-box" :class="{inline:player.inline}">
  <div class="has-fan" v-if="top_fans.length">
    <div class="fans row">
      <div class="fan-item left flex align_center"
           v-for="e, i in top_fans"
           @click="toggleWidgetProfile(e.user_id)">
        <i class="i-30 avatar">
          <img class="i-rad" :src="e.avatar" width="100%"/>
          <i class="fan-rank i-16" v-if="i<3" :class="'i-ic_topfans_'+(i+1)"></i>
        </i>
        <div class="info">
          <div class="title ellipsis">{{e.user_name}}</div>
          <div class="sub"><i class="i-ic_topup_coins i-16"></i>{{e.donated_amount}}</div>
        </div>
      </div>
    </div>
    <div class="text">Top fans</div>
  </div>
  <div class="no-fan flex align_center" v-else>
    <i class="i-profile_avatar i-rad i-30 avatar"></i>
    <div>Send gifts to be top fan!</div>
  </div>
</div>
</template>
<script>

export default{
  name: 'fan-box',
  computed: {
    player(){return this.$store.getters.player},
    top_fans(){return this.$store.getters.video_top_fans},
  },
  methods:{
    toggleWidgetProfile(uid){
      this.$store.dispatch('toggle_widget_profile', uid)
    },
  },
  mounted(){

  }
}
</script>
<style lang="stylus">
@import "~styl_var"
.view-video
  .fan-box
    position relative
    height 50px
    padding-left 15px
    background-color white
    border-top 1px solid #e2e2e2
    border-bottom 1px solid #e2e2e2
    .has-fan
      height 100%
    .text
      position absolute
      top 0
      width 70px
      height 100%
      line-height 50px
      color #2c2c30
      background-color white
    .fans
      display flex
      height 100%
      padding-left 70px
      overflow-x scroll
      overflow-y hidden
      .fan-item
        position relative
        height 100%
        padding-left 5px
        border-left 1px solid #e2e2e2
        &:hover
          background-color rgba(c-border, .7)
        .avatar
          position absolute
          left 8px
          top 10px
        .fan-rank
          position absolute
          bottom 0
        .info
          width 110px
          padding-left 40px
          line-height 14px
          .title
            font-size 11px
            color #71717b
          .sub
            color #2c2c30
            font-size 9px
            font-weight 600
            i
              vertical-align bottom
    .no-fan
      height 100%
      i
        margin-right 10px
</style>
