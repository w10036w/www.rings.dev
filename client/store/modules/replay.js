const fetch = require('isomorphic-fetch')
import qs from 'qs'
import { api, debug, data } from '../util'
import lc from 'data/recommend/replays_category'


const state = {
  home_replays: [],
  replays: [],
  replays_end: true, //TODO infiScroll
}
const getters = {
  home_replays: state => state.home_replays,
  replays: state=>state.replays,
  replays_end: state=>state.replays_end,
}

const mutations = {
  FETCH_HOME_REPLAYS (state, { code, data }){
    if(code === 200) state.home_replays = data
    else state.home_replays = []
  },
  FETCH_REPLAYS(state, {code, data}){
    if(code===200) {
      state.replays = data.event_info
      state.replays_end = data.end
    } else { //TODO future better way
      state.replays = []
      state.replays_end = true
    }
  },
}
const actions = {
  fetch_home_replays({ commit }) {
    if(debug) {
      commit('FETCH_HOME_REPLAYS', lc)
      return
    }
    let uri = `${api}recommend/replays_category`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_HOME_REPLAYS', resp)
        resp.name = 'fetch_home_replays'
        commit('LOGS', resp)
      });
  },
  fetch_replays({ commit }, payload={ start:0 }) {
    let uri = `${api}recommend/replay_list?${qs.stringify(payload)}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_REPLAYS', resp)
        resp.name = 'fetch_replays'
        commit('LOGS', resp)
      });
  },
}


export default { state, mutations, actions, getters }

