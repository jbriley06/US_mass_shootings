
function buildMap() {

  /* data route */
  var url = "/incidents";

  d3.json(url, function(error, response) {
    
    console.log(response[0]);

    // Create a map object
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5
    });

    // Add a tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoibWFsYWNoaXJhIiwiYSI6ImNqZGhrMXV6ejBjM2wyd28yY3VtajJvcTYifQ.hwWYJ006t5ZinWceLhnf9Q"
    ).addTo(myMap);

    for (var i = 0; i < response.length; i++) {
      var incident = response[i];
      L.marker(incident.location)
        .bindPopup("<h2>" + incident.name + "</h2> <hr> <h3>" + incident.place + "</h3> \
                    <h3>" + incident.year + "</h3> <h3>"+ incident.victims + " victims" + "</h3>")
        .addTo(myMap);
    }

  })

    // "place": incident["LOCATION"],
    // "state": incident["STATE"],
    // "year": incident["YEAR"],            
    // "name": incident["CASE"],
    // "victims" : incident["TOTALVICTIMS"],
    // "location": [incident["LATITUDE"], incident["LONGITUDE"]]

}

buildMap();