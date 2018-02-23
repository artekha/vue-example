<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openDialog"
      @editEmit="openDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="dialog">
      <md-dialog-title>{{isNew ? 'Create algorithm organization assignment' : 'Update algorithm organization assignment'}}</md-dialog-title>

      <md-dialog-content>
        <form v-if="userOrganizationAssignment">
          <md-input-container>
            <label for="userName">API User</label>
            <md-select id="userName" v-model="userOrganizationAssignment.userName">
              <md-option
                v-for="(user, index) in usersCopy"
                :value="user.name"
                :key="index"
                @click.native="changeUser(userOrganizationAssignment, user)"
              >{{user.name}}</md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="organizationName">Organization</label>
            <md-select id="organizationName" v-model="userOrganizationAssignment.organizationName">
              <md-option
                v-for="(organization, index) in organizationsCopy"
                :value="organization.name"
                :key="index"
                @click.native="changeOrganization(userOrganizationAssignment, organization)"
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
      <md-dialog-title>Are you sure you would like to remove this algorithm user organization assignment?</md-dialog-title>

      <md-dialog-content>
        Algorithm user organization assignment will permanently be removed from the database
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
  name: 'AdminApiUserOrganizationAssignments',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      userOrganizationAssignment: null,
      usersCopy: null,
      organizationsCopy: null,
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
        {name: 'userName', displayName: 'API User', visible: true, type:'string', isEditable:false},
        {name: 'organizationName', displayName: 'Organization', visible: true, type:'string', isEditable:false},
      ],
    }
  },
  validations: {
  },
  computed: {
    ...mapGetters([
      'WBAlgorithmUserOrganizationAssignments',
      'WBAlgorithmUsers',
      'organizations'
    ])
  },
  methods: {
    changeUser(userOrganizationAssignment, user) {
      userOrganizationAssignment.wbAlgorithmUser = Object.assign({}, user);
      userOrganizationAssignment.wbAlgorithmUserId = user.id;
    },
    changeOrganization(userOrganizationAssignment, organization) {
      userOrganizationAssignment.organization = Object.assign({}, organization);
      userOrganizationAssignment.organizationId = organization.id;
    },
    getWBAlgorithmUserOrganizationAssignments() {
      this.$store.dispatch('getWBAlgorithmUserOrganizationAssignments')
        .then(() => {
          const customUserOrganizationAssignments = this.WBAlgorithmUserOrganizationAssignments.map(uaAssignement => {
            const organizationName = uaAssignement.organization ? uaAssignement.organization.name : null;
            const userName = uaAssignement.wbAlgorithmUser ? uaAssignement.wbAlgorithmUser.name : null;
            const uaAssignementCopy = {
              id: uaAssignement.id,
              organization: uaAssignement.organization,
              organizationId: uaAssignement.organizationId,
              organizationName: organizationName,
              wbAlgorithmUser: uaAssignement.wbAlgorithmUser,
              wbAlgorithmUserId: uaAssignement.wbAlgorithmUserId,
              userName: userName,
            }
            console.log(uaAssignementCopy);
            return uaAssignementCopy;
          });
          this.tableProps.dataext = [];
          this.$nextTick(() => {
            this.tableProps.dataext = customUserOrganizationAssignments;
          });
          this.$store.dispatch('getOrganizations')
            .then(() => {
              this.organizationsCopy = JSON.parse(JSON.stringify(this.organizations));
            });

          this.$store.dispatch('getWBAlgorithmUsers')
            .then(() => {
              this.usersCopy = JSON.parse(JSON.stringify(this.WBAlgorithmUsers));
            });
        });
    },
    openDialog(row) {
      if (row) {
        this.isNew = false;

        this.userOrganizationAssignment = row;
      } else {
        this.isNew = true;
        this.userOrganizationAssignment = {
          organization: null,
          organizationId: null,
          organizationName: null,
          wbAlgorithmUser: null,
          wbAlgorithmUserId: null,
          userName: null,
        };
      }
      this.$refs.dialog.open();
    },
    closeDialog(isSaved) {
      if (isSaved) {
        const userOrganizationAssignmentForRequest = {
          organization: this.userOrganizationAssignment.organization,
          organizationId: this.userOrganizationAssignment.organizationId,
          wbAlgorithmUser: this.userOrganizationAssignment.wbAlgorithmUser,
          wbAlgorithmUserId: this.userOrganizationAssignment.wbAlgorithmUserId,
        }
        if (this.userOrganizationAssignment.id) {
          userOrganizationAssignmentForRequest.id = this.userOrganizationAssignment.id;
        }
        const actionName = this.isNew ? 'createWBAlgorithmUserOrganizationAssignment' : 'updateWBAlgorithmUserOrganizationAssignment';
        this.$store.dispatch(actionName, this.userOrganizationAssignment)
          .then(() => {
            this.getWBAlgorithmUserOrganizationAssignments();
          });
      }
      this.$refs.dialog.close();
      this.userOrganizationAssignment = null;
    },
    openConfirmDialog(row) {
      this.userOrganizationAssignment = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteWBAlgorithmUserOrganizationAssignment', this.userOrganizationAssignment)
          .then(() => {
            this.getWBAlgorithmUserOrganizationAssignments();
          });
      }
      this.$refs.confirmDialog.close();
    },
  },
  mounted() {
    this.tableProps.columns = this.tableColumns;
    this.getWBAlgorithmUserOrganizationAssignments();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
