
var url = ("/incidents_per_year");
Plotly.d3.json(url, function(error,response){
    console.log(response)
    //var year = response[0]
    //var frequency = response[1];
      var year = [];
      var frequency = []; 
      
    for ( x in response){
        console.log( x + "-" + response[x])
        year.push(x)
        frequency.push(response[x]*7)
    }
    var trace1 = {
        x: year,
        type: "scatter",
        mode: 'markers',
        
        marker: {
            size: frequency,
            color: year
        }       
        
        
      };        

    var data = [trace1]       
    
    var layout = {
        title: "Number of Mass Shootings in the US from 1982 - 2018",
        xaxis: {
            type: "date",
            title:"Year"
        },
        yaxis: {
            autorange: true,
            type: "linear",
            title: ""
        }
    };
    Plotly.newPlot('linePlot', data,layout);      
    
});

var url2 = ("/victims_per_year");
Plotly.d3.json(url2, function(error,response){
// console.log(response)

var year = [];
var fatalities = [];  
var injured = []; 
for ( x in response){

    var each = response[x]
    
    // console.log( x + "-" + response[x])
    year.push(each.Year)
    fatalities.push(each.Fatalities)
    injured.push(each.Injured)
}


var trace1 = {
    x: year,
    y:fatalities,
    type: "bar",
    name: "Fatalities"           
    
  };  
  
var trace2 = {
    x: year,
    y: injured,
    type:"bar",
    name: "Injured"
}

var data = [ trace1, trace2]       

var layout = {barmode: 'group',
    title: "Number of Mass Shooting Victims in the US from 1982 - 2018",
    xaxis: {
        type: "date",
        title: "Year"
    },
    yaxis: {
        type:"linear",
        title: "Victims",
        autorange: true,
        
    }}

Plotly.newPlot('lineplot1', data ,layout);    
});


function buildMap() {

  /* data route */
  var url = "/incidents";

  d3.json(url, function(error, response) {
    
    console.log(response[0]);

    var incidentMarkers = [];
    var mental_illness = [];
    var assault_weapon = [];
    var weapons_legal = [];
    var src

    //Parse through json object to extract pop-up data
    for (var i = 0; i < response.length; i++) {

      console.log(response[i].source )
      incidentMarkers.push(
      L.marker(response[i].location)
      .bindPopup("<h2>" + response[i].name + "</h2> <hr> <h3>" + response[i].place + "</h3> \
                  <h3>" + response[i].year + "</h3> <h3>"+ response[i].victims + " victims" + "</h3>\
                  <a href=" + response[i].source +" target='_blank'>source</a>")
      )

      if (response[i].mental_issues == "Yes"){
        
        mental_illness.push(
          L.marker(response[i].location)
          .bindPopup("<h2>" + response[i].name + "</h2> <hr> <h3>" + response[i].place + "</h3> \
                      <h3>" + response[i].year + "</h3> <h3>"+ response[i].victims + " victims" + "</h3>\
                      <a href=" + response[i].source +" target='_blank'>source</a>")
        )}

        if (response[i].assault_rifle == "Yes"){
        
          assault_weapon.push(
            L.marker(response[i].location)
            .bindPopup("<h2>" + response[i].name + "</h2> <hr> <h3>" + response[i].place + "</h3> \
                        <h3>" + response[i].year + "</h3> <h3>"+ response[i].victims + " victims" + "</h3>\
                        <a href=" + response[i].source +" target='_blank'>source</a>")
        )}

        if (response[i].weapons == "Yes"){
        
          weapons_legal.push(
            L.marker(response[i].location)
            .bindPopup("<h2>" + response[i].name + "</h2> <hr> <h3>" + response[i].place + "</h3> \
                        <h3>" + response[i].year + "</h3> <h3>"+ response[i].victims + " victims" + "</h3>\
                        <a href=" + response[i].source +" target='_blank'>source</a>")
        )}
    }

    //create layer with all incidents
    var incident = L.layerGroup(incidentMarkers);

    //create layer with only incidents with prior mental illness
    var mentalillness = L.layerGroup(mental_illness);

    //create layer with only incidents with assault weapons
    var assault = L.layerGroup(assault_weapon);

    //create layer with only incidents with legally obtained weapons
    var legal_weapons = L.layerGroup(weapons_legal);

    // Create a map object
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5
    });

      // Add a tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoibWFsYWNoaXJhIiwiYSI6ImNqZGhrMXV6ejBjM2wyd28yY3VtajJvcTYifQ.hwWYJ006t5ZinWceLhnf9Q"
    ).addTo(myMap);

    // Define variables for our base layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFsYWNoaXJhIiwiYSI6ImNqZGhrMXV6ejBjM2wyd28yY3VtajJvcTYifQ.hwWYJ006t5ZinWceLhnf9Q"
    );

    // Create a baseMaps object
    var baseMaps = {
      "Street Map": streetmap
    };

    // Create a baseMaps object
    var baseMaps = {
    };

    // Create an overlay object
    var overlayMaps = {
      "All incidents": incident,
      "Prior mental illness":mentalillness,
      "Assault weapon used" : assault,
      "Weapons obtained legally" : legal_weapons
    };

    // Pass our map layers into our layer control
    // Add the layer control to the map
    var control = L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    myMap.on("overlayadd overlayremove", function (event) {

      var layer = event.layer,
            layerCategory;

      if (event.type === "overlayadd" && event.layer === mentalillness){
          myMap.removeLayer(incident);
          myMap.removeLayer(assault);
          myMap.removeLayer(legal_weapons);
          control._update();
        }
      else if (event.type === "overlayadd" && event.layer === assault){
          myMap.removeLayer(incident);
          myMap.removeLayer(mentalillness);
          myMap.removeLayer(legal_weapons);
          control._update();
        }
      else if (event.type === "overlayadd" && event.layer === legal_weapons){
          myMap.removeLayer(incident);
          myMap.removeLayer(mentalillness);
          myMap.removeLayer(assault);
          control._update();
        }
      else if (event.type === "overlayadd" && event.layer === incident){
          myMap.removeLayer(legal_weapons);
          myMap.removeLayer(mentalillness);
          myMap.removeLayer(assault);
          control._update();
        }
    })



  })

}

buildMap();


            
var map = L.map('choroplethmap').setView([37.8, -96], 4);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3ViaGFzdXNoaSIsImEiOiJjamRoank0YTAwZWE0MnhvMmw5eWd1OWU1In0.t6Bzt2OPJXvtCMb2I-UaTA', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.light'
  }).addTo(map);
            
var geojson = L.geoJson(statesData).addTo(map);

function getColor(d) {
return d > 100 ? '#d73027':
    d > 75  ? '#fc8d59' :
    d > 50  ? '#fee090' :
    d > 25  ? '#e0f3f8' :
    d > 10   ? '#91bfdb' :
    d > 5   ? '#4575b4' :
    
            '#FFEDA0';
    }

function style(feature) {
  return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
  }

L.geoJson(statesData, {style: style}).addTo(map);

function highlightFeature(e) {
var layer = e.target;

layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
});

if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
}
}
        
var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();
        
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Firearms Provisions By State</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' provisions in place'
        : 'Hover over a state');
};

info.addTo(map);
        
        
function highlightFeature(e) {
    
    info.update(e.target.feature.properties);
}

function resetHighlight(e) {
    
    info.update();
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [5, 10, 25, 50, 75, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
          
