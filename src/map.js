var width="960", height="600";

var svg = d3.select("body").append("svg").attr("width", width).attr("height",height);

d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json") // Loading US States
    //.defer(d3.csv, "/data/StateDataWithTotalSpending.csv")
    .defer(d3.csv, "/data/temp.csv")
    .defer(d3.csv, "/data/StatesWithId.csv")
    .await(ready); // The method 'ready' runs when all the input JSONs are loaded

var path = d3.geoPath();

//Function that runs when the data is loaded
function ready(error, us, spending, statesWithId) {
  if (error) throw error;
    
    // US map data has full names for the state. 
    // So, creating a key-value map mapping the full name with the abbreviated name of the states.

    var abbreviatedName = {};
    statesWithId.forEach(function(d){
      abbreviatedName[d.name] = d.abbreviation;
    });

    var totalSpending = {}; // An empty object for holding dataset
    spending.forEach(function(d) {
    totalSpending[d.state] = d.spend_pm; // Storing the total spending for each state
    });

    var heatmapColors = d3.scaleThreshold()
    .domain([3000,3500, 4000, 4500, 5000, 5500, 6000, 6500])
    .range(["fbe9e7", "#ffccbc", "#ffab91", "#ff8a65", "#ff7043", "#ff5722", "#e64a19", "bf360C", "933a16"]);

    function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
		return "<h4>"+n+"</h4><table>"+
			"<tr><td>Total Spending</td><td>"+d+"</td></tr>"+
			"</table>";
	}

    //draws the tooltips
    var tooltip = d3.select(".chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
   
    svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .attr("stroke", "white")
    .style("fill", function(d) { 
        stateName = abbreviatedName[d.properties.name]
        return heatmapColors(totalSpending[stateName]); })
   // Placeholder for on hover
   ;
     

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
    .text(function (d) { return abbreviatedName[d.properties.name]; })
    .attr('font-size','8 pt')
    .attr("text-anchor","middle")
    .style('fill', 'black');
 };

