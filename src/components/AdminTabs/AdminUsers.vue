<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openCreateDialog"
      @editEmit="openUpdateDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="createDialog">
      <md-dialog-title>Create user</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-input-container>
            <label>Name</label>
            <md-input v-model="newUser.user.name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Email</label>
            <md-input v-model="newUser.user.email"></md-input>
          </md-input-container>
          <md-input-container>
            <label for="selectedApp">Select an application</label>
            <md-select name="selectedApp" id="selectedApp" v-model="newUser.appId">
              <md-option @click.native="selectRoleByAppId(app.id)" v-for="app in apps" :value="app.id">{{app.Name}}</md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="role">Set a role</label>
            <md-select name="role" id="role" v-model="newUser.role">
              <md-option v-if="roles" v-for="role in roles" :value="role">{{role}}</md-option>
            </md-select>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeCreateDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeCreateDialog(true)">Create user</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="updateDialog">
      <md-dialog-title>Update User</md-dialog-title>

      <md-dialog-content>
        <form v-if="user">
          <md-input-container>
            <label>User name</label>
            <md-input v-model="user.username"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Email</label>
            <md-input v-model="user.email"></md-input>
          </md-input-container>
          <div>
            <md-switch id="userAccessMS" v-model="user.hasAccessToMicroServices">Has Access To Microservices</md-switch>
          </div>
          <div>
            <md-switch id="userAccessAPI" v-model="user.hasAccessToAPIs">Has Access To APIs</md-switch>
          </div>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeUpdateDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeUpdateDialog(true)">Update user</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="confirmDialog">
      <md-dialog-title>Are you sure you would like to remove this user?</md-dialog-title>

      <md-dialog-content>
        User will permanently be removed from the database
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeConfirmDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeConfirmDialog(true)">Delete user</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import wbDataTable from 'WBDataTable';
import { mapActions, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'AdminUsers',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      user: null,
      newUser: {
        user: {
          name: null,
          email: null
        },
        appId: null,
        role: null
      },
      tableProps: {
        dataext: [],
        columns: null,
        hasControls: true,
        allowCreation: true,
        disableSearch: true,
      },
      tableColumns: [
        {name: 'id', displayName: 'ID', visible: true, type:'string', isEditable:false},
        {name: 'name', displayName: 'Name', visible: true, type:'string', isEditable:false},
        {name: 'username', displayName: 'Username', visible: true, type:'string', isEditable:false},
        {name: 'email', displayName: 'Email', visible: true, type:'string', isEditable:false},
        {name: 'microservices', displayName: 'Microservices', visible: true, type:'string', isEditable:false},
        {name: 'apis', displayName: 'APIs', visible: true, type:'string', isEditable:false},
        {name: 'status', displayName: 'Status', visible: true, type:'string', isEditable:false},
      ],
    }
  },
  validations: {
    newUser: {
      user: {
        name: { required },
        email: { required },
      },
      appId: { required },
      role: { required }
    }
  },
  computed: {
    ...mapGetters([
      'userStatuses',
      'users',
      'apps',
      'roles'
    ])
  },
  methods: {
    selectRoleByAppId(id) {
      this.$store.dispatch('getRoles', {
        id
      })
    },
    getUsers() {
      this.$store.dispatch('getUserStatuses')
        .then(() => {
          return this.$store.dispatch('getUsers')
        })
        .then(() => {
          this.$store.commit('START_REQUEST');
          const clonedUsers = JSON.parse(JSON.stringify(this.users));
          this.tableProps.dataext = clonedUsers;
          this.$store.commit('FINISH_REQUEST');

          this.$store.dispatch('getApps')
        });
    },
    openCreateDialog() {
      this.$refs.createDialog.open();
    },
    closeCreateDialog(isSaved) {
      const u = this.newUser;
      if (isSaved) {

        if (u.user.name !== null && u.user.name.length > 0
          && u.user.email !== null && u.user.email.length > 0
          && u.appId !== null
          && u.role !== null) {
            this.$store.dispatch('createUserFromApp', {
              user: u
            }).then(() => this.getUsers());
            this.$refs.createDialog.close();
          }
      } else {
        this.$refs.createDialog.close();
      }
    },
    openUpdateDialog(row, columns) {
      if (row) {
        this.user = Object.assign({}, row);
      } else {
        this.user = null;
      }
      this.$refs.updateDialog.open();
    },
    closeUpdateDialog(isSaved) {
      if (isSaved) {
        this.$store.dispatch('updateUser', this.user)
          .then(() => {
            this.getUsers();
          });
      }
      this.$refs.updateDialog.close();
      this.user = null;
    },
    openConfirmDialog(row) {
      this.user = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteUser', this.user)
          .then(() => {
            this.getUsers();
          })
      }
      this.$refs.confirmDialog.close();
    },
  },
  mounted() {
    this.tableProps.columns = this.tableColumns;
    this.getUsers();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
