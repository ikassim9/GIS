const bounds = [[-98, 42.5], [-89, 51]];  // minnesota boundary
const regex = /\B(?=(\d{3})+(?!\d))/g // thousand separator
const limit = 1000; // threshold
const base_url = window.location.href;



window.onload = function() {

    fetchData();
    mapLoad();

};



// mapbox
function fetchData(){
fetch("data/cities.json").then(
    respone => respone.json()).then(data => {

        const getPopulationSize = size => {

            if (size <= 10000) {
                return "grey";
            }
            else if (size <= 20000) {
                return "yellow";
            }
            else if (size <= 50000) {
                return "blue";
            }

            else return "red";
        }


        let description = "";

        for (i = 0; i < 50; i++) {
            const { lng, lat, population, city, zips } = data[i]

            if (population >= limit) {
                description = "City: " + city + "<br>" + "Zip code: " + getZip(zips) + "<br>" + "Population:" + population.toString().replace(regex, ","); // thousand seperator regex
                new mapboxgl.Marker({
                    draggable: false,
                    color: getPopulationSize(population)
                })

                    .setLngLat([lng, lat])
                    .setPopup(
                        new mapboxgl.Popup({
                            closeButton: false,
                            offset: 25
                        })
                            .setHTML(description)

                    )
                    .addTo(map);
            }

        }

    })

};

// draw minnesota boundary shape and fill it with color

function mapLoad() {

fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson').then(response => response.json()).then(data => {
    // console.log(data.features.find(feature => feature.properties.postal === 'MN'));
    const coordinates = data.features.find(feature => feature.properties.postal === 'MN').geometry.coordinates;

    map.on('load', () => {
        console.log('is loaded');

        map.addSource('minnesota', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': coordinates
                }
            }
        })
        map.addLayer({
            'id': 'minnesota',
            'type': 'fill',
            'source': 'minnesota', // reference the data source
            'layout': {},
            'paint': {
                'fill-color': '#0080ff', // blue color fill
                'fill-opacity': 0.5
            }
        });


        // Add a black outline around the polygon.
        map.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'minnesota',
            'layout': {},
            'paint': {
                'line-color': '#000',
                'line-width': 3
            }
        });
    });

});

}


// if multiple zips exist (is string if multiple exists) then just return first zip (first 5 characters)
function getZip(num) {
    if (typeof (num) === 'number') {
        return num; // one zip
    }
    else {
        return num.substring(0, 5) + " (+)"; // multiple zips

    }
}

mapboxgl.accessToken = 'pk.eyJ1IjoicmFuZHlnb2xkIiwiYSI6ImNsaDRlem0ydTFwNmszZW94czY2ZnRiYjYifQ.AKjbcG-TGWyWANeQQWzMgA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-94.636230, 46.392410],
    maxBounds: bounds,
    zoom: 5
});

map.addControl(new mapboxgl.NavigationControl());
map.getCanvas().style.cursor = 'default';



