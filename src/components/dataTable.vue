<template>
  <wb-data-table  :dataext="data"
    :columns="columns"
    :tableName="'Locations'"
    :hasControls="true"
    :dataLength="dataLength"
    :dataList0="[
      {id: 1, name: 'abc'},
      {id: 2, name: 'efg'},
      {id: 3, name: 'xyz'}
    ]"
    v-on:paginate=""
    v-on:add_row=""
    v-on:delete_rows=""
    v-on:save_row=""
    :disableMultiSelect="false"
    :hasSelection="true"
    :hasAutoSelection="true"
    :hasFilter="true"
    :saveFilters="true"
    :saveColumnSelection="true"
    :allowCreation="true"
    :disallowEditing="false"
    :listOfOptionsForSwitch="['ladden', 'lossen']"
    :formatForDateWithTime="'YYYY-MM-DD HH:mm'"
    :customControls="[{ name: 'Custom item', icon: 'add', customClassName: 'customClassName'}]"
    :allowTooltips="true"
    :disableRowControlls="true"
  ></wb-data-table>
</template>
<style>
 
</style>
<script>
import wbDataTable from 'WBDataTable';

export default {
  name: 'dataTable',
  components: {
    wbDataTable,
  },
  data: function () {
    return {
      columns: [],
      data: [],
      dataLength: 1000,
      objectName: 'locations',
      page: {},
      organisations: []
    };
  },
  created(){
    this.columns = [
      { name: 'id', displayName: 'Id', columnClassName: 'id', visible: false, type:'number', isEditable: false, filterObjectSelection: true },
      { name: 'name', displayName: 'Name', visible: false, type:'string', isEditable: false, filterObjectSelection: true },
      { name: 'type', displayName: 'Type', visible: true, type:'string', isEditable: false, filterObjectSelection: true },
      { name: 'street', displayName: 'Street', visible: true, type:'string', isEditable: false, filterObjectSelection: true },
      { name: 'city', displayName: 'City', visible: true, type:'string', isEditable: true, filterObjectSelection: true },
      { name: 'dateWithTime', displayName: 'Date with time', visible: true, type:'dateWithTime', isEditable: true, filterObjectSelection: true },
      { name: 'dateWithTimeTwo', displayName: 'Date with time two', visible: true, type:'dateWithTime', isEditable: true, filterObjectSelection: true },
      { name: 'autocomplete', displayName: 'Autocomplete', visible: true, type:'autocomplete', isEditable: true, filterObjectSelection: true },
      { name: 'latitude', displayName: 'Latitude', visible: true, type:'number', isEditable: true, filterObjectSelection: true },
      { name: 'longitude', displayName: 'Longitude', visible: true, type:'number', isEditable: true, filterObjectSelection: true },
      { name: 'isAvailable', displayName: 'Is Available', visible: true, type:'boolean', isEditable: true },
      { name: 'organisationId', displayName: 'Organisation', visible: true, type:'number', isEditable: true, isObjectMultiSelection: true, objectList:'dataList0', filterObjectSelection: false },
    ];

    var self = this;
    this.columns.forEach(function(column, index) {
      if (column.type == 'autocomplete')
      {
        self.columns[index].fetchAutoComplete = function (query) {
          return new Promise(function(resolve, reject) {
            var data = [{name: 'admin'}, {name: 'admin2'}, {name: 'test'}, {name: 'test2'}, {name: 'test3'}, {name: 'test4'}];

            var filtered = data.filter(function(item) {
                if (item.name.match( query.q ) )
                  return item;
            });

            resolve(filtered);
          });
        };
      }
    });
  },
  mounted() {
    this.data = [
      {"id":"1","name":"Test 1","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"test","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":null},
      {"id":"2","name":"Test 2","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"admin","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"3","name":"Test 3","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"4","name":"Test 4","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"5","name":"Test 5","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"6","name":"Test 6","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"7","name":"Test 7","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"8","name":"Test 8","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"9","name":"Test 9","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"10","name":"Test 10","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"11","name":"Test 11","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"12","name":"Test 12","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"13","name":"Test 13","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"14","name":"Test 14","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"15","name":"Test 15","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"16","name":"Test 16","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"17","name":"Test 17","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"18","name":"Test 18","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"19","name":"Test 19","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"20","name":"Test 20","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"21","name":"Test 21","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"22","name":"Test 22","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]},
      {"id":"23","name":"Test 23","type":"Test object","street":"abc street", "dateWithTime":"", "dateWithTimeTwo":"", "autocomplete":"","city":"Capital city","latitude":"40.7128","longitude":"74.0059", "isAvailable": true, "organisationId":[1, 2]}
    ];
  }
};
</script>
