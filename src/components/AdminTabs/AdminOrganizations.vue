<template>
  <div class="admin-tab">
    <wb-datatable
      v-bind="tableProps"
      @addEmit="openDialog"
      @editEmit="openDialog"
      @deleteEmit="openConfirmDialog"
    ></wb-datatable>
    <md-dialog ref="dialog">
      <md-dialog-title>{{isNew ? 'Create organization' : 'Update organization'}}</md-dialog-title>

      <md-dialog-content>
        <form v-if="organization">
          <md-input-container>
            <label>Organization name</label>
            <md-input v-model="organization.name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Category</label>
            <md-input v-model="organization.category"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog(true)">{{isNew ? 'Create organization' : 'Update organization'}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="confirmDialog">
      <md-dialog-title>Are you sure you would like to remove this organization?</md-dialog-title>

      <md-dialog-content>
        Organization will permanently be removed from the database
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeConfirmDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeConfirmDialog(true)">Delete organization</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import wbDataTable from 'WBDataTable';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AdminOrganizations',
  components: {
    'wb-datatable': wbDataTable
  },
  data() {
    return {
      organization: null,
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
      this.$store.dispatch('getOrganizations')
        .then(() => {
          this.tableProps.dataext = JSON.parse(JSON.stringify(this.organizations));
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
