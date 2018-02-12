import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResoure from 'vue-resource';
import VueLocalStorage from 'vue-localstorage';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';

import { store } from './store/store'

import App from './App';
import Login from './components/Login';
import Portal from './components/Portal';
import Microservices from './components/Microservices';
import Admin from './components/Admin';

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(VueResoure);
Vue.use(VueLocalStorage);

Vue.material.registerTheme({
  default: {
    primary: 'orange',
    accent: 'black',
  }
});

Vue.material.setCurrentTheme('default');

const routes = [
  { path: '/portal', name:'portal', component: Portal},
  { path: '/microservices', name:'microservices', component: Microservices},
  { path: '/admin', name:'admin', component: Admin},
  { path: '/login', name:'login', component: Login},
];

const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
  next();
  const token = store.state.WBToken || localStorage.getItem('WBToken');
  if (((!token || token === '')) && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
