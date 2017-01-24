<template>
<div v-show="loading.visible" class="flex middle_center full loading-bg">
  <i class="i-loading-default i-50" v-if="ua.os==='ios'"></i>
  <i class="i-loading-flickr i-50" v-else></i>
</div>
</template>
<script>
export default {
  computed: {
    loading(){return this.$store.getters.loading},
    ua(){return this.$store.getters.ua},
  },
}
</script>
<style lang="stylus">
.loading-bg
  position fixed
  z-index 9999
  background-color rgba(white,.6)
</style>
