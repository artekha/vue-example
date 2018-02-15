<template>
  <div class="admin">
    <div class="admin-area">
      <div class="admin-triggers">
        <div @click="currentTab = 1" class="admin-trigger" :class="[currentTab === 1 ? 'admin-trigger_active' : '']">Users</div>
        <div @click="currentTab = 2" class="admin-trigger" :class="[currentTab === 2 ? 'admin-trigger_active' : '']">Apps</div>
        <div @click="currentTab = 3" class="admin-trigger" :class="[currentTab === 3 ? 'admin-trigger_active' : '']">Roles</div>
        <div @click="currentTab = 4" class="admin-trigger" :class="[currentTab === 4 ? 'admin-trigger_active' : '']">Organizations</div>
        <div @click="currentTab = 5" class="admin-trigger" :class="[currentTab === 5 ? 'admin-trigger_active' : '']">Organization Assignments</div>
        <div @click="currentTab = 6" class="admin-trigger" :class="[currentTab === 6 ? 'admin-trigger_active' : '']">Api Users</div>
        <div @click="currentTab = 7" class="admin-trigger" :class="[currentTab === 7 ? 'admin-trigger_active' : '']">Api User Assignments</div>
      </div>
      <div class="admin-tabs">
        <div v-if="currentTab === 1" class="admin-tab">
          <admin-users></admin-users>
        </div>
        <div v-if="currentTab === 2" class="admin-tab">
          <admin-apps
        </div>
        <div v-if="currentTab === 3" class="admin-tab">3</div>
        <div v-if="currentTab === 4" class="admin-tab">4</div>
        <div v-if="currentTab === 5" class="admin-tab">5</div>
        <div v-if="currentTab === 6" class="admin-tab">6</div>
        <div v-if="currentTab === 7" class="admin-tab">7</div>
      </div>
    </div>
    <!-- <md-tabs class="md-transparent" md-centered>
      <md-tab md-label="Users">
        
      </md-tab>

      <md-tab md-label="Apps">
      </md-tab>

      <md-tab md-label="Roles">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas.</p>
      </md-tab>

      <md-tab md-label="Organizations">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas.</p>
      </md-tab>

      <md-tab md-label="Organisation Assignments">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas.</p>
      </md-tab>

      <md-tab md-label="Api Users">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas.</p>
      </md-tab>

      <md-tab md-label="Api User Assignments">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas.</p>
      </md-tab>

    </md-tabs> -->
  </div>
</template>

<script>
import AdminUsers from './AdminTabs/AdminUsers';

export default {
  name: 'Admin',
  components: {
    AdminUsers
  },
  data() {
    return {
      currentTab: 1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.admin-triggers {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.admin-trigger {
  padding: 10px 20px;
  border-bottom: 2px solid transparent;
  user-select: none;
  cursor: pointer;
  transition: all .2s;
}

.admin-trigger_active {
  border-bottom: 2px solid #ff9800;
  color: #ff9800;
}
</style>
