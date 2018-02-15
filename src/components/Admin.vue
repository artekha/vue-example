<template>
  <div class="admin">
    <h1 class="main-headline">
      <div class="main-headline__text">Admin</div>
    </h1>
    <md-tabs class="md-transparent" md-centered>
      <md-tab md-label="Users">
        <admin-users></admin-users>
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

    </md-tabs>
  </div>
</template>

<script>
import AdminUsers from './AdminTabs/AdminUsers';

export default {
  name: 'Admin',
  components: {
    AdminUsers
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
