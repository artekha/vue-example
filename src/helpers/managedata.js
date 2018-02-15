import utils from './utils';
import config from './config';

const apiUrl = config.apiUrl[config.remoteAPI];

export default {
  login(user) {
    const url = `${apiUrl}/api/WBUsers/login`;
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
    const url = `${apiUrl}/api/WBApps/roles`;
    return utils.get(url, [{"key": "appId", "value": id}]);
  },
  createUserFromApp(user) {
    const url = `${apiUrl}/api/WBUsers/createFromApp`;
    return utils.post(url, user)
  }
}