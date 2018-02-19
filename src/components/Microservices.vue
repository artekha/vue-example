<template>
  <div class="microservices">
    <h1 class="main-headline">
      <div class="main-headline__text">Microservices</div>
    </h1>
    <div class="microservices-grid">
      <div
        v-if="microservices" v-for="microservice in microservices"
        @click="forward(microservice)"
        class="microservice"
      >
        <div class="microservice__name">{{microservice.name}}</div>
        <div class="microservice__host">Host: {{microservice.host}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import managedata from '../helpers/managedata';
import { mapGetters } from 'vuex';

export default {
  name: 'Microservices',
  computed: {
    ...mapGetters([
      'microservices'
    ])
  },
  methods: {
    forward(ms) {
      const url = ms.url;
      const token = this.WBToken || localStorage.getItem('WBToken');
      const userId = this.userId || localStorage.getItem('userId');
      window.location.href = url+"?wbtoken="+token+'&user='+userId;
    }
  },
  mounted() {
    this.$store.dispatch('getMicroservices');
  }
}
</script>

<style scoped>
.microservices-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-gap: 20px;
}
.microservice {
  height: 100px;
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

.microservice__name {
  margin-bottom: 15px;
  font-weight: 600;
}

.microservice:hover {
  border-color: #e3217c;
  box-shadow: none;
}
</style>
