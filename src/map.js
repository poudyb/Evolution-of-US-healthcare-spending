var width="960", height="600";
var svg = d3.select("body").append("svg").attr("width", width).attr("height",height);


var path = d3.geoPath();

d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json", function(error, us) {
  if (error) throw error;

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
    .text(function (d) { return d.properties.name; })
    .attr('font-size','6.5pt')
    .attr("text-anchor","middle")
    .style('fill', 'darkOrange');
 
});

function update(h) {
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
        .attr("x", x(h))
        .text(formatDateIntoYear(h));

    //filter data set and redraw plot
    var newData = dataset.filter(function(d) {
        return d.date < h;
    })
    //drawHeatMap(newData);
}