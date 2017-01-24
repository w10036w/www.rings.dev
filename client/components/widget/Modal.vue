<template>
<transition name="modal">
<div class="full modal-wrapper flex middle_center trans_300"
     v-show="modal">
  <div class="full modal-mask" @click="closeModal"></div>
  <div class="modal modal-app_download trans_300"
       v-if="modal.indexOf('app')!==-1">
    <div class="modal-body flex middle_center">
      <span class="text">{{text}}</span>
    </div>
    <div class="modal-footer flex right_center">
      <div class="btn btn-ios-default" @click="downloadApp(ua)">Download App</div>
    </div>
  </div>
</div>
</transition>
</template>
<script>
import { appInfo, downloadApp } from 'util/client'
export default {
  name: 'widget-modal',
  computed: {
    modal(){return this.$store.getters.modal},
    ua(){return this.$store.getters.ua},
    text() {
      const m = this.$store.getters.modal
      return {
        '': 'Ready to download RINGS.TV',
        'app-interaction': 'Download RINGS.TV to enjoy interactions with the broadcaster!',
        'app-follow': 'Download RINGS.TV to follow your favorite broadcaster!',
        'app-reg': 'Want to catch up future events? Download RINGS.TV to be notified when next broadcast starts!',
        'app-private': 'Private event. Please download RINGS.TV to watch the event.',
        'app-login': 'Download RINGS.TV & login to enjoy full features!'
      }[m]
    }
  },
  methods: {
    closeModal() {
      this.$store.dispatch('toggle_modal')
    },
    downloadApp,
  }
}
</script>
<style lang="stylus">
@import '~styl_var'
.modal-wrapper
  position fixed
  background-color rgba(black, .5)
  z-index z-modal
  overflow hidden
.modal-mask
  z-index -1
.modal
  background-color white
  overflow hidden
  .ios &
    border-radius 10px
.modal-app_download
  width 300px
  height 140px
  .modal-body
    height 90px
    .text
      font-size 16px
      margin 0 20px
      text-align center
.modal-footer
  height 50px
  border-top 1px solid c-border
  .btn
    .ios &
      flex-grow 1
      margin-right -1px
      border-right 1px solid c-border
      height 100%
    .android &
      margin-right 10px
      padding 10px
      color black
</style>
