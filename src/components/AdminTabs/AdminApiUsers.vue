<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openDialog"
      @editEmit="openDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="dialog">
      <md-dialog-title>{{isNew ? 'Create wb algorithm user' : 'Update wb algorithm user'}}</md-dialog-title>

      <md-dialog-content>
        <form v-if="user">
          <md-input-container>
            <label>Name</label>
            <md-input v-model="user.name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Auth0 Client Id</label>
            <md-input v-model="user.auth0ClientId"></md-input>
          </md-input-container>
          <div>
            <md-switch id="userIsAdmin" v-model="user.isAdmin">Is Admin</md-switch>
          </div>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog(true)">{{isNew ? 'Create' : 'Update'}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="confirmDialog">
      <md-dialog-title>Are you sure you would like to remove this wb algorithm user?</md-dialog-title>

      <md-dialog-content>
        WB algorithm user will permanently be removed from the database
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
  name: 'AdminApiUsers',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      user: null,
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
        {name: 'name', displayName: 'Name', visible: true, type:'string', isEditable:false},
        {name: 'auth0ClientId', displayName: 'Auth 0 Client ID', visible: true, type:'string', isEditable:false},
        {name: 'isAdmin', displayName: 'Is Admin', visible: true, type:'string', isEditable:false},
      ],
    }
  },
  validations: {
  },
  computed: {
    ...mapGetters([
      'WBAlgorithmUsers',
    ])
  },
  methods: {
    getWBAlgorithmUsers() {
      this.$store.dispatch('getWBAlgorithmUsers')
        .then(() => {
          this.tableProps.dataext = JSON.parse(JSON.stringify(this.WBAlgorithmUsers));
        });
    },
    openDialog(row) {
      if (row) {
        this.isNew = false;

        this.user = row;
      } else {
        this.isNew = true;
        this.user = {
          name: null,
          auth0ClientId: null,
          isAdmin: false
        };
      }
      this.$refs.dialog.open();
    },
    closeDialog(isSaved) {
      if (isSaved) {
        const actionName = this.isNew ? 'createWBAlgorithmUser' : 'updateWBAlgorithmUser';
        this.$store.dispatch(actionName, this.user)
          .then(() => {
            this.getWBAlgorithmUsers();
          });
      }
      this.$refs.dialog.close();
      this.user = null;
    },
    openConfirmDialog(row) {
      this.user = row;
      this.$refs.confirmDialog.open();
    },
    closeConfirmDialog(isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('deleteWBAlgorithmUser', this.user)
          .then(() => {
            this.getWBAlgorithmUsers();
          });
      }
      this.$refs.confirmDialog.close();
    },
  },
  mounted() {
    this.tableProps.columns = this.tableColumns;
    this.getWBAlgorithmUsers();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
