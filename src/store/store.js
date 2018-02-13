import Vue from 'vue';
import Vuex from 'vuex';

import managedata from '../helpers/managedata';

Vue.use(Vuex);

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const CHANGE_ROUTE = 'CHANGE_ROUTE';

//const strict = process.env.NODE_ENV !== 'production';
const strict = false;
const getters = {
  message: state => state.message,
  pending: state => state.pending,
  route: state => state.route,
  isLoggedIn: state => state.isLoggedIn,
  navbarItems: state => state.navbarItems,
  profileMenuItems: state => state.profileMenuItems
}

const actions = {
  login({ commit }, creds) {
    commit(LOGIN);
    return new Promise(resolve => {
      managedata.login(creds.user)
        .then(res => {
          commit({
            type: LOGIN_SUCCESS,
            response: res.body,
            remember: creds.remember
          });
          resolve();
        })
        .catch(err => {
          commit({
            type: LOGIN_ERROR,
            response: err.body
          });
        });
    });
  },
  logout({ commit }) {
    commit(LOGOUT);
  },
  changeRoute({ commit }, url) {
    commit({
      type: CHANGE_ROUTE,
      url
    });
  }
};

const mutations = {
  [LOGIN](state) {
    state.pending = true;
  },
  [LOGOUT](state) {
    localStorage.removeItem('WBToken');
    localStorage.removeItem('userId');
    state.isLoggedIn = false;
    state.message = 'You logged out';
  },
  [LOGIN_SUCCESS](state, payload) {
    state.isLoggedIn = true;
    state.pending = false;
    state.WBToken = payload.response.id;
    state.userId = payload.response.userId;
    if (payload.remember) {
      localStorage.setItem('WBToken', state.WBToken);
      localStorage.setItem('userId', state.userId);
    }
    state.message = 'Login succesful. Welcome back!';
  },
  [LOGIN_ERROR](state, payload) {
    state.pending = false;
    state.message = payload.response.error.message;
  },
  [CHANGE_ROUTE](state, payload) {
    state.route = payload.url;
  }
};

const state = {
  isLoggedIn: !!localStorage.getItem('WBToken'),
  pending: false,
  WBToken: null,
  userId: null,
  message: null,
  route: null,
  navbarItems: [
    {
      id: 0,
      name: 'Applications',
      active: false,
      url: 'portal',
      onClick() {
        store.dispatch('changeRoute', this.url)
      }
    },
    {
      id: 1,
      name: 'Microservices',
      active: false,
      url: 'microservices',
      onClick() {
        store.dispatch('changeRoute', this.url)
      }
    },
    {
      id: 2,
      name: 'APIs',
      active: false,
      url: 'apis',
      onClick() {
        store.dispatch('changeRoute', this.url)
      }
    },
  ],
  profileMenuItems: [
    {
      icon: 'admin',
      name: 'Admin',
      url: 'admin',
      onClick() {
        store.dispatch('changeRoute', this.url)
      }
    },
    {
      icon: 'logout',
      name: 'Log out',
      url: 'logout',
      onClick() {
        store.dispatch('logout')
      }
    },
  ]
};

export const store = new Vuex.Store({
  strict,
  state,
  mutations,
  getters,
  actions
});