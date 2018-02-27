<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openDialog"
      @editEmit="openDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="dialog">
      <md-dialog-title>{{isNew ? 'Create algorithm app assignment' : 'Update algorithm app assignment'}}</md-dialog-title>

      <md-dialog-content>
        <form v-if="userAppAssignment">
          <md-input-container>
            <label for="userName">API User</label>
            <md-select id="userName" v-model="userAppAssignment.userName">
              <md-option
                v-for="(user, index) in usersCopy"
                :value="user.name"
                :key="index"
                @click.native="changeUser(userAppAssignment, user)"
              >{{user.name}}</md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="appName">App</label>
            <md-select id="appName" v-model="userAppAssignment.appName">
              <md-option
                v-for="(app, index) in appsCopy"
                :value="app.Name"
                :key="index"
                @click.native="changeApp(userAppAssignment, app)"
              >{{app.Name}}</md-option>
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
      <md-dialog-title>Are you sure you would like to remove this algorithm user app assignment?</md-dialog-title>

      <md-dialog-content>
        Algorithm user app assignment will permanently be removed from the database
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
  name: 'AdminApiUserAppAssignments',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      userAppAssignment: null,
      usersCopy: null,
      appsCopy: null,
      isNew: false,
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
        {name: 'userName', displayName: 'API User', visible: true, type:'string', isEditable:false},
        {name: 'appName', displayName: 'App', visible: true, type:'string', isEditable:false},
      ],
    }
  },
  validations: {
  },
  computed: {
    ...mapGetters([
      'WBAlgorithmUserAppAssignments',
      'WBAlgorithmUsers',
      'apps'
    ])
  },
  methods: {
    changeUser(userAppAssignment, user) {
      userAppAssignment.wbAlgorithmUser = Object.assign({}, user);
      userAppAssignment.wbAlgorithmUserId = user.id;
    },
    changeApp(userAppAssignment, app) {
      userAppAssignment.app = Object.assign({}, app);
      userAppAssignment.appId = app.id;
    },
    getWBAlgorithmUserAppAssignments() {
      this.$store.dispatch('getWBAlgorithmUserAppAssignments')
        .then(() => {
          const customUserAppAssignments = this.WBAlgorithmUserAppAssignments.map(uaAssignement => {
            const appName = uaAssignement.app ? uaAssignement.app.Name : null;
            const userName = uaAssignement.wbAlgorithmUser ? uaAssignement.wbAlgorithmUser.name : null;
            const uaAssignementCopy = {
              id: uaAssignement.id,
              app: uaAssignement.app,
              appId: uaAssignement.appId,
              appName: appName,
              wbAlgorithmUser: uaAssignement.wbAlgorithmUser,
              wbAlgorithmUserId: uaAssignement.wbAlgorithmUserId,
              userName: userName,
            }
            return uaAssignementCopy;
          });
          this.tableProps.dataext = [];
          this.$nextTick(() => {
            this.tableProps.dataext = customUserAppAssignments;
          });
          this.$store.dispatch('getApps')
            .then(() => {
              this.appsCopy = JSON.parse(JSON.stringify(this.apps));
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

        this.userAppAssignment = row;
      } else {
        this.isNew = true;
        this.userAppAssignment = {
          app: null,
          appId: null,
          appName: null,
          wbAlgorithmUser: null,
          wbAlgorithmUserId: null,
          userName: null,
        };
      }
      this.$refs.dialog.open();
    },
    closeDialog(isSaved) {
      if (isSaved) {
        const userAppAssignmentForRequest = {
          app: this.userAppAssignment.app,
          appId: this.userAppAssignment.appId,
          wbAlgorithmUser: this.userAppAssignment.wbAlgorithmUser,
          wbAlgorithmUserId: this.userAppAssignment.wbAlgorithmUserId,
        }
        if (this.userAppAssignment.id) {
          userAppAssignmentForRequest.id = this.userAppAssignment.id;
        }
        const actionName = this.isNew ? 'createWBAlgorithmUserAppAssignment' : 'updateWBAlgorithmUserAppAssignment';
        this.$store.dispatch(actionName, this.userAppAssignment)
          .then(() => {
            this.getWBAlgorithmUserAppAssignments();
          });
      }
      this.$refs.dialog.close();
      this.userAppAssignment = null;
    },
    openConfirmDialog(row) {
      this.userAppAssignment = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteWBAlgorithmUserAppAssignment', this.userAppAssignment)
          .then(() => {
            this.getWBAlgorithmUserAppAssignments();
          });
      }
      this.$refs.confirmDialog.close();
    },
  },
  mounted() {
    this.tableProps.columns = this.tableColumns;
    this.getWBAlgorithmUserAppAssignments();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
