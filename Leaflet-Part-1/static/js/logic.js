// URL for earthquake data JSON
const earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create the map centered around a location
const map = L.map('map').setView([0, 0], 2);

// Add the basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to determine the size of the marker based on earthquake magnitude
function getMarkerSize(magnitude) {
  return magnitude * 2;
}

// Function to determine the color based on earthquake depth
function getMarkerColor(depth) {
  // color scale
  return depth > 90 ? '#2f261a' :
         depth > 70 ? '#793537' :
         depth > 50 ? '#9c4c8d' :
         depth > 30 ? '#d2637c' :
         depth > 10 ? '#ad8272' :
                      '#eecfc9';
}

// Function to create popup content for each earthquake marker
function createPopup(feature) {
  return `<b>Location:</b> ${feature.properties.place}<br>
          <b>Magnitude:</b> ${feature.properties.mag}<br>
          <b>Depth:</b> ${feature.geometry.coordinates[2]} km`;
}

// Fetch and add earthquake data to the map
fetch(earthquakeDataUrl)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data.features, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: getMarkerSize(feature.properties.mag),
          fillColor: getMarkerColor(feature.geometry.coordinates[2]),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(createPopup(feature));
      }
    }).addTo(map);
  });

// Add legend to the map
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  const depths = [0, 10, 30, 50, 70, 90];
  const labels = [];

  // Add min & max
  div.innerHTML += '<b>Depth (km)</b><br>';

  // Loop through depths and generate a label with a colored square for each interval
  for (let i = 0; i < depths.length; i++) {
    const from = depths[i];
    const to = depths[i + 1];

    labels.push(
      '<i style="background:' + getMarkerColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML += labels.join('<br>');
  return div;
};

legend.addTo(map);

