<template>
<div id="widget">
  <modal></modal>
  <share-box></share-box>
  <loading></loading>
  <profile></profile>
</div>
</template>
<script>
import Modal from './Modal.vue'
import ShareBox from './ShareBox.vue'
import Loading from './Loading.vue'
import Profile from './Profile.vue'
export default {
  name: 'widget',
  components: { Modal, ShareBox, Loading, Profile },
}
</script>
<style>

</style>
