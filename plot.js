var filename = "USMassShootings.csv";
var file2 = "";

var rows 

d3.csv(filename, function(error, data){
    if(error) return console.warn(error);
});

function unpack(rows, index) {
    return rows.map(function(row) {
      return row[key];
    });
  }



var data =[{
    values: unpack(rows, "LOCATIONTYPE"),
    labels: [rows[key]],
    type: "pie"
}];

Plotly.newPlot('graph', data);



//   // Submit Button handler
//   function handleSubmit() {
//     // Prevent the page from refreshing
//     Plotly.d3.event.preventDefault();
  
//     // Select the input value from the form
//     var stock = Plotly.d3.select("#stockInput").node().value;
//     console.log(stock);
  
//     // clear the input value
//     Plotly.d3.select("#stockInput").node().value = "";
  
//     // Build the plot with the new stock
//     buildPlot(stock);
//   }
  
//   function buildPlot(stock) {
//     var apiKey = "ab_Q1a7WWSzaWfYUxAyU";
  
  
//     Plotly.d3.json(url, function(error, response) {
  
//       if (error) return console.warn(error);
  
      // Grab values from the response json object to build the plots
    //   var name = response.dataset.name;
    //   var stock = response.dataset.dataset_code;
    //   var startDate = response.dataset.start_date;
    //   var endDate = response.dataset.end_date;
    //   var dates = unpack(response.dataset.data, 0);
    //   var closingPrices = unpack(response.dataset.data, 4);
  
    //   var trace1 = {
    //     type: "scatter",
    //     mode: "lines",
    //     name: name,
    //     x: dates,
    //     y: closingPrices,
    //     line: {
    //       color: "#17BECF"
    //     }
    //   };
  
    //   var data = [trace1];
  
//       var layout = {
//         title: `${stock} closing prices`,
//         xaxis: {
//           range: [startDate, endDate],
//           type: "date"
//         },
//         yaxis: {
//           autorange: true,
//           type: "linear"
//         }
//       };
  
//       Plotly.newPlot("plot", data, layout);
  
//     });
//   }
  
//   // Add event listener for submit button
//   Plotly.d3.select("#submit").on("click", handleSubmit);
  
