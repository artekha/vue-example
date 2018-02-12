import utils from './utils';
import config from './config';

const apiUrl = config.apiUrl[config.remoteAPI];

export default {
  login(user) {
    const url = `${apiUrl}/api/WBUsers/login`;
    return utils.post(url, user);
  },
}