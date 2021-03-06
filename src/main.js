import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResoure from 'vue-resource';
import VueLocalStorage from 'vue-localstorage';
import VueMaterial from 'vue-material';
import Vuelidate from 'vuelidate';
import 'vue-material/dist/vue-material.css';

import { store } from './store/store';

import App from './App';
import Login from './components/Login';
import PasswordChange from './components/PasswordChange';
import Activate from './components/Activate';
import Portal from './components/Portal';
import Microservices from './components/Microservices';
import Apis from './components/Apis';
import Admin from './components/Admin';

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(VueResoure);
Vue.use(VueLocalStorage);
Vue.use(Vuelidate);

Vue.material.registerTheme({
  default: {
    primary: 'blue',
    accent: 'blue',
    warn: 'blue',
    background: 'white'
  }
});

Vue.material.setCurrentTheme('default');

const routes = [
  { path: '/portal', name:'portal', component: Portal},
  { path: '/microservices', name:'microservices', component: Microservices},
  { path: '/apis', name:'apis', component: Apis},
  { path: '/admin', name:'admin', component: Admin},
  { path: '/login', name:'login', component: Login},
  { path: '/externallogin', name:'externallogin', component: Login},
  { path: '/passwordchange', name:'passwordchange', component: PasswordChange},
  { path: '/activate', name:'activate', component: Activate},
  { path: '*', redirect: { name: 'portal' }}
];

const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
  next();
  const token = store.state.WBToken || localStorage.getItem('WBToken');
  if ((!token || token === '') && to.path !== '/login' && to.path !== '/passwordchange' && to.path !== '/externallogin' && to.path !== '/activate') {
    next('/login');
  } else if ((token && token !== '') && to.path === '/login' && to.path !== '/passwordchange' && to.path !== '/externallogin' && to.path !== '/activate') {
    next('/portal');
  } else {
    next();
  }

  if (to.path !== '/login' && to.path !== '/passwordchange') {
    store.dispatch('getUser');
  }

  const routeName = to.path.replace('/', '');
  const currentItem = store.state.navbarItems
    .find(item => item.url === routeName);

  store.commit({
    type: 'SET_ACTIVE_LINK',
    currentItem
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
