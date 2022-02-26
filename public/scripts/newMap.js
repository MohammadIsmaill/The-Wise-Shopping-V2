const mapboxClient = mapboxSdk({ accessToken: mapToken })

mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
  // center: shop.features.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
})

map.addControl(new mapboxgl.NavigationControl())

const locationExamples = document.querySelector('.location-examples')
const locationInput = document.querySelector('#location')
// const geometryInput = document.querySelector('#geometry')
const lngInput = document.querySelector('.lng')
const latInput = document.querySelector('.lat')

// const lngLat = document.querySelector('.lngLat')
const mapInfo = document.querySelector('.mapInfo')
mapInfo.style.display = 'none'
// const location = document.querySelector('.location')

const removeChilds = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild)
  }
}

const createLocation = (text, type, event) => {
  const locationLi = document.createElement('li')
  locationLi.innerHTML = `<a style = "cursor:pointer;" class="location link-secondary">${text}  </a>`
  locationLi.addEventListener(type, event)
  return locationLi
}

const reverseGeocode = async ({ lng, lat }) => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapToken}`
    )
    const data = await res.json()
    console.log(data)
    mapInfo.style.display = 'block'
    for (let feature of data.features) {
      locationExamples.appendChild(
        createLocation(feature.place_name, 'click', () => {
          locationInput.value = feature.place_name
          // geometryInput.value = feature.geometry
          console.log(feature.geometry.coordinates)
          // lat.value = feature.geometry.coordinates[1]
          const { coordinates } = feature.geometry
          lngInput.value = coordinates[0]
          latInput.value = coordinates[1]

          // lngLat.innerHTML = `Lng-Lat: <p class="text-muted">${lngInput.value} ${latInput.value}</p>`
        })
      )
    }
  } catch (e) {}
}
let marker
map.on('click', async (e) => {
  removeChilds(locationExamples)
  if (marker) marker.remove()
  lngInput.value = e.lngLat.lng
  latInput.value = e.lngLat.lat
  // lngLat.innerText += `${lngInput.value} ${latInput.value}`
  reverseGeocode(e.lngLat)
  marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map)
})
