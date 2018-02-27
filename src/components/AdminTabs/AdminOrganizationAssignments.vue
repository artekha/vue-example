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
            <label for="userEmail">User</label>
            <md-select id="userEmail" v-model="organizationAssignment.userEmail">
              <md-option
                v-for="(user, index) in usersCopy"
                :value="user.email"
                :key="index"
                @click.native="changeUser(organizationAssignment, user)"
              >{{user.email}}</md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="organizationName">Organization</label>
            <md-select id="organizationName" v-model="organizationAssignment.organizationName">
              <md-option
                v-for="(organization, index) in organizationsCopy"
                :value="organization.name"
                :key="index"
                @click.native="changeOrganization(organizationAssignment, organization)"
              >{{organization.name}}</md-option>
            </md-select>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog(true)">{{isNew ? 'Create' : 'Update'}}</md-button>
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
      organizationsCopy: null,
      usersCopy: null,
      tableProps: {
        dataext: [],
        columns: null,
        hasControls: true,
        allowCreation: true,
        disableSearch: true,
        pagination: {
          size: 50
        },
      },
      tableColumns: [
        {name: 'id', displayName: 'ID', visible: true, type:'number', isEditable:false},
        {name: 'organizationName', displayName: 'Organization', visible: true, type:'string', isEditable:false},
        {name: 'userEmail', displayName: 'User email', visible: true, type:'string', isEditable:false},

      ],
    }
  },
  validations: {
  },
  computed: {
    ...mapGetters([
      'organizationAssignments',
      'organizations',
      'users',
    ])
  },
  methods: {
    changeUser(organizationAssignment, user) {
      organizationAssignment.user = Object.assign({}, user);
      organizationAssignment.userId = user.id;
    },
    changeOrganization(organizationAssignment, organization) {
      organizationAssignment.organization = Object.assign({}, organization);
      organizationAssignment.organizationId = organization.id;
    },
    getOrganizationAssignments() {
      this.$store.dispatch('getOrganizationAssignments')
        .then(() => {
          const customOrganizationAssignments = this.organizationAssignments.map(organizationAssignment => {
            const organizationName = organizationAssignment.organization ? organizationAssignment.organization.name : null;
            const userEmail = organizationAssignment.user ? organizationAssignment.user.email : null;
            const organizationAssignmentCopy = {
              id: organizationAssignment.id,
              organization: organizationAssignment.organization,
              organizationName: organizationName,
              user: organizationAssignment.user,
              userId: organizationAssignment.userId,
              userEmail: userEmail,
              organizationId: organizationAssignment.organizationId
            };
            return organizationAssignmentCopy;
          });
          this.tableProps.dataext = [];
          this.$nextTick(() => {
            this.tableProps.dataext = customOrganizationAssignments;
          });
          this.$store.dispatch('getOrganizations')
            .then(() => {
              this.organizationsCopy = JSON.parse(JSON.stringify(this.organizations));
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

        this.organizationAssignment = row;
      } else {
        this.isNew = true;
        this.organizationAssignment = {
          organization: null,
          organizationName: null,
          user: null,
          userId: null,
          userEmail: null,
          organizationId: null
        };
      }
      this.$refs.dialog.open();
    },
    closeDialog(isSaved) {
      if (isSaved) {
        const actionName = this.isNew ? 'createOrganizationAssignment' : 'updateOrganizationAssignment';
        const organizationAssignmentForRequest = {
          organization: this.organizationAssignment.organization ? Object.assign({}, this.organizationAssignment.organization) : null,
          user: this.organizationAssignment.user ? Object.assign({}, this.organizationAssignment.user) : null,
          userId: this.organizationAssignment.user ? this.organizationAssignment.user.id : null,
          organizationId: this.organizationAssignment.organization ? this.organizationAssignment.organization.id : null
        };
        if (this.organizationAssignment.id) {
          organizationAssignmentForRequest.id = this.organizationAssignment.id;
        }

        this.$store.dispatch(actionName, organizationAssignmentForRequest)
          .then(() => {
            this.getOrganizationAssignments();
          });
      }
      this.$refs.dialog.close();
      this.organizationAssignment = null;
    },
    openConfirmDialog(row) {
      this.organizationAssignment = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteOrganizationAssignment', this.organizationAssignment)
          .then(() => {
            this.getOrganizationAssignments();
          });
      }
      this.$refs.confirmDialog.close();
    },
  },
  mounted() {
    this.tableProps.columns = this.tableColumns;
    this.getOrganizationAssignments();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
