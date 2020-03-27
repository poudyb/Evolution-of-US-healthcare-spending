var width = "960", height = "600";
// document.currentScript.getAttribute('inputYear');

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

var currentState = null

d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json") // Loading US States
    .defer(d3.csv, "data/StateDataWithTotalSpending.csv")
    //.defer(d3.csv, "/data/temp.csv")
    .defer(d3.csv, "data/StatesWithId.csv")
    .await(ready); // The method 'ready' runs when all the input JSONs are loaded

var path = d3.geoPath();

/**
 * Ready function
 *
 * store data in window and draw first heatmap using default year as defined
 * in drawHeatMap fn
 */
function ready(error, us, spending, statesWithId) {
    if (error) alert('there was an error');
    window.loaded = {
        us, spending, statesWithId
    };
    drawHeatMap(us, spending, statesWithId)
}


var heatmapColors = d3.scaleThreshold()
    .domain([3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500])
    .range(["fbe9e7", "#ffccbc", "#ffab91", "#ff8a65", "#ff7043", "#ff5722", "#e64a19", "bf360C", "933a16"]);


/**
 * Draw Heat Map with preloaded variables from window
 *
 * this function should be called from the slidebar with just a year and reuse
 * data that got loaded on page load in ready function
 */
function drawHeatMapWithYear(year) {
    var {us, spending, statesWithId} = window.loaded;

    var totalSpending = {}; // An empty object for holding dataset
    spending.forEach(function (d) {
        if (d.yr == year) {
            totalSpending[d.state] = d.spend_pm; // Storing the total spending for each state
        }
    });

    svg.select("#states")
        .selectAll("path")
        .style("fill", function (d) {
            stateName = abbreviatedName[d.properties.name];
            return heatmapColors(totalSpending[stateName]);
        });
    return drawHeatMap(us, spending, statesWithId, year);
}

//Function that runs when the data is loaded
function drawHeatMap(us, spending, statesWithId, inputYear = '2013') {
    // US map data has full names for the state. 
    // So, creating a key-value map mapping the full name with the abbreviated name of the states.

    var abbreviatedName = {};
    statesWithId.forEach(function (d) {
        abbreviatedName[d.name] = d.abbreviation;
    });

    var totalSpending = {}; // An empty object for holding dataset
    spending.forEach(function (d) {
        if (d.yr == inputYear) {
            totalSpending[d.state] = d.spend_pm; // Storing the total spending for each state
        }
    });
    console.log(totalSpending)

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "15")
        .style("visibility", "hidden")
        .style("background", "#eee")
        .style('padding', '20px')
        .style('border', '2px solid grey')
        .style('border-radius', '5px')
        .style('font-size', '1.5em')
        .style('text-align', 'center')

    svg.append("g")
        .attr("class", "states")
        .attr("id", "state-background")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke", "white")
        .style("fill", function (d) {
            stateName = abbreviatedName[d.properties.name];
            return heatmapColors(totalSpending[stateName]);
        })
        .attr("class", "incident")

        // Placeholder for on hover
        .on("mouseover", function (d) {
            tooltip.html(d.properties.name + "<br />" + 'Total Spending: ' + parseFloat(totalSpending[abbreviatedName[d.properties.name]]).toFixed(2));
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
        })
        .on('click', d => {
            alert(d.properties.name);
        })
    ;


    svg.append("g")
        .attr("class", "state-labels")
        .selectAll("text")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("text")
        .attr("transform", function (d) {
            return "translate(" + path.centroid(d) + ")";
        })
        .attr("dx", function (d) {
            return d.properties.dx || "0";
        })
        .attr("dy", function (d) {
            return d.properties.dy || "0.20em";
        })
        .text(function (d) {
            return abbreviatedName[d.properties.name];
        })
        .attr('font-size', '8 pt')
        .attr("text-anchor", "middle")
        .style('pointer-events', 'none')
        .style('fill', 'black');
};