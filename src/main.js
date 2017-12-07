// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router'
import VueLocalStorage from 'vue-localstorage';
import Main from './Main.vue';
import App from './App';
import Login from 'WBCoreLogin';
const VueMaterial = require('vue-material');
require('vue-material/dist/vue-material.css');

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(VueLocalStorage);

Vue.material.registerTheme({
  default: {
    primary: 'orange',
    accent: 'black',
  }
});
Vue.material.setCurrentTheme('default');

const routes = [
  { path: '/login', name:'login', component: Login},
  { path: '/main', name:'main', component: Main},
  { path: '*', redirect: '/main'}
]

const router = new VueRouter({
  routes // short for routes: routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('WBToken');
  if ((!token || token === '') && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

