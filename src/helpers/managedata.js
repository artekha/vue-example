import utils from './utils';
import config from './config';

const apiUrl = config.apiUrl[config.remoteAPI];
const loginUrl = config.apiUrl[config.loginAPI];
export default {
  login(user) {
    const url = `${loginUrl}/api/WBUsers/login`;
    return utils.post(url, user);
  },
  getApps() {
    const url = `${apiUrl}/api/wbapps`;
    return utils.get(url, []);
  },
  getAssignments() {
    const url = `${apiUrl}/api/WBUsers/assignments`;
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
    return utils.put(url, user);
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
    return utils.post(url, user)
  },
  createApp(app) {
    const url = `${apiUrl}/api/WBApps`;
    return utils.post(url, app);
  },
  updateApp(app) {
    const url = `${apiUrl}/api/WBApps`;
    return utils.put(url, app);
  },
  deleteApp(app) {
    const url = `${apiUrl}/api/WBApps`;
    return utils.delete(url, app.id);
  },
  createRole(role) {
    const url = `${apiUrl}/api/UserAppAssignments`;
    return utils.post(url, role);
  },
  updateRole(role) {
    const url = `${apiUrl}/api/UserAppAssignments`;
    return utils.put(url, role);
  },
  deleteRole(role) {
    const url = `${apiUrl}/api/UserAppAssignments`;
    return utils.delete(url, role.id);
  },
}