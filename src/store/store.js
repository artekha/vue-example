import Vue from 'vue';
import Vuex from 'vuex';

import managedata from '../helpers/managedata';

Vue.use(Vuex);

const START_REQUEST = 'START_REQUEST';
const FINISH_REQUEST = 'FINISH_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const CHANGE_ROUTE = 'CHANGE_ROUTE';
const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
const SET_ACTIVE_LINK = 'SET_ACTIVE_LINK';
const SET_APPS = 'SET_APPS';
const SET_SELECTED_CATEGORIES = 'SET_SELECTED_CATEGORIES';
const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_ASSIGNMENTS = 'SET_ASSIGNMENTS';
const SET_MICROSERVICES = 'SET_MICROSERVICES';
const SET_APIS = 'SET_APIS';

const strict = process.env.NODE_ENV !== 'production';

const getters = {
  WBToken: state => state.WBToken,
  userId: state => state.userId,
  message: state => state.message,
  messageRandom: state => state.messageRandom,
  pending: state => state.pending,
  route: state => state.route,
  isLoggedIn: state => state.isLoggedIn,
  navbarItems: state => state.navbarItems,
  profileMenuItems: state => state.profileMenuItems,
  apps: state => state.apps,
  selectedCategories: state => state.selectedCategories,
  categories: state => state.categories,
  assignments: state => state.assignments,
  microservices: state => state.microservices,
  apis: state => state.apis,
}

const actions = {
  login({ commit }, creds) {
    commit(START_REQUEST);
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
          commit(FINISH_REQUEST);
          resolve();
        })
        .catch(err => {
          commit(FINISH_REQUEST);
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
  },
  getApps({ commit }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getApps()
        .then(res => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_APPS,
            apps: res.body
          });
          resolve();
        })
        .catch(err => {
          commit(FINISH_REQUEST);
          console.log(err)
          reject();
        });
    });
  },
  getAssignments({ commit }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getAssignments()
        .then(res => {
          const s = store.state;
          const assignments = res.body.result;
          const filteredCategories = [];
          assignments.forEach(assignment => {
            const appIndex = s.apps.findIndex(app => app.id == assignment.appId);
            if (appIndex !== -1) {
              const app = s.apps[appIndex];
              if (
                filteredCategories.findIndex(cat => cat == app.Category) == -1
                && app.Category && app.Category !== 'Admin'
                && app.Category.length > 0
                && app.url
              ) {
                filteredCategories.push(app.Category);
              }
            }
          });
          commit({
            type: SET_SELECTED_CATEGORIES,
            selectedCategories: filteredCategories
          });
          commit({
            type: SET_CATEGORIES,
            categories: filteredCategories
          })

          commit(FINISH_REQUEST);
          commit({
            type: SET_ASSIGNMENTS,
            assignments: res.body.result
          });
          resolve();
        })
        .catch(err => {
          commit(FINISH_REQUEST);
          console.log(err)
          reject();
        });
    });
  },
  getMicroservices({ commit }) {
    commit(START_REQUEST);
    managedata.getMicroservices()
      .then(res => {
        commit(FINISH_REQUEST);
        commit({
          type: SET_MICROSERVICES,
          microservices: res.body
        });
      })
      .catch(err => {
        commit(FINISH_REQUEST);
        console.log(err)
      });
  },
  getApis({ commit }) {
    commit(START_REQUEST);
    managedata.getApis()
      .then(res => {
        commit(FINISH_REQUEST);
        commit({
          type: SET_APIS,
          apis: res.body
        });
      })
      .catch(err => {
        commit(FINISH_REQUEST);
        console.log(err)
      });
  }
};

const mutations = {
  [START_REQUEST](state) {
    state.pending = true;
  },
  [FINISH_REQUEST](state) {
    state.pending = false;
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
    state.message = payload.response.body.error.message;
  },
  [CHANGE_ROUTE](state, payload) {
    state.route = payload.item.url;
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
  },
  [SET_APPS](state, payload) {
    state.apps = payload.apps;
  },
  [SET_SELECTED_CATEGORIES](state, payload) {
    state.selectedCategories = payload.selectedCategories;
  },
  [SET_CATEGORIES](state, payload) {
    state.categories = payload.categories;
  },
  [SET_ASSIGNMENTS](state, payload) {
    state.assignments = payload.assignments;
  },
  [SET_MICROSERVICES](state, payload) {
    state.microservices = payload.microservices;
  },
  [SET_APIS](state, payload) {
    state.apis = payload.apis;
  },
};

const state = {
  isLoggedIn: !!localStorage.getItem('WBToken'),
  pending: false,
  WBToken: null,
  userId: null,
  message: null,
  messageRandom: null,
  route: null,
  apps: null,
  selectedCategories: [],
  categories: [],
  assignments: null,
  microservices: null,
  apis: null,
  verticals: [
    { name:"Logistics",show:true },
    { name:"Equipment",show:true },
    { name:"Industry",show:true },
    { name:"Admin",show:true }
  ],
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