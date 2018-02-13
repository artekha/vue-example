import Vue from 'vue';
import Vuex from 'vuex';

import managedata from '../helpers/managedata';

Vue.use(Vuex);

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const CHANGE_ROUTE = 'CHANGE_ROUTE';
const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
const SET_ACTIVE_LINK = 'SET_ACTIVE_LINK';

const strict = process.env.NODE_ENV !== 'production';

const getters = {
  message: state => state.message,
  messageRandom: state => state.messageRandom,
  pending: state => state.pending,
  route: state => state.route,
  isLoggedIn: state => state.isLoggedIn,
  navbarItems: state => state.navbarItems,
  profileMenuItems: state => state.profileMenuItems
}

const actions = {
  login({ commit }, creds) {
    commit(LOGIN);
    const neededRoute = this.state.navbarItems
      .find(item => item.url === 'portal');
    return new Promise(resolve => {
      managedata.login(creds.user)
        .then(res => {
          commit({
            type: LOGIN_SUCCESS,
            response: res.body,
            remember: creds.remember
          });
          if (neededRoute) {
            commit({
              type: CHANGE_ROUTE,
              item: neededRoute
            })
          }
          resolve();
        })
        .catch(err => {
          commit({
            type: LOGIN_ERROR,
            response: err
          });
        });
    });
  },
  logout({ commit }) {
    commit(LOGOUT);
  },
  changeRoute({ commit }, item) {
    commit({
      type: CHANGE_ROUTE,
      item
    });
  }
};

const mutations = {
  [LOGIN](state) {
    state.pending = true;
  },
  [LOGOUT](state) {
    this.commit(CLEAR_MESSAGE);
    localStorage.removeItem('WBToken');
    localStorage.removeItem('userId');
    state.WBToken = null;
    state.userId = null;
    state.isLoggedIn = false;
    state.route = 'login';
    state.message = 'You logged out';
  },
  [LOGIN_SUCCESS](state, payload) {
    this.commit(CLEAR_MESSAGE);
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
    this.commit(CLEAR_MESSAGE);
    state.pending = false;
    state.message = payload.response.body.error.message;
  },
  [CHANGE_ROUTE](state, payload) {
    state.route = payload.item.url;
    const currentItem = state.navbarItems.find(item => {
      return item.id === payload.item.id;
    });

    // this.commit({
    //   type: SET_ACTIVE_LINK,
    //   currentItem
    // });
  },
  [CLEAR_MESSAGE](state) {
    state.messageRandom = Math.random();
    state.message = null
  },
  [SET_ACTIVE_LINK](state, payload) {
    const currentItem = payload.currentItem;
    if (currentItem) {
      state.navbarItems.forEach(item => {
        if (currentItem.id === item.id) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    } else {
      state.navbarItems.forEach(item => {
        item.active = false;
      })
    }
  }
};

const state = {
  isLoggedIn: !!localStorage.getItem('WBToken'),
  pending: false,
  WBToken: null,
  userId: null,
  message: null,
  messageRandom: null,
  route: null,
  navbarItems: [
    {
      id: 0,
      name: 'Applications',
      active: false,
      url: 'portal',
      onClick() {
        store.dispatch('changeRoute', this)
      }
    },
    {
      id: 1,
      name: 'Microservices',
      active: false,
      url: 'microservices',
      onClick() {
        store.dispatch('changeRoute', this)
      }
    },
    {
      id: 2,
      name: 'APIs',
      active: false,
      url: 'apis',
      onClick() {
        store.dispatch('changeRoute', this)
      }
    },
  ],
  profileMenuItems: [
    {
      icon: 'admin',
      name: 'Admin',
      url: 'admin',
      onClick() {
        store.dispatch('changeRoute', this)
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