<template>
<div class="host-box">
  <div :class="{fold:folded}">
    <div class="avatar i-70 i-rad i-cover">
      <img :src="p.profile.avatar">
    </div>
    <h3>{{p.profile.user_id}}</h3>
    <p>USER ID: {{p.profile.user_id}}</p>
    <div class="btn btn-blue" v-if="!bWidget"
         @click="followUser">Follow</div>
  </div>
  <div class="tabs flex">
    <div class="tab grow_1" @click="switchTab('broadcast')">
      <h1>{{p.profile.replay_count}}</h1>
      <p>Broadcast</p>
    </div>
    <div class="tab grow_1" @click="switchTab('follower')">
      <h1>{{p.profile.follower_count}}</h1>
      <p>Followers</p>
    </div>
    <div class="tab grow_1" @click="switchTab('following')">
      <h1>{{p.profile.following_count}}</h1>
      <p>Following</p>
    </div>
    <span class="dot" :class="tab"></span>
  </div>
  <div class="panels" v-show="!(bWidget&&!tab)">
    <div class="panel" v-show="tab==='broadcast'">
      <user-event v-for="e in events" :e="e"></user-event>
    </div>
    <div class="panel" v-show="tab==='follower'">
      <host-item :mode="follow" v-for="e in followers" :e="e"></host-item>
    </div>
    <div class="panel" v-show="tab==='following'">
      <host-item :mode="follow" v-for="e in followings" :e="e"></host-item>
    </div>
  </div>
  <div class="btn-area" v-if="bWidget">
    <div class="btn btn-blue" @click="followUser">Follow</div>
  </div>
</div>
</template>
<script>
import HostItem from '../listItem/HostItem.vue'
function fetchData(store, force) {
  if(!force && cached(store.state.logs, 'fetch_profile', 2))
    return Promise.resolve()
  const uid = store.state.route.params.uid

}
export default{
  name: 'host-box',
  components: { HostItem },
  props: ['bWidget', 'folded'],
  data() {
    return {
      tab: this.bWidget ? '':this.$route.hash.replace('#', '')||'broadcast',
      followers: [1,2,3],
      folded: false
    }
  },
  computed: {
    events() {return this.$store.getters.user_events},
    followers() {return this.$store.getters.user_followers},
    followings() {return this.$store.getters.user_followings},
    p() {return this.$store.getters.profile},
  },
  methods: {
    followUser() {

    },
    switchTab(tab) {
      this.tab = tab
      if(this.bWidget) {
        typeof window!=='undefined' && document.getElementById('widget-profile').scrollTo(0,0)
      }else{
        typeof window!=='undefined' && window.scrollTo(0,0)
        this.$router.push(`#${tab}`)
      }
    },
  },
}
</script>
<style lang="stylus">

</style>
