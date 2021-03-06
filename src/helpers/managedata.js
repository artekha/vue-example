import Vue from 'vue';

import utils from './utils';
import config from './config';

const apiUrl = config.apiUrl[config.remoteAPI];
const loginUrl = config.apiUrl[config.loginAPI];

export default {
  login(user) {
    const url = `${loginUrl}/api/WBUsers/login`;
    return utils.post(url, [], user);
  },
  forgotPassword(email) {
    const creds = {
      email,
      location: config.uiUrl[config.localAPI]
    }
    const url = `${apiUrl}/api/WBUsers/reset`;
    return utils.post(url, [],creds);
  },
  changePassword(password, token) {
    let urlString = `${apiUrl}/api/WBUsers/passwordReset`;
    let params = [];
    params.push({key:'access_token', value:token});

    for (let i = 0; i < params.length; i++) {
      i === 0
        ? urlString += '?'
        : urlString += '&';

      urlString += `${params[i].key}=${params[i].value}`;
    }

    return new Promise((resolve, reject) => {
      Vue.http.post(urlString, {password}).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    })
  },
  validatePassword(password) {
    const url = `${apiUrl}/api/WBUsers/validateNewPassword`;
    return utils.get(url, [{"key": "password", "value": password}]);
  },
  validateUsername(email, username) {
    const url = `${apiUrl}/api/WBUsers/validateNewUsername`;
    return utils.get(url, [{"key": "email", "value": email}, {"key": "username", "value": username}]);
  },
  checkActivateKeyEmail(email, key) {
    const url = `${apiUrl}/api/WBUsers/validateParameters`;
    return utils.get(url, [{"key": "key", "value": key}, {"key": "email", "value": email}]);
  },
  getDescriptionValues(email, key) {
    const url = `${apiUrl}/api/WBUsers/userDetails`;
    return utils.get(url, [{"key": "key", "value": key}, {"key": "email", "value": email}]);
  },
  activateUser(newUser) {
    const url = `${apiUrl}/api/WBUsers/activate`;
    return utils.post(url, [], newUser);
  },
  getUser(id) {
    const url = `${loginUrl}/api/WBUsers/${id}`;
    return utils.get(url, [{"key": "filter[include]", "value": "appAssignments"}]);
  },
  getApps() {
    const url = `${apiUrl}/api/Authorizeds/getApps`;
    return utils.get(url, []);
  },
  getAssignments() {
    const url = `${apiUrl}/api/Authorizeds/assignments`;
    return utils.get(url, []);
  },
  getMicroservices() {
    const url = `${apiUrl}/api/wbMicroServices`;
    return utils.get(url, []);
  },
  getApis() {
    const url = `${apiUrl}/api/wbAPIs`;
    return utils.get(url, []);
  },
  getUserStatuses() {
    const url = `${apiUrl}/api/WBUsers/allStatuses`;
    return utils.get(url, []);
  },
  getUsers() {
    const url = `${apiUrl}/api/WBUsers`;
    return utils.get(url, []);
  },
  updateUser(user) {
    const url = `${apiUrl}/api/WBUsers`;
    return utils.put(url, [], user);
  },
  deleteUser(id) {
    const url = `${apiUrl}/api/WBUsers`;
    return utils.delete(url, id);
  },
  getRoles(id) {
    let url = '';
    let params = [];
    if (id) {
      url = `${apiUrl}/api/WBApps/roles`;
      params.push({"key": "appId", "value": id});
    } else {
      url = `${apiUrl}/api/UserAppAssignments`;
      params.push({"key": "filter", "value": "%7B%22include%22%3A[%22app%22,%22user%22]%7D"});
    }
    return utils.get(url, params);
  },
  createUserFromApp(user) {
    const url = `${apiUrl}/api/WBUsers/createFromApp`;
    return utils.post(url, [], user)
  },
  createApp(app) {
    const url = `${apiUrl}/api/WBApps`;
    return utils.post(url, [], app);
  },
  updateApp(app) {
    const url = `${apiUrl}/api/WBApps`;
    return utils.put(url, [], app);
  },
  deleteApp(app) {
    const url = `${apiUrl}/api/WBApps`;
    return utils.delete(url, app.id);
  },
  createRole(role) {
    const url = `${apiUrl}/api/UserAppAssignments`;
    return utils.post(url, [], role);
  },
  updateRole(role) {
    const url = `${apiUrl}/api/UserAppAssignments`;
    return utils.put(url, [], role);
  },
  deleteRole(role) {
    const url = `${apiUrl}/api/UserAppAssignments`;
    return utils.delete(url, role.id);
  },
  getOrganizations() {
    const url = `${apiUrl}/api/Organizations`;
    return utils.get(url, []);
  },
  createOrganization(organization) {
    const url = `${apiUrl}/api/Organizations`;
    return utils.post(url, [], organization);
  },
  updateOrganization(organization) {
    const url = `${apiUrl}/api/Organizations`;
    return utils.put(url, [], organization);
  },
  deleteOrganization(organization) {
    const url = `${apiUrl}/api/Organizations`;
    return utils.delete(url, organization.id);
  },
  getOrganizationAssignments() {
    let params = [];
    const url = `${apiUrl}/api/UserOrganizationAssignments`;
    params.push({"key": "filter", "value": "%7B%22include%22%3A[%22organization%22,%22user%22]%7D"});
    return utils.get(url, params);
  },
  createOrganizationAssignment(organizationAssignment) {
    const url = `${apiUrl}/api/UserOrganizationAssignments`;
    return utils.post(url, [], organizationAssignment);
  },
  updateOrganizationAssignment(organizationAssignment) {
    const url = `${apiUrl}/api/UserOrganizationAssignments`;
    return utils.put(url, [], organizationAssignment);
  },
  deleteOrganizationAssignment(organizationAssignment) {
    const url = `${apiUrl}/api/UserOrganizationAssignments`;
    return utils.delete(url, organizationAssignment.id);
  },
  getWBAlgorithmUsers() {
    let params = [];
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.get(url, []);
  },
  createWBAlgorithmUser(user) {
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.post(url, [], user);
  },
  updateWBAlgorithmUser(user) {
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.put(url, [], user);
  },
  deleteWBAlgorithmUser(user) {
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.delete(url, user.id);
  },
  getWBAlgorithmUsers() {
    let params = [];
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.get(url, []);
  },
  createWBAlgorithmUser(user) {
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.post(url, [], user);
  },
  updateWBAlgorithmUser(user) {
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.put(url, [], user);
  },
  deleteWBAlgorithmUser(user) {
    const url = `${apiUrl}/api/wbAlgorithmUsers`;
    return utils.delete(url, user.id);
  },
  getWBAlgorithmUserAppAssignments() {
    const url = `${apiUrl}/api/wbalgorithmuserappassignments`;
    return utils.get(url, [{"key": "filter", "value": "%7B%22include%22%3A[%22wbAlgorithmUser%22,%22app%22]%7D"}])
  },
  createWBAlgorithmUserAppAssignment(userAppAssignment) {
    const url = `${apiUrl}/api/wbalgorithmuserappassignments`;
    return utils.post(url, [], userAppAssignment);
  },
  updateWBAlgorithmUserAppAssignment(userAppAssignment) {
    const url = `${apiUrl}/api/wbalgorithmuserappassignments`;
    return utils.put(url, [], userAppAssignment);
  },
  deleteWBAlgorithmUserAppAssignment(userAppAssignment) {
    const url = `${apiUrl}/api/wbalgorithmuserappassignments`;
    return utils.delete(url, userAppAssignment.id);
  },
  getWBAlgorithmUserOrganizationAssignments() {
    const url = `${apiUrl}/api/wbalgorithmuserorganizationassignments`;
    return utils.get(url, [{"key": "filter", "value": "%7B%22include%22%3A[%22wbAlgorithmUser%22,%22organization%22]%7D"}])
  },
  createWBAlgorithmUserOrganizationAssignment(userOrganizationAssignment) {
    const url = `${apiUrl}/api/wbalgorithmuserorganizationassignments`;
    return utils.post(url, [], userOrganizationAssignment);
  },
  updateWBAlgorithmUserOrganizationAssignment(userOrganizationAssignment) {
    const url = `${apiUrl}/api/wbalgorithmuserorganizationassignments`;
    return utils.put(url, [], userOrganizationAssignment);
  },
  deleteWBAlgorithmUserOrganizationAssignment(userOrganizationAssignment) {
    const url = `${apiUrl}/api/wbalgorithmuserorganizationassignments`;
    return utils.delete(url, userOrganizationAssignment.id);
  },
}