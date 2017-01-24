import fetch from 'isomorphic-fetch'
import qs from 'qs'
import { api, debug, data } from '../util'
import lc1 from 'data/bdc_msg/live'
import lc2 from 'data/bdc_msg/replay'

const state = {
  live: [],
  live_end: 1,
  live_seq: 0, //not used, for potential
  replay: [],
  replay_end: 1,
  replay_seq: 0,
}
const getters = {
  live_msg: state=>state.live,
  live_msg_end: state=>state.live_end,
  live_msg_seq: state=>state.live_seq,
  replay_msg: state=>state.replay,
  replay_msg_end: state=>state.replay_end,
  replay_msg_seq: state=>state.replay_seq,
}
const mutations = {
  FETCH_LIVE_MSG(state, {code, data}){
    if(code===200){
      state.live = data.msg_info
      state.live_end = data.end
    }else{
      state.live = []
      state.live_end = 1
    }
  },
  FETCH_REPLAY_MSG(state, {code, data}){
    if(code===200){
      state.replay = data.msg_info
      state.replay_end = data.end
      if(state.replay.length)
        state.replay_seq = state.replay[0].seq
    }else{
      state.replay = []
      state.replay_end = 1
    }
  },
  ADD_REPLAY_MSG(state, {code, data}){
    if(code===200){
      state.replay.unshift(...data.msg_info)
      state.replay_end = data.end
      if(state.replay.length)
        state.replay_seq = state.replay[0].seq
    }else{
      state.replay_end = 1
    }
  },
}
const actions = {
  fetch_live_msg({commit}, {cid}){
    if(debug){
      commit('FETCH_LIVE_MSG', lc1)
      return
    }
    let uri = `${api}msg/live/${cid}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_LIVE_MSG', resp)
        resp.name = 'fetch_live_msg'
        commit('LOGS', resp)
      });
  },
  fetch_replay_msg({commit}, {sid, seq=0}){
    if(debug){
      commit('FETCH_REPLAY_MSG', lc2)
      return
    }
    let uri = `${api}msg/replay/${sid}?seq=${seq}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_REPLAY_MSG', resp)
        resp.name = 'fetch_replay_msg'
        commit('LOGS', resp)
      });
  },
  add_replay_msg({commit}, {sid, seq}){
    if(debug){
      commit('ADD_REPLAY_MSG', lc2)
      return
    }
    let uri = `${api}msg/replay/${sid}/${seq}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('ADD_REPLAY_MSG', resp)
        resp.name = 'add_replay_msg'
        commit('LOGS', resp)
      });
  },
}

export default {state, mutations, actions, getters}