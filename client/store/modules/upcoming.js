const fetch = require('isomorphic-fetch');
import qs from 'qs'
import { api, debug, data } from '../util'
import lc from 'data/recommend/upcoming_list'

const state = {
  home_upcomings: [],
  home_upcomings_end: false,
  upcoming_detail: {},
  event_live_replay: []
};
const getters = {
  home_upcomings: state => state.home_upcomings,
  home_upcomings_end: state => state.home_upcomings_end,
  upcoming_detail: state => state.upcoming_detail,
  event_live_replay: state=>state.event_live_replay
};

const mutations = {
  FETCH_HOME_UPCOMINGS (state, { code, data }){
    if(code===200) {
      state.home_upcomings = data.event_info;
      state.home_upcomings_end = data.end
    } else {
      state.home_upcomings = [];
      state.home_upcomings_end = 1
    }
  },
  ADD_HOME_UPCOMINGS (state, { code, data }){
    if(code === 200) {
      if(data.event_info && data.event_info.length>=1)
        state.home_upcomings.push(...data.event_info);
      state.home_upcomings_end = data.end
    }else{
      state.home_upcomings = 1
    }
  },
  FETCH_UPCOMING_DETAIL(state, { code, data }){
    if(code===200)
      state.upcoming_detail = data.event_info?data.event_info[0]:null
    else state.upcoming_detail = {}
  },
  EVENT_LIVE_REPLAY(state, { code, data }) {
    if(code===200)
      state.event_live_replay = data.event_info?data.event_info:[]
    else state.event_live_replay = []
  }
};

//only POST PUT DELETE will change the flash note
const actions = {
  fetch_home_upcomings({ commit, rootState }, payload={start:0}) {
    payload.sort_flag = rootState.sort_flag
    let uri = `${api}recommend/upcoming_list?${qs.stringify(payload)}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_HOME_UPCOMINGS', resp);
        resp.name = 'fetch_home_upcomings';
        commit('LOGS', resp)
      });
  },
  append_home_upcomings({ commit }, payload) {
    if(!payload) {
      commit('LOGS', { code:400, note:'null payload'})
      return
    }
    let uri = `${api}recommend/upcoming_list?${qs.stringify(payload)}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('ADD_HOME_UPCOMINGS', resp);
        resp.name = 'add_home_upcomings';
        commit('LOGS', resp)
      });
  },
  fetch_upcoming_detail({ commit }, {eid}) {
    if(!eid) {
      commit('LOGS', {code: 400, note: 'null payload'})
      return
    }
    let uri = `${api}recommend/upcomings/${eid}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_UPCOMING_DETAIL', resp)
        resp.name = 'fetch_upcoming_detail'
        commit('LOGS', resp)
      });
  },
  fetch_event_live_replay({ commit }, { eid }) {
    if(!eid) {
      commit('LOGS', {code: 400, note: 'null payload'})
      return
    }
    let uri = `${api}recommend/live_replay?eid=${eid}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('EVENT_LIVE_REPLAY', resp)
        resp.name = 'fetch_event_live_replay'
        commit('LOGS', resp)
      });
  }
};

export default { state, mutations, actions, getters }

