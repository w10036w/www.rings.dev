<template>
<div class="view-replays">
  <div class="replays-wrapper">
    <replay v-for="e in replays" :e="e"></replay>
  </div>
</div>
</template>
<script>
import Replay from '../components/listItem/Replay.vue'
import { cached } from 'util/network'

function fetchData(store, force) {
  if(!force && cached(store.state.logs, 'fetch_replays'))
    return Promise.resolve()
  const query = store.state.route.query
  const payload = {}
  if(query.category) payload.category_id = Number(query.category)
  if(query.sort) payload.sort_flag = Number(query.sort)
  store.dispatch('update_loading', { visible:true })
  return store.dispatch('fetch_replays', payload)
    .then(_=>{
      let title = ''
      const query = store.state.route.query
      if(query.category && store.getters.replays.length)
        title = store.getters.replays[0].category_info_mini.name
      else if(query.sort && query.sort==2)
        title = 'All Replay Videos'
      let _navBar = Object.assign({}, store.state.widget._navBar, {
        render:true,
        iBack: true,
        iTitle: true,
        iSearch: true,
        title
      })
      return store.dispatch('update_nav_bar', _navBar)
    })
    .then(_=>store.dispatch('update_loading', { visible:false }))
}
export default {
  name: 'view-replays',
  components: { Replay },
  props: ['e'],
  preFetch: fetchData,
  computed: {
    replays(){return this.$store.getters.replays},
    loading(){return this.$store.getters.loading},
  },
  beforeMount(){
    fetchData(this.$store)
  },
}
</script>
<style lang="stylus">
.replays-wrapper
  padding-top 55px
</style>
