<template>
  <div id="search-user">
    <h4>Search for any user</h4>
    <ul>
      <li v-for="e in users">{{ e.name }}</li>
    </ul>
    <p :class="flash?'red':'green'">{{ flash }}</p>
  </div>
</template>
<script>
  export default {
    name: 'manage-user',
    data() {
      const isInitialRender = !this.$root._isMounted
      return {
        transition: 'slide-left',
        query: {
          name: null,
          email: null,
          role: null
        }
      }
    },
    //usually for vuex getters
    computed: {
      users() {
        return this.$store.getters.user_list
      },
      flash() {
        return this.$store.getters.user_flash
      }
    },
    methods: {
      loadAll() {
        this.$store.dispatch('read_user');
      },
      search() {
        this.$store.dispatch('read_user')
      }
    },
    beforeMount() {
      if (this.$root._isMounted) {
        this.loadAll();
      }
    },
  }
</script>
<style lang="stylus">
  .half.left
  float left
  width 50%
</style>
