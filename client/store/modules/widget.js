import fetch from 'isomorphic-fetch'
import qs from 'qs'
import { api } from '../util'

const _navBar = {
  render: false,
  logo: false,
  search: false,
  title: '',
  iTitle: false,
  iMenu: false,
  iBack: false,
  iSearch: false,
  iSort: false,
  iShare: false,
}

const state = {
  _navBar: _navBar,
  navBar: _navBar,
  appBridge: null, // { scheme, link }
  iTP: null, // { uri }
  modal: '', // 'app-follow'
  profile: 0, // uid
  shareBox: false,
  shareData: null, //{ uri, img, title, link, desc }
  vote: false,
  voteData: {}, // { voteId: { uri, myOption } }
  homeRank: false,
  homeBanner: [],
}

const getters = {
  navBar: state=>state.navBar,
  appBridge: state=>state.appBridge,
  iTP: state=>state.iTP,
  modal: state=>state.modal,
  widgetProfile: state=>state.profile,
  shareBox: state=>state.shareBox,
  shareData: state=>state.shareData,
  vote: state=>state.vote,
  voteData: state=>state.voteData,
  homeRank: state=>state.homeRank,
  homeBanner: state=>state.homeBanner,
}

const mutations = {
  UPDATE_NAV_BAR: (state, obj)=>state.navBar = obj,
  TOGGLE_APP_BRIDGE: (state, obj)=>state.appBridge = obj,
  TOGGLE_ITP: (state, obj)=>state.iTP = obj,
  TOGGLE_MODAL: (state, val)=>state.modal = val,
  TOGGLE_WIDGET_PROFILE: (state, uid)=>state.profile = uid,
  TOGGLE_SHARE_BOX: (state, val)=>state.shareBox = val,
  UPDATE_SHARE_DATA: (state, obj)=>state.shareData = obj,
  TOGGLE_VOTE: (state, val)=>state.vote = val,
  UPDATE_VOTE_DATA: (state, obj)=>state.voteData = obj,
  TOGGLE_HOME_RANK: (state, val)=>state.homeRank = val,
  FETCH_HOME_BANNER(state, {code, data}){
    if(code===200){
      state.homeBanner = data
    }else{
      state.homeBanner = []
    }

  }
}

const actions = {
  update_nav_bar({ commit }, obj=_navBar){
    commit('UPDATE_NAV_BAR', obj)
  },
  toggle_app_bridge({ commit }, val=false){
    commit('TOGGLE_APP_BRIDGE', val)
  },
  toggle_itp({ commit }, obj=null) {
    commit('TOGGLE_ITP', obj)
  },
  toggle_modal({ commit }, val='') {
    commit('TOGGLE_MODAL', val)
  },
  //add root state/getters
  toggle_widget_profile({commit, dispatch, rootState}, uid) {
    if(!uid){
      commit('TOGGLE_WIDGET_PROFILE', 0)
    } else{
      //optimize: only fetch_profile
      if(typeof rootState.profile.profile.user_id==='undefined'
        || rootState.profile.profile.user_id!==uid)
        dispatch('fetch_profile', uid)
          .then(function(){
            return commit('TOGGLE_WIDGET_PROFILE', uid)
          }).then(function(){
            dispatch('fetch_user_events', {uid})
            dispatch('fetch_user_followers', {uid})
            dispatch('fetch_user_followings', {uid})
          })
      else commit('TOGGLE_WIDGET_PROFILE', uid)
    }
  },
  toggle_share_box({ commit }, val=false) {
    if(typeof window !== 'undefined') {
      val ? document.body.style.overflow = "hidden"
        : document.body.style.overflow = "visible";
    }
    commit('TOGGLE_SHARE_BOX', val)
  },
  update_share_data({ commit }, obj=null) {
    commit('UPDATE_SHARE_DATA', obj)
  },
  toggle_vote({ commit }, val=false) {
    commit('TOGGLE_VOTE', val)
  },
  update_vote_data({ commit }, obj=null) {
    commit('UPDATE_VOTE_DATA', obj)
  },
  toggle_home_rank({ commit }, val=false) {
    commit('TOGGLE_HOME_RANK', val)
  },
  fetch_home_banner({commit}) {
    let uri = `${api}/banner`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_HOME_BANNER', resp)
        resp.name = 'fetch_home_banner'
        commit('LOGS', resp)
      });
  }
}


export default { state, getters, mutations, actions }


