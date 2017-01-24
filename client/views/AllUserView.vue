<template>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header
          mdl-layout--fixed-tabs">
  <header class="mdl-layout__header">
    <div class="mdl-layout__header-row">
      <!-- Title -->
      <span class="mdl-layout-title">Title</span>
    </div>
    <!-- Tabs -->
    <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
      <a href="#fixed-tab-live" class="mdl-layout__tab is-active">LIVE</a>
      <a href="#fixed-tab-upcoming" class="mdl-layout__tab">UPCOMING</a>
      <a href="#fixed-tab-replay" class="mdl-layout__tab">REPLAY</a>
      <a href="#fixed-tab-user" class="mdl-layout__tab">USER</a>
    </div>
  </header>
  <div class="mdl-layout__drawer">
    <span class="mdl-layout-title">Title</span>
  </div>
  <main class="mdl-layout__content">
    <section class="mdl-layout__tab-panel is-active" id="fixed-tab-live">
      <div class="page-content">
        <div class="page-content">
          <div class="user-list">
            <div v-for="user in users" :key="user.name">
              <div>Name: {{ user.name }} Role: {{ user.role }}</div>
            </div>
          </div>
          <div class="mdl-grid">
            <create-user></create-user>
            <update-user></update-user>
          </div>
        </div>
      </div>
    </section>
    <section class="mdl-layout__tab-panel" id="fixed-tab-upcoming">
      <div class="page-content"><!-- Your content goes here --></div>
    </section>
    <section class="mdl-layout__tab-panel" id="fixed-tab-replay">
      <div class="page-content"><!-- Your content goes here --></div>
    </section>
    <section class="mdl-layout__tab-panel" id="fixed-tab-user">
      <div class="page-content"><!-- Your content goes here --></div>
    </section>
  </main>
</div>
</div>
</template>
<script>
import CreateUser from '../components/user/create.vue'
import UpdateUser from '../components/user/update.vue'
export default {
  name: 'user-view',
  components: { CreateUser, UpdateUser },
  preFetch(store){ return store.dispatch('read_user') },
  data() {
    const bMounted = !this.$root._isMounted
    return {
      bMounted,
      page: 0
    }
  },
  computed: {
    users() { return this.$store.getters.user_list },
    flash() { return this.$store.getters.user_flash },
  },
  methods: {
    fetchUser() { this.$store.dispatch('read_user') }
  },
  beforeMount() {
    if(!this.bMounted) this.fetchUser()
  }
}
</script>

<style lang="stylus">
.user-view
  background-color #fff
  box-sizing border-box
  padding 2em 3em
  h1
    margin 0
    font-size 1.5em
  .meta
    list-style-type none
    padding 0
  .label
    display inline-block
    min-width 4em
  .about
    margin 1em 0
  .links a
    text-decoration underline
</style>
