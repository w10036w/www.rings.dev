const fetch = require('isomorphic-fetch');
import qs from 'qs'
import { api, debug, data } from '../util'
import lc from 'data/recommend/live_replay_list'

const state = {
  home_lives: [],
}
const getters = {
  home_lives: state => state.home_lives,
  home_lives_ts: state => state.home_lives_ts,
}
const mutations = {
  FETCH_HOME_LIVES (state, { code, data }){
    if(code===200) state.home_lives = data.event_info
    else state.home_lives = []
  },
}
const actions = {
  fetch_home_lives({ commit, rootState }, payload={ start:0 }) {
    if(debug) {
      commit('FETCH_HOME_LIVES', lc)
      return
    }
    payload.sort_flag = rootState.sort_flag
    let uri = `${api}recommend/live_replay_list?${qs.stringify(payload)}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_HOME_LIVES', resp)
        resp.name = 'fetch_home_lives'
        commit('LOGS', resp)
      });
  },
}

export default { state, mutations, actions, getters }

