<template>
<transition name="widgetProfile">
<div class="widget-profile full flex middle_center trans_300"
  v-show="widgetProfile">
  <div class="widget-profile-mask full"
       @click="toggleWidgetProfile(0)"></div>
  <transition name="fold">
  <div class="widget-profile-box trans_300" :class="{extended:tab}"
       v-if="widgetProfile">
    <i class="i-ic_profile_exit i-30 act-close"
       @click="toggleWidgetProfile(0)"></i>
    <nav v-show="tab" @click="switchTab('')">
      <div class="name ellipsis">{{p.name}}</div>
    </nav>
    <div class="host-box">
      <div class="host-profile" v-show="!tab">
        <div class="avatar i-70 i-rad i-cover">
          <img :src="p.avatar">
        </div>
        <div class="name">{{p.name}}</div>
        <div class="info">USER ID: {{p.user_id}}</div>
      </div>
      <div class="tabs flex align_center">
        <div class="tab grow_1" :class="{active:tab==='broadcast'}"
             @click="switchTab('broadcast')">
          <div class="num">{{p.replay_count}}</div>
          <div class="sub">Broadcast</div>
        </div>
        <div class="tab grow_1" :class="{active:tab==='follower'}"
             @click="switchTab('follower')">
          <div class="num">{{p.follower_count}}</div>
          <div class="sub">Followers</div>
        </div>
        <div class="tab grow_1" :class="{active:tab==='following'}"
             @click="switchTab('following')">
          <div class="num">{{p.following_count}}</div>
          <div class="sub">Following</div>
        </div>
        <span class="dot" :class="tab"></span>
      </div>
      <div class="panels">
        <div class="panel event-panel" v-show="tab==='broadcast'">
          <replay v-for="e in ev_filter(events, 3)"
                  :e="e" :mode="'widget'"></replay>
        </div>
        <div class="panel" v-show="tab==='follower'">
          <host-item :mode="'widget'" v-for="e in followers"
                     :e="e"></host-item>
        </div>
        <div class="panel" v-show="tab==='following'">
          <host-item :mode="'widget'" v-for="e in followings"
                     :e="e"></host-item>
        </div>
      </div>
    </div>
    <div class="btn-area" v-show="!tab">
      <div class="btn btn-blue-h btn-follow-host"
           @click="followUser">Follow</div>
    </div>
  </div>
  </transition>
</div>
</transition>
</template>
<script>
import HostItem from '../listItem/HostItem.vue'
import Replay from '../listItem/Replay.vue'
import { cached } from 'util/network'
export default {
  name: 'widget-profile',
  components: { HostItem, Replay },
  data(){
    return {
      tab: '',
    }
  },
  computed: {
    route() {return this.$store.state.route},
    ua() {return this.$store.getters.ua},
    p() {return this.$store.getters.profile.profile},
    widgetProfile() {return this.$store.getters.widgetProfile},
    events() {return this.$store.getters.user_events},
    followers() {return this.$store.getters.user_followers},
    followings() {return this.$store.getters.user_followings},
  },
  methods:{
    followUser() {
      //console.log('follow '+this.p.user_id)
      if(this.ua.bApp){

      }else this.$store.dispatch('toggle_modal', 'app-follow')
    },
    ev_filter(events, num) {
      return events.filter(function(e){
        return e.event_status===num
      });
    },
    toggleWidgetProfile(uid){
      if(uid) return this.$store.dispatch('toggle_widget_profile', uid)
      else {
        this.tab = ''
        this.$store.dispatch('toggle_widget_profile')
      }
    },
    switchTab(tab){
      this.tab = tab
    }
  },
  watch:{
    route(to, from){
      this.$store.dispatch('toggle_widget_profile')
    },
    p(){
      this.tab=''
    },
  }
}
</script>
<style lang="stylus">
.widget-profile
  background-color rgba(black, .5)
  .widget-profile-box
    position relative
    width 80%
    border-radius 5px
    background-color white
    &.extended
      .panel
        height 60vh
        overflow-y scroll
        overflow-x hidden
    .act-close
      position absolute
      top 7px
      right 5px
      z-index 1000
    nav
      height 45px
      line-height 45px
      border-top-left-radius 5px
      border-top-right-radius 5px
      background-color #e2e2e2//c-border
      .name
        text-align center
        width 80%
        margin-left 10%
    .host-profile
      text-align center
      .avatar
        display inline-block
        margin-top 10px
        margin-bottom 13px
      .name
        font-weight bold
        line-height 1.4
      .info
        font-size 13px
        color #71717b
    .tabs
      height 60px
      text-align center
      background-color white
      .tab
        .num
          font-weight 600
          line-height 1.4
        .sub
          color #71717b
          font-size 10px
          font-weight 200
        &.active
          .num, .sub
            color #0db8f6
    .panels
      border-bottom-left-radius 5px
      border-bottom-right-radius 5px
      overflow hidden
    .btn-area
      height 55px
      border-top 1px solid #e2e2e2
      text-align center
      .btn-follow-host
        display inline-block
        margin 10px auto
        border-radius 25px
        width 55%
        height 35px
        line-height 34px
        font-size 16px
        font-weight 500
        text-align center
</style>
