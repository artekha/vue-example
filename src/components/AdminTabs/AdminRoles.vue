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
            <label>Name</label>
            <md-input v-model="role.Name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Category</label>
            <md-input v-model="role.Category"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Image</label>
            <md-input v-model="role.image"></md-input>
          </md-input-container>
          <md-input-container>
            <label>URL</label>
            <md-input v-model="role.url"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Algorithm ID</label>
            <md-input v-model="role.algorithmId"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog(true)">{{isNew ? 'Create role' : 'Update role'}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="confirmDialog">
      <md-dialog-title>Are you sure you would like to remove this role?</md-dialog-title>

      <md-dialog-content>
        Role will permanently be removed from the database
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeConfirmDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeConfirmDialog(true)">Delete role</md-button>
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
      'roles'
    ])
  },
  methods: {
    getRoles() {
      this.$store.dispatch('getRoles')
        .then(() => {
          const customRoles = this.roles.map(role => {
            const appName = role.app ? role.app.Name : null;
            const userEmail = role.user ? role.user.email : null;
            const roleCopy = {
              id: role.id,
              appName: appName,
              userEmail: userEmail,
              role: role.role
            }
            return roleCopy;
          });
          this.tableProps.dataext = customRoles;
        });
    },
    openDialog(row) {
      if (row) {
        this.isNew = false;
        this.role = Object.assign({}, row);
      } else {
        this.isNew = true;
        this.role = {
          Name: null,
          Category: null,
          image: null,
          url: null,
          algorithmId: null
        };
      }
      this.$refs.dialog.open();
    },
    closeDialog(isSaved) {
      if (isSaved) {
        const actionName = this.isNew ? 'createApp' : 'updateApp';
        this.$store.dispatch(actionName, this.app)
          .then(() => {
            this.getApps();
          });
      }
      this.$refs.dialog.close();
      this.app = null;
    },
    openConfirmDialog(row) {
      this.app = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteApp', this.app)
          .then(() => {
            this.getApps();
          })
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
