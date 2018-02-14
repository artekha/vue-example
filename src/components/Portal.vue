<template>
  <div class="portal">
    <h1 class="main-headline">
      <div class="main-headline__text">Applications</div>
    </h1>
    <div class="portal-filter">
      <md-input-container v-if="localSelectedCategories">
        <label for="users=">Categories</label>
        <md-select name="option=" id="option=" multiple v-model="localSelectedCategories">
          <md-option v-for="(item, index) in categories"
            :key="index"
            :value="item">
            {{ item }}
          </md-option>
        </md-select>
      </md-input-container>
    </div>
    <div class="portal-apps">
      <div
        v-if="apps && hasCategory(app.Category) && enabled(app) && app.Category !== 'Admin' && app.url"
        v-for="app in sortedApps"
        class="portal-app"
        @click="forward(app)"
      >
        <div class="portal-app__image">
          <img :src="'/static/' + app.image" alt="">
          <div class="portal-app__image-placeholder">WB</div>
        </div>
        <div class="portal-app__name">{{app.Name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import managedata from '../helpers/managedata';
import { mapGetters } from 'vuex';

export default {
  name: 'Portal',
  computed: {
    ...mapGetters([
      'apps',
      'selectedCategories',
      'categories',
      'assignments',
      'WBToken',
      'userId'
    ]),
    sortedApps() {
      return this.apps && this.apps.slice().sort((a, b) => {
        const catA = a.Category && a.Category.toUpperCase();
        const catB = b.Category && b.Category.toUpperCase();

        if (catA < catB) {
          return -1;
        }
        if (catA > catB) {
          return 1;
        }
        return 0;
      })
    }
  },
  data() {
    return {
      localSelectedCategories: null
    }
  },
  methods: {
    hasCategory(category) {
      return this.localSelectedCategories && this.localSelectedCategories.findIndex(cat => cat === category) !== -1;
    },
    enabled(app) {
      return this.assignments && this.assignments.findIndex(assignment => assignment.appId == app.id) !== -1;
    },
    forward(app) {
      if(this.enabled(app)){
        const url = app.url;
        const token = this.WBToken || localStorage.getItem('WBToken');
        const userId = this.userId || localStorage.getItem('userId');
        window.location.href = url+"?wbtoken="+token+'&user='+userId;
      }
    }
  },
  mounted() {
    this.$store.dispatch('getApps')
      .then(() => {
        return this.$store.dispatch('getAssignments');
      })
      .then(() => {
        this.localSelectedCategories = this.selectedCategories;
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.portal-filter {
  width: 400px;
  margin: 20px auto;
}

.portal-apps {
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-gap: 20px;
  padding: 20px;
}
.portal-app {
  height: 270px;
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  border: 2px solid transparent;
  cursor: pointer;
  padding: 10px;
  user-select: none;
}

.portal-app:hover {
  border-color: #ff9800;
  box-shadow: none;
}

.portal-app__image {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
}

.portal-app__image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ff9800;
  color: #fff;
  text-shadow: 1px 3px 1px rgba(0,0,0,.3);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
}

.portal-app__image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
}

.portal-app__name {
  text-align: center;
  margin-top: 20px;
}
</style>
