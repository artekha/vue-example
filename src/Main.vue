<template>
  <div>
    <navbar />
    <gantt />
    <wb-map />
    <data-table />
  </div>
</template>
<style>
</style>
<script>
import navbar from 'components/navbar';
import gantt from 'components/gantt';
import dataTable from 'components/dataTable';
import wbMap from 'components/wbMap';

export default {
  name: 'Main',
  components: {
    navbar,
    gantt,
    dataTable,
    wbMap,
  },
  data: function () {
    return {
    };
  },
  created() {
  },
  methods: {
   
  },
};
</script>
