<template>
<div class="msg left clearfix">
  <i class="avatar i-40 i-rad">
    <img :src="e.avatar"/>
  </i>
  <div class="text">
    <div class="name ellipsis">{{e.name}}</div>
    <div class="content" v-if="e.type===0">{{e.content}}</div>
    <div class="content gift" v-else>Send a <img height="50" :src="gift(e.content)" /></div>
  </div>
</div>
</template>
<script>
export default {
  name: 'item-msg',
  props: ['e'],
  methods: {
    openWidgetProfile(uid){

    },
    gift(uri){
      return `http://webapi-rings-aws.shabikplus.mozat.com/images/rings/billing/gift/small/${uri}.png`
    }
  },
}
</script>
<style lang="stylus">
@import "~styl_var"
.view-video
  .msg
    position relative
    max-width 80%
    margin 5px 15px
    .avatar
      position absolute
      top 5px
      left 5px
    .text
      background-color white
      border-radius 5px
      padding-left 50px
      padding-right 10px
      min-height 50px
      .name
        font-size 11px
        color #71717b
        line-height 22px
      .content
        font-size 12px
        line-height 18px
        color c-text
        img
          position absolute
          top 0
          right 10px
        &.gift
          width 150px
          line-height 25px
</style>
