var width="960", height="600";

var svg = d3.select("body").append("svg").attr("width", width).attr("height",height);

d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json") // Loading US States
    .defer(d3.csv, "/data/StateDataWithTotalSpending.csv")
    .defer(d3.csv, "/data/StatesWithId.csv")
    .await(ready); // The method 'ready' runs when all the input JSONs are loaded

var path = d3.geoPath();

//Function that runs when the data is loaded
function ready(error, us, spending, statesWithId) {
  if (error) throw error;
    
    var abbreviatedName = {};
    statesWithId.forEach(function(d,i){
      abbreviatedName[d.name] = d.abbreviation;
    });


  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path);

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))); 

  svg.append("g")
    .attr("class", "states")
    .selectAll("text")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("text")
    .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dx", function (d) { return d.properties.dx || "0"; })
    .attr("dy", function (d) { return d.properties.dy || "0.20em"; })
    .text(function (d) { 
    console.log(abbreviatedName[d.properties.name])
    return abbreviatedName[d.properties.name]; })
    .attr('font-size','8 pt')
    .attr("text-anchor","middle")
    .style('fill', 'darkOrange');
 };

