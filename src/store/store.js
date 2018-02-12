import Vue from 'vue';
import Vuex from 'vuex';

import managedata from '../helpers/managedata';

Vue.use(Vuex);

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const REDIRECT_TO_HOME = 'REDIRECT_TO_HOME';
const SHOW_SNACKBAR = 'SHOW_SNACKBAR';

const strict = process.env.NODE_ENV !== 'production';

const logout = () => {
  store.dispatch('logout');
}

const getters = {
  message: state => state.message,
  pending: state => state.pending,
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
        })
        .then(() => {
          commit({
            type: SHOW_SNACKBAR
          });
          resolve();
        })
        .catch(err => {
          commit({
            type: LOGIN_ERROR,
            response: err.body
          });
          commit({
            type: SHOW_SNACKBAR
          });
        });
    });
  },
  logout({ commit }) {
    commit(LOGOUT);
    // commit({
    //   type: SHOW_SNACKBAR,
    //   refs: creds.vueInstance.$refs
    // });
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
  [LOGIN_ERROR](state, err) {
    state.pending = false;
    state.message = err.response.error.message;
  },
  [SHOW_SNACKBAR](state) {
  }
};

const state = {
  isLoggedIn: !!localStorage.getItem('WBToken'),
  pending: false,
  WBToken: null,
  userId: null,
  message: null,
  navbarItems: [
    {
      id: 0,
      name: 'Applications',
      active: false,
      url: 'portal',
    },
    {
      id: 1,
      name: 'Microservices',
      active: false,
      url: 'microservices',
    },
    {
      id: 2,
      name: 'APIs',
      active: false,
      url: 'apis',
    },
  ],
  profileMenuItems: [
    {
      icon: 'admin',
      name: 'Admin',
      url: 'admin',
    },
    {
      icon: 'logout',
      name: 'Log out',
      url: 'logout',
      onClick: logout
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