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