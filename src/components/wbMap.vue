<template>
  <wb-vue-map
    class="map-container"
    id="planning"
    :center="[51.912159, 4.429604]"
    :zoom="8"
    :markers="markers"
    :decorators="decorators"
    :bounds="bounds"
    :circles="circles"
  ></wb-vue-map>
</template>
<style>
  .map-container {
    width: 100%;
    height: 400px;
  }
</style>
<script>
import wbVueMap from 'wb-vue-map';
require('../uiassets/leafletawesomemarkers.js');
require('../uiassets/leafletawesomemarkers.css');

export default {
  name: 'wbMap',
  components: {
    wbVueMap,
  },
  data: function () {
    return {
      markers: [],
      decorators: [],
      circles: [],
      bounds: [],
    };
  },
  created(){
  },
  mounted: function () {
    // marker
    let marker1 = {
      position: {
        lng: 4.429604,
        lat: 51.912159,
      },
      visible: true,
      draggable: false,
      routeId: 'id1',
      orderId: 'id2',
      icon: L.AwesomeMarkers.icon({
        markerColor: 'orange',
        text: 'txt1',
        icon: 'building-o',
        prefix: 'fa',
        className: 'awesome-marker dragover-data-id1 drop-data-id2',
      }),
      popup: 'popup',
      onClick: (selectedMarker) => {
        console.log(selectedMarker);
      },
    };
    let marker2 = {
      position: {
        lng: 4.429604,
        lat: 52.912159,
      },
      visible: true,
      draggable: false,
      routeId: 'id1',
      orderId: 'id2',
      icon: L.AwesomeMarkers.icon({
        markerColor: 'orange',
        text: 'txt2',
        icon: 'building-o',
        prefix: 'fa',
        className: 'awesome-marker dragover-data-id1 drop-data-id2',
      }),
      popup: 'popup',
      onClick: (selectedMarker) => {
        console.log(selectedMarker);
      },
    };
    this.markers.push(marker1);
    this.markers.push(marker2);

    // decorators(line)
    let decorator = {
      locations: [[51.912159, 4.429604], [52.912159, 4.429604]],
      color: 'orange',
      isAnimated: true,
      options: {
        offset: '51%',
        repeat: '50%',
        symbol: L.Symbol.arrowHead({
          pixelSize: 15,
          polygon: false,
          pathOptions: { stroke: true, color: 'orange' },
        }),
      },
    };
    this.decorators.push(decorator);

    // circles
    let circle = {
      position: {
        lng: 4.429604,
        lat: 51.912159,
      },
      popup: 'circlePopup',
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 15000,
    };
    this.circles.push(circle);
    this.bounds = L.latLngBounds(this.markers.map(o => o.position));
  },
};
</script>
