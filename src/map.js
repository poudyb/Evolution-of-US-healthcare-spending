var width = 960,
    height = 600;


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("us.json", function(error, us) {
  if (error) return console.error(error);

    svg.append("path")
      .datum(topojson.mesh(us))
      .attr("d", path);
});

d3.json("us.json", function(error, us) {
  if (error) return console.error(error);

  svg.append("path")
      .datum(topojson.feature(us, us.objects.subunits))
      .attr("d", d3.geo.path().projection(d3.geo.mercator()));
});

var subunits = topojson.feature(us, us.objects.subunits);
var projection = d3.geo.mercator()
    .scale(500)
    .translate([width / 2, height / 2]);

 var path = d3.geo.path()
    .projection(projection);

svg.append("path")
    .datum(subunits)
    .attr("d", path);