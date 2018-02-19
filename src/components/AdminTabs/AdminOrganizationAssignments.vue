<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openDialog"
      @editEmit="openDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="dialog">
      <md-dialog-title>{{isNew ? 'Create organization assignment' : 'Update organization assignment'}}</md-dialog-title>

      <md-dialog-content>
        <form v-if="organizationAssignment">
          <md-input-container>
            <label>Organization name</label>
            <md-input v-model="organizationAssignment.name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Category</label>
            <md-input v-model="organizationAssignment.category"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog(true)">{{isNew ? 'Create organization assignment' : 'Update organization assignment'}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="confirmDialog">
      <md-dialog-title>Are you sure you would like to remove this organization assignment?</md-dialog-title>

      <md-dialog-content>
        Organization assignment will permanently be removed from the database
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
  name: 'AdminOrganizationAssignments',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      organizationAssignment: null,
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
        {name: 'name', displayName: 'Organization', visible: true, type:'string', isEditable:false},
      ],
    }
  },
  validations: {
  },
  computed: {
    ...mapGetters([
      'organizations',
    ])
  },
  methods: {
    getOrganizations() {
      this.$store.dispatch('getOrganizationAssignments')
        .then(() => {
          this.tableProps.dataext = JSON.parse(JSON.stringify(this.organizationAssignments));
        });
        .then(() => {
          const customOrganizationAssignments = this.roles.map(role => {
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

        this.organization = row;
      } else {
        this.isNew = true;
        this.organization = {
          name: null,
          category: null
        };
      }
      this.$refs.dialog.open();
    },
    closeDialog(isSaved) {
      if (isSaved) {
        const actionName = this.isNew ? 'createOrganization' : 'updateOrganization';
        this.$store.dispatch(actionName, this.organization)
          .then(() => {
            this.getOrganizations();
          });
      }
      this.$refs.dialog.close();
      this.organization = null;
    },
    openConfirmDialog(row) {
      this.organization = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteOrganization', this.organization)
          .then(() => {
            this.getOrganizations();
          });
      }
      this.$refs.confirmDialog.close();
    },
  },
  mounted() {
    this.tableProps.columns = this.tableColumns;
    this.getOrganizations();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
