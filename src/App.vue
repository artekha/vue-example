<template>
  <div id="app">
    <div class="preloader">
      <md-progress
        v-show="pending"
        class="md-warn"
        md-indeterminate
      ></md-progress>
    </div>
    <wb-nav
      :navbarItems="navbarItems"
      :profileMenuItems="profileMenuItems"
      :title="'WB Portal'"
      :showItems="isLoggedIn"
    ></wb-nav>
    <router-view></router-view>
    <md-snackbar :md-position="'bottom left'" ref="snackbar" :md-duration="2000">
      <span>{{message}}</span>
    </md-snackbar>
  </div>
</template>
<script>
import wbNav from 'wb-nav';
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  components: {
    wbNav
  },
  computed: {
    ...mapGetters([
      'message',
      'pending',
      'isLoggedIn',
      'navbarItems',
      'profileMenuItems'
    ])
  },
  watch: {
    message() {
      this.$refs.snackbar.open();
    },
    isLoggedIn(newValue, oldValue) {
      if (!newValue) {
        this.$router.push('login');
      }
    }
  },
  methods: {
    changeLocation(item) {
      this.$router.push(item.url);
    }
  },
  mounted() {
  }
};
</script>
<style>
*,
*:after,
*:before {
  box-sizing: border-box;
  outline: none;
}

body {
  font-size: 16px;
}
#app nav.navbar {
  border-bottom: 1px solid #ccc !important;
}

#app nav.navbar a.nav-item.nav-link {
  line-height: 86px;
  font-size: .9rem;
}

#app .nav>.nav-item.nav-link>a {
  border: none !important;
}
.preloader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.main-headline {
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
  padding: 20px;
  margin: 0 auto;
}
</style>