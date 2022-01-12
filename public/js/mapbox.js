mapboxgl.accessToken =
  "pk.eyJ1IjoiYWdhcndhbHBhd2FuIiwiYSI6ImNreTR3eW4yNDAzb2Uydm5veHFkeWoxdjAifQ.i5eKK6RE-MdO2dWlFAGMog";
const option = {
  enableHighAccuracy: true,
};
let cordinate = [];
let map;
let mapMarkers = [];
let latitude, longitude;
navigator.geolocation.getCurrentPosition(loadmap, loadmap2, Option);
function loadmap(position) {
  if (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    showmap(latitude, longitude);
  }
}
function loadmap2() {
  latitude = 25.590834781444045;
  longitude = 85.140929062726;
  showmap(latitude, longitude);
}

function showmap(latitude, longitude) {
  map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/agarwalpawan/cky5u0h2o8u0314l5co951z2d", // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 13, // starting zoom
  });
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    })
  );
  map.on("click", (e) => {
    const { lng, lat } = e.lngLat;
    console.log(lng, lat);
    setMarker([lng, lat]);
  });
}

function setMarker(cords) {
  mapMarkers.forEach((marker) => marker.remove());
  mapMarkers = [];
  const el = document.createElement("div");
  el.className = "marker";

  // Add marker
  const marker = new mapboxgl.Marker({
    id: "marker",
    element: el,
    anchor: "bottom",
  })
    .setLngLat(cords)
    .addTo(map);
  mapMarkers.push(marker);
  cordinate = cords;
}
