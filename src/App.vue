<template>
  <div id="app">
    <div class="preloader">
      <md-progress
        v-if="pending"
        class="md-warn"
        md-indeterminate
      ></md-progress>
    </div>
    <wb-nav
      :vuexUsing="true"
      :navbarItems="navbarItems"
      :profileMenuItems="profileMenuItems"
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
      'messageRandom',
      'pending',
      'route',
      'isLoggedIn',
      'navbarItems',
      'profileMenuItems'
    ]),
    navbarItemsLocal() {
      return this.navbarItems;
    }
  },
  watch: {
    messageRandom(newValue, oldValue) {
      if (newValue) {
        this.$refs.snackbar.open();
      }
    },
    isLoggedIn(newValue, oldValue) {
      if (!newValue) {
        this.$router.push('login');
      }
    },
    route(newValue, oldValue) {
      this.$router.push(newValue);
    }
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
  font-family: 'WidgetBrain';
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
  margin: 0 auto;
}

.main-headline__text {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  border-bottom: 2px solid #ff9800;
}

.md-table .md-table-cell .md-table-cell-container {
  padding-top: 0;
  padding-bottom: 0;
}

.md-table .md-table-cell:last-child .md-table-cell-container {
  padding-left: 0;
}
</style>