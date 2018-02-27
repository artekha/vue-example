<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openDialog"
      @editEmit="openDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="dialog">
      <md-dialog-title>{{isNew ? 'Create app' : 'Update app'}}</md-dialog-title>

      <md-dialog-content>
        <form v-if="app">
          <md-input-container>
            <label>Name</label>
            <md-input v-model="app.Name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Category</label>
            <md-input v-model="app.Category"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Image</label>
            <md-input v-model="app.image"></md-input>
          </md-input-container>
          <md-input-container>
            <label>URL</label>
            <md-input v-model="app.url"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Algorithm ID</label>
            <md-input v-model="app.algorithmId"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog(true)">{{isNew ? 'Create' : 'Update'}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="confirmDialog">
      <md-dialog-title>Are you sure you would like to remove this app?</md-dialog-title>

      <md-dialog-content>
        App will permanently be removed from the database
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
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'AdminApps',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      app: null,
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
        {name: 'Name', displayName: 'App Name', visible: true, type:'string', isEditable:false},
        {name: 'Category', displayName: 'App Category', visible: true, type:'string', isEditable:false},
        {name: 'image', displayName: 'Image', visible: true, type:'string', isEditable:false},
        {name: 'url', displayName: 'Url', visible: true, type:'string', isEditable:false},
      ],
    }
  },
  validations: {
  },
  computed: {
    ...mapGetters([
      'apps'
    ])
  },
  methods: {
    getApps() {
      this.$store.dispatch('getApps')
        .then(() => {
          this.tableProps.dataext = [];
          this.$nextTick(() => {
            this.tableProps.dataext = JSON.parse(JSON.stringify(this.apps));
          });
        })
    },
    openDialog(row) {
      if (row) {
        this.isNew = false;
        this.app = Object.assign({}, row);
      } else {
        this.isNew = true;
        this.app = {
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
    this.getApps();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
