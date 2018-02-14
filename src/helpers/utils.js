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
      console.log(urlString);
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
  put(url, data, cb, errcb){
    let urlString = url;
    const token = this.token();
    urlString += '?access_token=' + token;

    Vue.http.put(urlString, data).then(
      res => {
        cb(response);
      },
      err => {
        errcb(err);
      }
    );
  },
  delete(url, id, cb, errcb){
    Vue.http.delete(url + '/' + id).then(
      res => {
        cb(response);
      },
      err => {
        errcb(err);
      }
    );
  },

}