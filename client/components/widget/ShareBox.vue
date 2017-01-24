<template>
<transition name="shareBtm">
<div class="full shareBox-wrapper trans_300" v-show="shareBox">
  <div class="shareBox-mask full" @click="toggleShareBox"></div>
  <div id="shareBox" class="trans_300">
    <div class="sns-box" @click="fbShare">
      <i class="i-sns-fb i-50"></i>
      <div>Facebook</div>
    </div>
    <div class="sns-box" @click="twShare">
      <i class="i-sns-tw i-50"></i>
      <div>Twitter</div>
    </div>
    <div class="sns-box" @click="waShare">
      <i class="i-sns-wc i-50"></i>
      <div>Wechat</div>
    </div>
    <div class="sns-box" @click="fbShare">
      <i class="i-sns-fb i-50"></i>
      <div>Facebook</div>
    </div>
    <div class="sns-box" @click="twShare">
      <i class="i-sns-tw i-50"></i>
      <div>Twitter</div>
    </div>
    <div class="sns-box" @click="waShare">
      <i class="i-sns-wc i-50"></i>
      <div>Wechat</div>
    </div>
  </div>
</div>
</transition>
</template>
<script>
import share from 'util/snsShare'

export default{
  name: 'widget-share-box',
  computed: {
    shareBox(){return this.$store.getters.shareBox},
    shareData(){return this.$store.getters.shareData},
    ua(){return this.$store.getters.ua},
  },
  methods: {
    fbShare(){window.open(share.fb(this.shareData))},
    twShare(){window.open(share.tw(this.shareData))},
    waShare(){window.open(share.tw(this.shareData))},
    toggleShareBox() {
      return this.$store.dispatch('toggle_share_box')
    }
  }
}
</script>
<style lang="stylus">
.shareBox-wrapper
  position fixed
  overflow hidden
  z-index 900
.shareBox-mask
  background-color rgba(black, .3)
  z-index -1
#shareBox
  position fixed
  left 0
  right 0
  margin-left auto
  margin-right auto
  bottom 7px
  width 97%
  height 200px
  padding-top 20px
  border-radius 5px
  background-color white
  font-size 13px
  line-height 16px
  .sns-box
    float left
    width 33.3%
    height 80px
    margin-bottom 10px
    text-align center
</style>
