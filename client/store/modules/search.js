const fetch = require('isomorphic-fetch');
import qs from 'qs'
import { api, debug, data } from '../util'

const state = {
  keywords: [],
  events: [],
  channels: [],
}
const getters = {
  search_keywords: state=>state.keywords,
  search_events: state=>state.events,
  search_channels: state=>state.channels,
}
const mutations = {
  SEARCH_EVENTS_CHANNELS(state, {code, data}){
    if(code===200){
      state.events = data.event_info || []
      state.channels = data.channel || []
    }else{
      state.events = []
      state.channels = []
    }
  },
  ADD_HISTORY_KEYWORD(state, kw){
    state.keywords.push(kw)
  },
}
const actions = {
  search_events_channels({commit}, keyword){
    let uri = `${api}recommend/search_events_channels?keyword=${keyword}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('SEARCH_EVENTS_CHANNELS', resp)
        resp.name = 'search_events_channels'
        commit('LOGS', resp)
      });
  }
}

export default {state, mutations, actions, getters}