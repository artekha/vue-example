import Vue from 'vue';
import Vuex from 'vuex';

import managedata from '../helpers/managedata';
import config from '../helpers/config';

Vue.use(Vuex);

const START_REQUEST = 'START_REQUEST';
const FINISH_REQUEST = 'FINISH_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const SET_ROUTE = 'SET_ROUTE';
const SET_USER = 'SET_USER';
const SET_ROLE = 'SET_ROLE';
const CHANGE_ROUTE = 'CHANGE_ROUTE';
const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
const SET_ACTIVE_LINK = 'SET_ACTIVE_LINK';
const SET_MESSAGE = 'SET_MESSAGE';
const SET_APPS = 'SET_APPS';
const SET_SELECTED_CATEGORIES = 'SET_SELECTED_CATEGORIES';
const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_ASSIGNMENTS = 'SET_ASSIGNMENTS';
const SET_MICROSERVICES = 'SET_MICROSERVICES';
const SET_APIS = 'SET_APIS';
const SET_USER_STATUSES = 'SET_USER_STATUSES';
const SET_USERS = 'SET_USERS';
const SET_ROLES = 'SET_ROLES';
const SET_ORGANIZATIONS = 'SET_ORGANIZATIONS';
const SET_ORGANIZATION_ASSIGNMENT = 'SET_ORGANIZATION_ASSIGNMENT';
const SET_WB_ALGORITHM_USERS = 'SET_WB_ALGORITHM_USERS';

const strict = process.env.NODE_ENV !== 'production';

const getters = {
  WBToken: state => state.WBToken,
  userId: state => state.userId,
  user: state => state.user,
  role: state => state.role,
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
  userStatuses: state => state.userStatuses,
  users: state => state.users,
  roles: state => state.roles,
  organizations: state => state.organizations,
  organizationAssignments: state => state.organizationAssignments,
  WBAlgorithmUsers: state => state.WBAlgorithmUsers,
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
          if (neededRoute && !creds.isExternal) {
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
  forgotPassword({ commit }, email) {
    if (!email) {
      commit({
        type: SET_MESSAGE,
        message: 'Email not sent, fill the email field.'
      });
      return false;
    }
    commit(START_REQUEST);
    managedata.forgotPassword(email)
      .then(res => {
        const message = `An email has been sent to ${email}`;
        commit({
          type: SET_MESSAGE,
          message
        })
        commit(FINISH_REQUEST);
      })
      .catch(err => {
        console.log(err);
        commit(FINISH_REQUEST);
      })
  },
  changePassword({ commit }, payload) {
    commit(START_REQUEST);
    managedata.changePassword(payload.pw, payload.token)
      .then(res => {
        const message = `Password has been changed`;
        commit({
          type: SET_MESSAGE,
          message
        })
        commit({
          type: SET_ROUTE,
          route: 'login'
        });
        commit(FINISH_REQUEST);
      })
      .catch(err => {
        console.log(err);
        commit(FINISH_REQUEST);
      })
  },
  getUser({ commit, state }) {
    const userId = state.userId || localStorage.getItem('userId');
    commit(START_REQUEST);
    managedata.getUser(userId)
      .then(res => {
        const assignmentId = res.body.appAssignments.findIndex(assignment => assignment.appId == config.appId);
        if (assignmentId < 0) {
          commit(LOGOUT);
          console.log(res.body.appAssignments[assignmentId].role)
        } else {
          commit({
            type: SET_ROLE,
            role: res.body.appAssignments[assignmentId].role
          });
        }
        commit({
          type: SET_USER,
          user: res.body
        });
        commit(FINISH_REQUEST)
      })
      .catch(err => {
        console.log(err);
        commit(FINISH_REQUEST);
      });
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
  },
  getUserStatuses({ commit }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getUserStatuses()
        .then(res => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_USER_STATUSES,
            userStatuses: res.body
          });
          resolve();
        })
        .catch(err => {
          commit(FINISH_REQUEST);
          console.log(err);
          reject();
        });
    });
  },
  getUsers({ commit, state }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getUsers()
        .then(res => {
          const users = res.body;
          const usersWithStatuses = users.map(user => {
            const newUser = Object.assign({}, user);
            newUser.status = state.userStatuses[newUser.id];
            return newUser;
          })
          commit(FINISH_REQUEST);
          commit({
            type: SET_USERS,
            users: usersWithStatuses
          });
          resolve();
        })
        .catch(err => {
          commit(FINISH_REQUEST);
          console.log(err);
          reject();
        });
    });
  },
  createUserFromApp({ commit, state }, payload) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.createUserFromApp(payload.user)
        .then(res => {
          commit({
            type: SET_MESSAGE,
            message: 'New user added'
          })
          commit(FINISH_REQUEST);
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })

    })
  },
  updateUser({ commit }, user) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.updateUser(user)
        .then(res => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'User updated'
          })
          resolve();
        })
        .catch(err => {
          commit(FINISH_REQUEST);
          console.log(err);
          reject();
        })
    });
  },
  deleteUser({ commit }, user) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.deleteUser(user.id)
        .then(res => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'User deleted'
          })
          resolve();
        })
        .catch(err => {
          commit(FINISH_REQUEST);
          console.log(err);
          reject();
        })
    });
  },
  getRolesById({ commit }, payload) {
    commit(START_REQUEST);
    const data = (payload && payload.id) || null;
    return new Promise((resolve, reject) => {
      managedata.getRoles(data)
        .then(res => {
          commit({
            type: SET_ROLES,
            roles: res.body
          });
          commit(FINISH_REQUEST);
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    });
  },
  createApp({ commit }, app) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.createApp(app)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'App added'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  updateApp({ commit }, app) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.updateApp(app)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'App updated'
          })
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  deleteApp({ commit }, app) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.deleteApp(app)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'App deleted'
          })
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  getRoles({ commit }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getRoles()
        .then(res => {
          commit({
            type: SET_ROLES,
            roles: res.body
          });
          commit(FINISH_REQUEST);
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    });
  },
  createRole({ commit }, role) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.createRole(role)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Role added'
          })
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          resolve();
        })
    })
  },
  updateRole({ commit }, role) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.updateRole(role)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Role updated'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  deleteRole({ commit }, role) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.deleteRole(role)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Role deleted'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  getOrganizations({ commit }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getOrganizations()
        .then(res => {
          commit({
            type: SET_ORGANIZATIONS,
            organizations: res.body
          });
          commit(FINISH_REQUEST);
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    });
  },
  createOrganization({ commit }, organization) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.createOrganization(organization)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Organization added'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  updateOrganization({ commit }, organization) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.updateOrganization(organization)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Organization updated'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  deleteOrganization({ commit }, organization) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.deleteOrganization(organization)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Organization deleted'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  getOrganizationAssignments({ commit }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getOrganizationAssignments()
        .then(res => {
          commit({
            type: SET_ORGANIZATION_ASSIGNMENT,
            organizationAssignments: res.body
          });
          commit(FINISH_REQUEST);
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    });
  },
  createOrganizationAssignment({ commit }, organization) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.createOrganization(organization)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Organization assignment added'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  updateOrganizationAssignment({ commit }, organization) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.updateOrganization(organization)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Organization assignment updated'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  deleteOrganizationAssignment({ commit }, organization) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.deleteOrganization(organization)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'Organization assignment deleted'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  getWBAlgorithmUsers({ commit }) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.getWBAlgorithmUsers()
        .then(res => {
          commit({
            type: SET_WB_ALGORITHM_USERS,
            WBAlgorithmUsers: res.body
          });
          commit(FINISH_REQUEST);
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    });
  },
  createWBAlgorithmUser({ commit }, WBAlgorithmUser) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.createWBAlgorithmUser(WBAlgorithmUser)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'API user added'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  updateWBAlgorithmUser({ commit }, WBAlgorithmUser) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.updateWBAlgorithmUser(WBAlgorithmUser)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'API user updated'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
  deleteWBAlgorithmUser({ commit }, WBAlgorithmUsers) {
    commit(START_REQUEST);
    return new Promise((resolve, reject) => {
      managedata.deleteWBAlgorithmUser(WBAlgorithmUsers)
        .then(() => {
          commit(FINISH_REQUEST);
          commit({
            type: SET_MESSAGE,
            message: 'API user deleted'
          });
          resolve();
        })
        .catch(err => {
          console.log(err);
          commit(FINISH_REQUEST);
          reject();
        })
    })
  },
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
  [SET_ROUTE](state, payload) {
    state.route = payload.route;
  },
  [SET_USER](state, payload) {
    state.user = payload.user;
  },
  [SET_ROLE](state, payload) {
    state.role = payload.role;
  },
  [CHANGE_ROUTE](state, payload) {
    state.route = payload.item.url;
  },
  [CLEAR_MESSAGE](state) {
    state.messageRandom = Math.random();
    state.message = null
  },
  [SET_MESSAGE](state, payload) {
    this.commit(CLEAR_MESSAGE);
    state.message = payload.message;
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
  [SET_USER_STATUSES](state, payload) {
    state.userStatuses = payload.userStatuses;
  },
  [SET_USERS](state, payload) {
    state.users = payload.users;
  },
  [SET_ROLES](state, payload) {
    state.roles = payload.roles;
  },
  [SET_ORGANIZATIONS](state, payload) {
    state.organizations = payload.organizations;
  },
  [SET_ORGANIZATION_ASSIGNMENT](state, payload) {
    state.organizationAssignments = payload.organizationAssignments;
  },
  [SET_WB_ALGORITHM_USERS](state, payload) {
    state.WBAlgorithmUsers = payload.WBAlgorithmUsers;
  },
};

const state = {
  isLoggedIn: !!localStorage.getItem('WBToken'),
  pending: false,
  WBToken: null,
  userId: null,
  user: null,
  role: null,
  message: null,
  messageRandom: null,
  route: null,
  apps: null,
  selectedCategories: [],
  categories: [],
  assignments: null,
  microservices: null,
  apis: null,
  userStatuses: null,
  users: null,
  roles: null,
  organizations: null,
  organizationAssignments: null,
  WBAlgorithmUsers: null,
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