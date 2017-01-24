const pkg = require('package.json')
const uri = `http://${pkg.host}:${pkg.port}/api/users`
const fetch = require('isomorphic-fetch')

import network from 'public/util/network'
import qs from 'qs'
const fetchOpts = network.fetchOpts

const state = {
  currentUser: {},
  role: '',
  query: {},
  uids: [],
  users: [],
  editingUsers: [],
  flash: null,
  logs: []
}

const mutations = {
  CREATE_USER (state, { code }){
    if(code === 200) state.editingUsers = [];
  },
  UPDATE_USER (state, { code }){
    if(code === 200) state.editingUsers = [];
  },
  READ_USER (state, { code, data }){
    if(code == 200) state.users = data;
  },
  DELETE_USER (state, { code }) {
    if(code == 200) state.editingUsers = [];
  },
  LOGS_USER (state, { code, note }) {
    state.logs.push(note);
    state.flash = note;
  }
}

const exec = {
  //fetch post
  create(payload) {
    const body = JSON.stringify(payload);
    const opts = fetchOpts(body)
    return fetch(uri, opts)
      .then(resp => {
        if(resp.status >= 400) {
          throw new Error('Bad response from server.')
        }
        return resp.json()
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  readByName(id) {

  },
  //fetch get
  read(payload) {
    const query = payload ? '?'+qs.stringify(payload) : '';
    return fetch(`${uri}${query}`)
      .then(resp => {
        return resp.json();
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  //fetch put
  update(payload) {
    const body = JSON.stringify(payload);
    const opts = {
      method: 'put',
      body,
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    }
    return fetch(uri, opts)
      .then(resp => {
        if(resp.status >= 400) {
          throw new Error('Bad response from server.')
        }
        return resp.json()
      })
      .catch(err => {
        throw new Error(err);
      });
  },
  //fetch delete
  remove() {

  }
}
//only POST PUT DELETE will change the flash note
const actions = {
  create_user({ commit }, user) {
    if(!user) return;
    return exec.create(user).then(resp => {
      commit('CREATE_USER', resp)
      commit('LOGS_USER', resp)
    })
  },
  read_user({ commit }, query) {
    return exec.read(query)
      .then(resp => {
        commit('READ_USER', resp)
      })
  },
  update_user({ commit }, user) {
    if(!user) return;
    return exec.update(user).then(resp => {
      commit('UPDATE_USER', resp)
      commit('LOGS_USER', resp)
    })
  },
  delete_user({ commit }, name) {
    if(!name) return;
    return exec.remove(name).then(resp => {
      commit('DELETE_USER', resp)
      commit('LOGS_USER', resp)
    })
  }
}

const getters = {
  user_list: state => state.users,
  user_flash: state => state.flash,
  user_logs: state => state.logs,
}

export default {
  state,
  mutations,
  actions,
  getters
}

