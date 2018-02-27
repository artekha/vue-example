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
        <div @click="currentTab = 8" class="admin-trigger" :class="[currentTab === 8 ? 'admin-trigger_active' : '']">Api User Organization Assignments</div>
      </div>
      <div class="admin-tabs">
        <admin-users v-if="currentTab === 1"></admin-users>
        <admin-apps v-if="currentTab === 2"></admin-apps>
        <admin-roles v-if="currentTab === 3"></admin-roles>
        <admin-organizations v-if="currentTab === 4"></admin-organizations>
        <admin-organization-assignments v-if="currentTab === 5"></admin-organization-assignments>
        <admin-api-users v-if="currentTab === 6"></admin-api-users>
        <admin-api-user-app-assignments v-if="currentTab === 7"></admin-api-user-app-assignments>
        <admin-api-user-organization-assignments v-if="currentTab === 8"></admin-api-user-organization-assignments>
      </div>
    </div>
  </div>
</template>

<script>
import AdminUsers from './AdminTabs/AdminUsers';
import AdminApps from './AdminTabs/AdminApps';
import AdminRoles from './AdminTabs/AdminRoles';
import AdminOrganizations from './AdminTabs/AdminOrganizations';
import AdminOrganizationAssignments from './AdminTabs/AdminOrganizationAssignments';
import AdminApiUsers from './AdminTabs/AdminApiUsers';
import AdminApiUserAppAssignments from './AdminTabs/AdminApiUserAppAssignments';
import AdminApiUserOrganizationAssignments from './AdminTabs/AdminApiUserOrganizationAssignments';
import { mapGetters } from 'vuex';

export default {
  name: 'Admin',
  components: {
    AdminUsers,
    AdminApps,
    AdminRoles,
    AdminOrganizations,
    AdminOrganizationAssignments,
    AdminApiUsers,
    AdminApiUserAppAssignments,
    AdminApiUserOrganizationAssignments
  },
  computed: {
    ...mapGetters([
      'pending'
    ])
  },
  data() {
    return {
      currentTab: 1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
tbody.md-table-body {
  height: calc(100vh - 270px) !important;
  overflow: auto;
}

.admin-tab .md-table-card .md-table-pagination {
  justify-content: center;
}
</style>

<style scoped>
.admin-triggers {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  height: 40px;
}

.admin-trigger {
  padding: 10px 20px;
  border-bottom: 2px solid transparent;
  user-select: none;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: #999;
}

.admin-trigger_active {
  border-bottom: 2px solid #e3217c;
  color: #000;
}
</style>
