import Vue from 'vue'
import Vuex from 'vuex'

import live from './modules/live'
import upcoming from './modules/upcoming'
import replay from './modules/replay'
import video from './modules/video'
import widget from './modules/widget'
import profile from './modules/profile'
import search from './modules/search'
import msg from './modules/msg'

import ua from 'util/ua'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    live, upcoming, replay, video, widget, profile, search,
    msg,
  },
  state: {
    ua: {
      ua: '',
      os: '',
      broswer: 'chrome',
      bApp: false,
      bMobile: false,
      webview: false,
    },
    auth: null,
    loading: {
      poster: '',
      visible: false,
    },
    sort_flag: 0,
    flash: '',
    logs: [],
  },
  getters: {
    flash: state=>state.flash,
    logs: state=>state.logs,
    ua: state=>state.ua,
    auth: state=>state.auth,
    loading: state=>state.loading,
    sort_flag: state=>state.sort_flag,
  },
  mutations: {
    LOGS(state, obj) {
      state.logs.push(obj);
      state.flash = obj;
    },
    INIT_UA: (state, ua)=>state.ua=ua,
    UPDATE_AUTH: (state, obj)=>state.auth=obj,
    UPDATE_LOADING: (state, obj)=>state.loading=obj,
    SWITCH_SORT_FLAG: (state, val)=>state.sort_flag=val,
  },
//only POST PUT DELETE will change the flash note
  actions: {
    update_ua({ commit }, obj) {
      commit('INIT_UA', ua(obj))
    },
    update_loading({ commit }, obj={visible:true}) {
      commit('UPDATE_LOADING', obj)
    },
    update_auth({ commit }, obj) {
      commit('UPDATE_AUTH', obj)
    },
    switch_sort_flag({ commit }, val=0) {
      commit('SWITCH_SORT_FLAG', val)
    },
  },
})

export default store
