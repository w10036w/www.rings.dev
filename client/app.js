import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import vueCfg from './plugins/vueCfg'
import * as vueFilter from './plugins/filter'
//import vueDirective from './plugins/directive'

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(vueFilter).forEach(key => {
  Vue.filter(key, vueFilter[key])
})

// config
vueCfg(Vue)
// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
  router,
  store,
  ...App // Object spread copying everything from App.vue
})

// expose the app, the router and the store.
// note we not mounting the app here, since bootstrapping will be
// different depending on whether we are in browser or on the server.
export { app, router, store }
