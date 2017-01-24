const fetch = require('isomorphic-fetch')
import qs from 'qs'
import { api, debug } from '../util'
import lc from 'data/recommend/video'

const dfPlayer = {
  status: -1, // video not exist
  title: 'No Title',
  poster: '/img/png/loading-bg.png',
  src: '',
  hid: 0,
  cid: 0,
  sid: '',
  hostName: '',
  hostAvatar: '/img/png/logo-64.png',
  ended: true, //only used when status is 2
  orientation: 'portrait',
  inline: true,
}

const state = {
  video: null,
  player: dfPlayer,
  video_top_fans: [],
  video_stat: {},
  video_host_replays: [],
  video_host_replays_end: 1,
}
const getters = {
  video: state => state.video,
  player: state => state.player,
  video_top_fans: state=>state.video_top_fans,
  video_stat: state=>state.video_stat,
  video_host_replays: state=>state.video_host_replays,
  video_host_replays_end: state=>state.video_host_replays_end,
}

const mutations = {
  FETCH_VIDEO (state, { code, data }){
    if(code===200) {
      state.video = data.event_info
      state.player = {
        status: state.video.event_status,
        title: state.video.event_title,
        poster: state.video.event_poster1,
        src: (function () {
          if (state.video.event_status === 3)
            return `http://${state.video.replay_stream_info.host}/video/mp4:${state.video.replay_stream_info.media_file}/playlist.m3u8`
          if (state.video.event_status === 2) {
            // TODO: geolocation (e.g. China CDN hls address)
            return state.video.live_stream_info.hls_url[0]
          }
          return ''
        })(),
        hid: state.video.channel.user_id,
        cid: state.video.channel.channel_id,
        sid: state.video.video_session_id,
        hostName: state.video.channel.user_name,
        hostAvatar: state.video.channel.avatar,
        ended: state.video.event_status !== 2,
        watchCount: (function () {
          if (state.video.event_status === 3)
            return state.video.replay_stream_info.watched_count
          if (state.video.event_status === 2)
            return state.video.live_stream_info.webviewer_count
          return 0
        })(),
        likeCount: state.video.like_count || 0,
      }
    } else {
      state.video = {}
      state.player = dfPlayer
    }
  },
  FETCH_VIDEO_TOP_FANS(state, { code, data }) {
    if(code=200){
      state.video_top_fans = data.fan_infos ? data.fan_infos:[]
    }else{
      state.video_top_fans = []
    }
  },
  FETCH_VIDEO_STAT(state, { code, data }) {
    if(code=200){
      state.video_stat = data
    }else{

    }
  },
  FETCH_VIDEO_HOST_REPLAYS(state, {code, data, _init}){
    if(code===200 && data.event_info){
      if(_init) state.video_host_replays = data.event_info
      else state.video_host_replays.push(...data.event_info)
      state.video_host_replays_end = data.end
    }else{
      if(_init) state.video_host_replays = []
      state.video_host_replays_end = true
    }
  },
}

//only POST PUT DELETE will change the flash note
const actions = {
  fetch_video({ commit }, { cid, sid }) {
    if(debug) {
      commit('FETCH_VIDEO', lc)
      return
    }
    let uri = `${api}recommend/video/${cid}/${sid}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_VIDEO', resp)
        resp.name = 'fetch_video'
        commit('LOGS', resp)
      });
  },
  fetch_video_top_fans({ commit }, { cid, sid, number=5 }) {
    let uri = `${api}info/top_fans/${cid}/${sid}?number=${number}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        commit('FETCH_VIDEO_TOP_FANS', resp)
        resp.name = 'fetch_video_top_fans'
        commit('LOGS', resp)
      });
  },
  fetch_video_stat({ commit, state }, { cid, sid }){
    if(!state.player.status) {
      console.log('error: no event info')
    }else{
      let uri = `${api}session/stat/${cid}/${sid}`
      return fetch(uri).then(resp=>resp.json())
        .then(resp=>{
          commit('FETCH_VIDEO_STAT', resp)
          resp.name = 'fetch_video_stat'
        })
    }
  },
  fetch_video_host_replays({commit, state}, {hid, start, _init=true}){
    if(!_init && !state.video_host_replays_end)
      start = staet.video_host_replays.length
    let uri = `${api}recommend/replays?${qs.stringify({hid, start})}`
    return fetch(uri).then(resp=>resp.json())
      .then(resp=>{
        resp._init = _init
        commit('FETCH_VIDEO_HOST_REPLAYS', resp)
        resp.name = `${_init?'fetch':'add'}_video_host_replays`
        commit('LOGS', resp)
      });
  },
}

export default { state, mutations, actions, getters }


