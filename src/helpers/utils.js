import Vue from 'vue';

import { store } from '../store/store';

export default {
  token() {
    return store.state.WBToken || localStorage.getItem('WBToken');
  },
  get(url, params){
    let urlString = url;
    const token = this.token();
    params.push({key:'access_token', value:token});

    for (let i = 0; i < params.length; i++) {
      i === 0
        ? urlString += '?'
        : urlString += '&';

      urlString += `${params[i].key}=${params[i].value}`;
    }

    return new Promise((resolve, reject) => {
      Vue.http.get(urlString).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    })
  },
  post(url, data){
    let urlString = url;
    const token = this.token();
    urlString += '?access_token=' + token;
    return new Promise((resolve, reject) => {
      Vue.http.post(urlString, data).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  put(url, data){
    let urlString = url;
    const token = this.token();
    urlString += '?access_token=' + token;

    return new Promise((resolve, reject) => {
      Vue.http.put(urlString, data).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    })
  },
  delete(url, id){
    let urlString = `${url}/${id}`;
    const token = this.token();
    urlString += '?access_token=' + token;
    return new Promise((resolve, reject) => {
      Vue.http.delete(urlString).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    })
  },

}