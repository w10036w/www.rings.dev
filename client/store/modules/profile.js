const pkg = require('package.json');
const url = `${pkg.schema}://${pkg.host}:${pkg.port}/api/`;
const fetch = require('isomorphic-fetch');

import network from 'public/util/network'
import qs from 'qs'

//end: 1 true 0 false
const state = {
  profile: {},
  user_events: [],
  user_events_end: 1,
  user_followers: [],
  user_followers_end: 1,
  user_followings: [],
  user_followings_end: 1,
}
const getters = {
  profile: state=>state.profile,
  user_events: state=>state.user_events,
  user_events_end: state=>state.user_events_end,
  user_followers: state=>state.user_followers,
  user_followers_end: state=>state.user_followers_end,
  user_followings: state=>state.user_followings,
  user_followings_end: state=>state.user_followings_end,
}

const mutations = {
  FETCH_PROFILE(state, { code, data}) {
    if(code===200){
      state.profile = data.profile_channel ? data.profile_channel[0]:{}
    }else{
      state.profile = {}
    }
  },
  FETCH_USER_EVENTS(state, {code, data, _init}) {
    if(code===200 && data.event_info){
      if(_init) state.user_events = data.event_info
      else state.user_events.push(...data.event_info)
      state.user_events_end = data.end
    }else{
      if(_init) state.user_events = []
      state.user_events_end = 1
    }
  },
  FETCH_USER_FOLLOWERS(state, {code, data, _init}) {
    if(code===200 && data.follower_info){
      if(_init) state.user_followers = data.follower_info
      else state.user_followers.push(...data.follower_info)
      state.user_followers_end = data.end
    }else{
      if(_init) state.user_followers = []
      state.user_followers_end = 1
    }
  },
  FETCH_USER_FOLLOWINGS(state, {code, data, _init}) {
    if(code===200 && data.following_info){
      if(_init) state.user_followings = data.following_info
      else state.user_followings.push(...data.following_info)
      state.user_followings_end = data.end
    }else{
      if(_init) state.user_followings = []
      state.user_followings_end = 1
    }
  },
}
const actions = {
  fetch_profile({ commit }, uid) {
    let uri = `${url}info/host_info/${uid}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_PROFILE', resp)
        resp.name = 'fetch_profile'
        commit('LOGS', resp)
      })
  },
  // TODO: Currently replayonly stands for widget profile view, not apply yet
  fetch_user_events({commit, state}, {uid, start=0, _replayOnly=false, _init=true}) {
    if(!_init && !state.user_events_end) 
      start = state.user_events.length
    let uri = `${url}recommend/event_list/${uid}?start=${start}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        resp._init = _init
        commit('FETCH_USER_EVENTS', resp)
        resp.name = `${_init?'fetch':'add'}_user_events`
        commit('LOGS', resp)
      })
  },
  fetch_user_followers({commit, state}, {uid, start=0, _init=true}){
    if(!_init && !state.user_followers_end)
      start = state.user_followers.length
    let uri = `${url}info/followers/${uid}?start=${start}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        resp._init = _init
        commit('FETCH_USER_FOLLOWERS', resp)
        resp.name = `${_init?'fetch':'add'}_user_followers`
        commit('LOGS', resp)
      })
  },
  fetch_user_followings({commit, state}, {uid, start=0, _init=true}){
    if(!_init && !state.user_followings_end)
      start = state.user_followings.length
    let uri = `${url}info/followings/${uid}?start=${start}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        resp._init = _init
        commit('FETCH_USER_FOLLOWINGS', resp)
        resp.name = `${_init?'fetch':'add'}_user_followings`
        commit('LOGS', resp)
      })
  },
  fetch_profile_details({dispatch}, uid){
    return Promise.all([
      dispatch('fetch_profile', uid),
      dispatch('fetch_user_events', {uid}),
      dispatch('fetch_user_followers', {uid}),
      dispatch('fetch_user_followings', {uid}),
    ])
  },
}

export default {state, mutations, actions, getters}

