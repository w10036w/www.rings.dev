<template>
  <section id="">
    404 done!!
  </section>
</template>
<script>
function noFetch(store) {
  return store;
}
export default {
  name: 'page-404',
  data() {
    return {}
  },
  created() {
  },
  methods: {},
  preFetch: noFetch,
  beforeMount () {
    noFetch(this.$store)
  }
}
</script>
<style lang="stylus">

</style>
