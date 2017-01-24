<template>
<div id="create-user" class="mdl-cell mdl-cell--6-col">
  <div class="form">
    <h4>Create a new user</h4>
    <p>name: <input type="text" v-model="user.name"/></p>
    <p>pass: <input type="password" v-model="user.pass"/></p>
    <p>email: <input type="email" v-model="user.email"/></p>
    <p>role: <input type="text" v-model="user.role"/></p>
    <button @click="create">Ok</button>
  </div>
</div>
</template>
<script>
export default {
  name: 'create-user',
  data() {
    return {
      user: {}
    }
  },
  methods: {
    create() {
      this.$store.dispatch('create_user', this.user)
        .then(_ => {
          this.reset()
          this.$store.dispatch('read_user')
        })
    },
    reset() {
      this.name = ''
      this.pass = ''
      this.email = ''
      this.role = ''
    }
  }
}
</script>
