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
  }
}