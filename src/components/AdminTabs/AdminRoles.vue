<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openDialog"
      @editEmit="openDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="dialog">
      <md-dialog-title>{{isNew ? 'Create role' : 'Update role'}}</md-dialog-title>

      <md-dialog-content>
        <form v-if="role">
          <md-input-container>
            <label for="userEmail">User</label>
            <md-select id="userEmail" v-model="role.userEmail">
              <md-option
                v-for="(user, index) in usersCopy"
                :value="user.email"
                :key="index"
                @click.native="changeUser(role, user)"
              >{{user.email}}</md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="appName">App</label>
            <md-select id="appName" v-model="role.appName">
              <md-option
                v-for="(app, index) in appsCopy"
                :value="app.Name"
                :key="index"
                @click.native="changeApp(role, app)"
              >{{app.Name}}</md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label>Role</label>
            <md-input v-model="role.role"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog(true)">{{isNew ? 'Create' : 'Update'}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="confirmDialog">
      <md-dialog-title>Are you sure you would like to remove this role?</md-dialog-title>

      <md-dialog-content>
        Role will permanently be removed from the database
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeConfirmDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeConfirmDialog(true)">Delete</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import wbDataTable from 'WBDataTable';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AdminRoles',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      role: null,
      isNew: false,
      // rolesCopy: null,
      appsCopy: null,
      usersCopy: null,
      tableProps: {
        dataext: [],
        columns: null,
        hasControls: true,
        allowCreation: true,
        disableSearch: true,
      },
      tableColumns: [
        {name: 'id', displayName: 'ID', visible: true, type:'number', isEditable:false},
        {name: 'appName', displayName: 'App Name', visible: true, type:'string', isEditable:false},
        {name: 'userEmail', displayName: 'User email', visible: true, type:'string', isEditable:false},
        {name: 'role', displayName: 'Role', visible: true, type:'string', isEditable:false},
      ],
    }
  },
  validations: {
  },
  computed: {
    ...mapGetters([
      'roles',
      'apps',
      'users'
    ])
  },
  methods: {
    changeUser(role, user) {
      role.user = Object.assign({}, user);
    },
    changeApp(role, app) {
      role.app = Object.assign({}, app);
    },
    getRoles() {
      this.$store.dispatch('getRoles')
        .then(() => {
          const customRoles = this.roles.map(role => {
            const appName = role.app ? role.app.Name : null;
            const userEmail = role.user ? role.user.email : null;
            const roleCopy = {
              id: role.id,
              app: role.app,
              appName: appName,
              user: role.user,
              userEmail: userEmail,
              role: role.role
            }
            return roleCopy;
          });
          this.tableProps.dataext = customRoles;
          this.$store.dispatch('getApps')
            .then(() => {
              this.appsCopy = JSON.parse(JSON.stringify(this.apps));
            });

          this.$store.dispatch('getUsers')
            .then(() => {
              this.usersCopy = JSON.parse(JSON.stringify(this.users));
            });
        });
    },
    openDialog(row) {
      if (row) {
        this.isNew = false;

        this.role = row;
      } else {
        this.isNew = true;
        this.role = {
          userEmail: null,
          user: null,
          appName: null,
          app: null,
          role: null
        };
      }
      this.$refs.dialog.open();
    },
    closeDialog(isSaved) {
      if (isSaved) {
        const actionName = this.isNew ? 'createRole' : 'updateRole';
        const roleForRequest = {
          app: Object.assign({}, this.role.app),
          user: Object.assign({}, this.role.user),
          role: this.role.role
        };
        if (this.role.id) {
          roleForRequest.id = this.role.id;
        }
        this.$store.dispatch(actionName, this.app)
          .then(() => {
            this.getRoles();
          });
      }
      this.$refs.dialog.close();
      this.role = null;
    },
    openConfirmDialog(row) {
      this.role = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteRole', this.role)
          .then(() => {
            this.getRoles();
          });
      }
      this.$refs.confirmDialog.close();
    },
  },
  mounted() {
    this.tableProps.columns = this.tableColumns;
    this.getRoles();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
