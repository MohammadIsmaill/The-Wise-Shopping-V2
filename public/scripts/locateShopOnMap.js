'use strict'

const mapboxClient = mapboxSdk({ accessToken: mapToken })

mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
  center: shop.features.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
})

map.addControl(new mapboxgl.NavigationControl())
const marker = new mapboxgl.Marker()
  .setLngLat(shop.features.geometry.coordinates)
  .addTo(map)
