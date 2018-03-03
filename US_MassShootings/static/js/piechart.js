var url = ("/venue");
Plotly.d3.json(url, function(error,response){
// console.log(response)

var venue = [];
var numberOfShootings = [];  

for ( x in response){
    console.log( x + "-" + response[x])
    venue.push(x)
    numberOfShootings.push(response[x])
}

var data = [{
    values: numberOfShootings,
    labels: venue,
    type: 'pie'
  }];
  
  var layout = {
    height: 400,
    width: 500
  };
  
  Plotly.newPlot('pie', data, layout);

});