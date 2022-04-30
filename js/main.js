        mapboxgl.accessToken = 
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        projection: 'albers',
        zoom: 3, // starting zoom
        center: [-100, 40] // starting center
    });  
    
async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-rates.geojson');
    let CovidRates = await response.json();

map.on('load', function loadingData() {
    map.addSource('CovidRates', {
        type: 'geojson',
        data: CovidRates
    });

    map.addLayer({
        'id': 'CovidRates-layer',
        'type': 'fill',
    'source': 'CovidRates',
    'paint': {
        'fill-color': [
        'step',
            ['get', 'rates'],
            '#FFEDA0',   // stop_output_0
            30,          // stop_input_0
            '#FED976',   // stop_output_1
            60,          // stop_input_1
            '#FEB24C',   // stop_output_2
            90,          // stop_input_2
            '#FD8D3C',   // stop_output_3
            120,         // stop_input_3
            '#FC4E2A',   // stop_output_4
            140,         // stop_input_4
            '#E31A1C',   // stop_output_5
        ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.7,    
    }
});

const layers = [
    '0-30',
    '31-60',
    '61-90',
    '91-120',
    '121-140',
    '140 and more'
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70',
];

const legend = document.getElementById('legend');
    legend.innerHTML = "<b>COVID-19 Rates in US<br></b><br><br>";
    const source =
         '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
    layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
    });
legend.innerHTML += source;
});
map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['CovidRates-layer']
    });
    document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.county + " County, " + state[0].properties.state}</h3><p><strong><em>${state[0].properties.rates}</strong> </em></p>` :
        `<p>Hover over a county to see the Covid Rates in different county!</p>`;
    });
}
    geojsonFetch();        

    mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5, // starting zoom
    center: [-97, 37] // starting center
});

const grades = [1000, 40000, 80000, 120000, 400000],
    colors = ['rgb(242,240,247)', 'rgb(203,201,226)', 'rgb(158,154,200)', 'rgb(117,107,177)', 'rgb(84,39,143)']
    radii = [4, 8, 12, 16, 20];

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('covid', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.geojson'
    });

    map.addLayer({
            'id': 'covid-point',
            'type': 'circle',
            'source': 'covid',
            'minzoom': 3.5,
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [{
                            zoom: 5,
                            value: grades[0]
                        }, radii[0]],
                        [{
                            zoom: 5,
                            value: grades[1]
                        }, radii[1]],
                        [{
                            zoom: 5,
                            value: grades[2]
                        }, radii[2]], 
                        [{
                            zoom: 5,
                            value: grades[3]
                        }, radii[3]], [{
                            zoom: 5,
                            value: grades[4]
                        }, radii[4]], 
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[3], colors[3]],
                        [grades[4], colors[4]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        },
    );


    // click on tree to view magnitude in a popup
    map.on("click", "covid-point", (event) => {
  new mapboxgl.Popup()
    .setLngLat(event.features[0].geometry.coordinates)
    .setHTML(
      `<strong>COVID19 Cases:</strong> ${event.features[0].properties.cases}
      <br></br>
      <strong>Location:</strong> ${event.features[0].properties.county}, ${event.features[0].properties.state}`
    )
    .addTo(map);
});
});


// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Covid19 Cases</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');

}
// add the data source
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source;