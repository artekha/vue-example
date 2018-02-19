<template>
  <div class="apis">
    <h1 class="main-headline">
      <div class="main-headline__text">Apis</div>
    </h1>
    <div class="apis-grid">
      <div @click="forward(api)" v-if="apis" v-for="api in apis" class="api">
        <div class="api__name">{{api.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import managedata from '../helpers/managedata';
import { mapGetters } from 'vuex';

export default {
  name: 'apis',
  computed: {
    ...mapGetters([
      'apis'
    ])
  },
  methods: {
    forward(api) {
      const url = api.url;
      const token = this.WBToken || localStorage.getItem('WBToken');
      const userId = this.userId || localStorage.getItem('userId');
      window.location.href = url+"?wbtoken="+token+'&user='+userId;
    }
  },
  mounted() {
    this.$store.dispatch('getApis');
  }
}
</script>

<style scoped>
.apis-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-gap: 20px;
}
.api {
  height: 80px;
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  border: 2px solid transparent;
  cursor: pointer;
  padding: 10px;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: .9rem;
}

.api__name {
  font-weight: 600;
}

.api:hover {
  border-color: #e3217c;
  box-shadow: none;
}
</style>
