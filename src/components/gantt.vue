<template>
  <gantt-chart
      :start="start"
      :end="end"
      @change-start="changeStart(arguments[0])"
      @change-end="changeEnd(arguments[0])"
      :resources="resources"
      :tasks="tasks"
      :markers="markers"
      :showTimeline="true"
      @drag-start="onDragStart(arguments[0])"
      @drop-end="onDrop(arguments[0])"
      @tasks-changed="tasksChanged(arguments[0])"
      :showBtns="true"
      :title="'Loskade'"
      :showControls="true"
    />
</template>
<style>
 
</style>
<script>
import WBVueGantt from 'WBVueGantt';
import moment from 'moment';

export default {
  name: 'Gantt',
  components: {
    'gantt-chart': WBVueGantt,
  },
  data: function () {
   return {
      start: moment().subtract(1, 'days').format('MM-DD-YYYY HH:mm'),
      end: moment().format('MM-DD-YYYY HH:mm'),
      resources: [
        {
          id: 0,
          name: 'SR1',
          type: 'resource',
          sub: [
            {name:'name1', id:0},
            {name:'name2', id:1}
          ]
        },
        {
          id:1,
          name:'SR2',
          type:'resource'
        }
      ],
      tasks: [],
      markers: []
    }
  },
  mounted() {
    this.tasks = [
      {
        id: 0,
        resourceId: 0,
        start: moment().subtract(23, "hours"),
        end: moment().subtract(22, "hours"),
        hasTooltip : true,
        type: 'task',
        style: {
          background: '#ccc'
        },
        configurableClass: 'vessel',
        draggable: true,
        desc: 'CAPE'
      },
      {
        id: 1,
        resourceId: 1,
        start: moment().subtract(20, "hours"),
        end: moment().subtract(12, "hours"),
        hasTooltip : false,
        type: 'task',
        style: {
          background: '#cdffa8'
        },
        configurableClass: 'vessel',
        sub: {
          brand: 'Korea A',
          product: 'swkp 150000',
        },
        draggable: true,
        icon: 'query_builder', //material icons
        fullness: '100%',
        desc: 'CAPE VENTURE VERTOM 12000T'
      }
    ];
    this.markers = [
      { date : moment().subtract(10, "hours"), colour : '#f75533' },
    ];
  },
  methods: {
    changeStart : function(val) {
      this.start = moment(val).format('MM-DD-YYYY HH:mm');
    },
    changeEnd : function(val) {
      this.end = moment(val).format('MM-DD-YYYY HH:mm');
    },
    onDragStart : function(node) {
      console.log(node);
    },
    onDrop: function(data) {
      console.log(data);
    },
    tasksChanged: function(val) {
      console.log(val);
    }
  },
};
</script>
