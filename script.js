var bounds =  [[-98, 42.5], [-89, 51]];  // minnesota boundary
var regex = /\B(?=(\d{3})+(?!\d))/g // thousand separator
const limit = 1000; // threshold

// mapbox
fetch("data/cities.json").then(
    respone => respone.json()).then(data =>{

        const getPopulationSize = size =>{

            if (size <= 10000){
            return "grey";
        }
        else if(size <= 20000){
        return "yellow";
    }
    else if (size <= 50000){
        return "blue";
    }
     
      else return "red";
    }

    var description = "";
    
     for(i = 0; i < 50; i++){
        const{lng, lat, population, city, zips} = data[i]

        if(population >= limit){
         description = "City: "  +  city + "<br>" + "Zip code: " + getZip(zips) + "<br>" + "Population:" + population.toString().replace(regex, ","); // thousand seperator regex
        console.log(description);

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
   
    mapboxgl.accessToken = ACCESS_TOKEN.key
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-94.636230, 46.392410],
            maxBounds: bounds,
            zoom : 5
        
            
        });
	 
    
	map.addControl(new mapboxgl.NavigationControl());
 
 

    // draw minnesota boundary shape and fill it with color
    map.on('load', function () {
        // Add a data source containing GeoJSON data.
        map.addSource('minnesota', {
        'type': 'geojson',
        'data': {
        'type': 'Feature',
        'geometry': {
        'type': 'Polygon',
        // These coordinates outline Minnesota.
        'coordinates': coordinates }}});
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
 
         
map.getCanvas().style.cursor = 'default';


// if multiple zips exist (is string if multiple exists) then just return first zip (first 5 characters)
 function getZip(num){
      if(typeof(num) === 'number'){
        console.log("Is number")
        return num; // one zip
     }
     else {
     console.log("Is string")
     return num.substring(0, 5) + " (+)"; // multiple zips

     }
    }