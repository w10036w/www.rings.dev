<template>
<div id="update-user" class="mdl-cell mdl-cell--6-col">
    <div class="form">
      <h4>Update a user</h4>
      <p>name: <input type="text" v-model="name"/></p>
      <div class="input-block mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" :pattern="patterns.email" id="email" v-model="email">
        <label class="mdl-textfield__label" for="email">Email</label>
        <span class="mdl-textfield__error">Invalid Email</span>
      </div>
      <p>pass: <input type="password" v-model="pass"/></p>
      <p>role: <input type="text" v-model="role"/></p>
      <button @click="update">Ok</button>
      <button @click="reset">reset</button>
    </div>
  </div>
</div>
</template>
<script>
import patterns from 'util/patterns'
export default {
  name: 'update-user',
  data() {
    return {
      name: '',
      pass: '',
      email: '',
      role: '',
      patterns
    }
  },
  methods: {
    loadAll() {
      this.$store.dispatch('read_user');
    },
    update() {
      const self = this
      const user = {
        name: self.name,
        email: self.email,
        password: self.pass,
        role: self.role,
      }
      self.$store.dispatch('update_user', user)
        .then(() => {
          self.loadAll()
          self.reset()
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
