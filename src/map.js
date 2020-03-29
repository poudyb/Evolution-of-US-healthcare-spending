const width = Math.round(window.innerWidth * 0.6),
    height = Math.round(window.innerHeight * 0.75);
const slideDuration = 200, tooltipDuration = 100;
// document.currentScript.getAttribute('inputYear');

viewSize = 1000

var svg = d3.select("#us-map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + viewSize + " " + height / width * viewSize);

var currentState = null;

var promises = [
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"),
    d3.csv("data/StateData.csv"),
    d3.csv("data/StatesWithId.csv")
];

Promise.all(promises).then(ready); // The method 'ready' runs when all the input JSONs are loaded

var path = d3.geoPath();

/**
 * Ready function
 *
 * store data in window and draw first heatmap using default year as defined
 * in drawHeatMap fn
 */
function ready(allData) {
    var us = allData[0];
    var spending = allData[1];
    var statesWithId = allData[2];
    // if (error) alert('there was an error');
    window.loaded = {
        us, spending, statesWithId
    };
    drawHeatMap(us, spending, statesWithId);
    drawBarChart();
}

var heatmapColors = d3.scaleThreshold()
    .domain([3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500])
    .range(["#fbe9e7", "#ffccbc", "#ffab91", "#ff8a65", "#ff7043", "#ff5722", "#e64a19",
        "#bf360C"]);

var legendText = [">= $3K", ">= $3.5K", ">= $4k", ">= $4.5K", ">= $5K", " >= $5.5K", ">= $6K", ">= $6.5K"];

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "15")
    .style("visibility", "hidden")
    .style("background", "#eeeeee")
    .style('padding', '20px')
    .style('border', '2px solid grey')
    .style('border-radius', '5px')
    .style('font-size', '1.5em')
    .style('text-align', 'center')

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/**
 * Draw Heat Map with preloaded variables from window
 *
 * this function should be called from the slidebar with just a year and reuse
 * data that got loaded on page load in ready function
 */
function drawHeatMapWithYear(year) {
    console.log('Drawing the heatmap for the year', year);
    var {us, spending, statesWithId} = window.loaded;

    var abbreviatedName = {};
    statesWithId.forEach(function (d) {
        abbreviatedName[d.name] = d.abbreviation;
    });

    var totalSpending = {}; // An empty object for holding dataset
    var IPSpending = {};
    var OPSpending = {};
    var PHSpending = {};
    var RXSpending = {};
    spending.forEach(function (d) {
        if (d.yr == year && d.hcci_hl_cat == "Total") {
            totalSpending[d.state] = d.spend_pm; // Storing the total spending for each state
        }
        /*
        if (d.yr == year && d.hcci_hl_cat == "Inpatient") {
            IPSpending[d.state] = d.spend_pm;
        }
        if (d.yr == year && d.hcci_hl_cat == "Outpatient") {
            OPSpending[d.state] = d.spend_pm;
        }
        if (d.yr == year && d.hcci_hl_cat == "Professional Services") {
            PHSpending[d.state] = d.spend_pm;
        }
        if (d.yr == year && d.hcci_hl_cat == "Prescription Drugs") {
            RXSpending[d.state] = d.spend_pm;
        } */
    });

    svg.select("#state-background")
        .selectAll("path")
        .transition().duration(slideDuration)
        .style("fill", function (d) {
            stateName = abbreviatedName[d.properties.name];
            return heatmapColors(totalSpending[stateName]);
        })
    ;
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
        if (d.yr == inputYear && d.hcci_hl_cat == "Total") {
            totalSpending[d.state] = d.spend_pm; // Storing the total spending for each state
        }
    });

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
        .on("mouseover", function (d) {
            stateName = abbreviatedName[d.properties.name];
            var total_sp = totalSpending[stateName];
            selectedData = spending.filter(d => d.state === stateName && d.yr === existingYear);
            selectedIP = selectedData.filter(d => d.hcci_hl_cat == "Inpatient")[0].spend_pm;
            selectedOP = selectedData.filter(d => d.hcci_hl_cat == "Outpatient")[0].spend_pm;
            selectedPH = selectedData.filter(d => d.hcci_hl_cat == "Professional Services")[0].spend_pm;
            selectedRX = selectedData.filter(d => d.hcci_hl_cat == "Prescription Drugs")[0].spend_pm;
            selectedTotal = selectedData.filter(d => d.hcci_hl_cat == "Total")[0].spend_pm;
            /*console.log(ip_select);
            inpatient_selected = spending.filter(d => d.state === stateName && d.yr === inputYear && d.hcci_hl_cat == "Inpatient")[0].spend_pm;
            console.log(inpatient_selected[0].spend_pm);
            console.log(selected_state_data[0]);
            var ip_sp = selected_state_data[0].spend_pm; 
            console.log(d.properties.name + total_sp + ' & inpatient ' + ip_sp) */
            tooltip.html("<b><u>" + d.properties.name + "</b></u>"
                + "<br />" + 'Inpatient Spending: \$' + formatNumber(parseFloat(selectedIP).toFixed(0))
                + "<br />" + 'Outpatient Spending: \$' + formatNumber(parseFloat(selectedOP).toFixed(0))
                + "<br />" + 'Professional Services Spending: \$' + formatNumber(parseFloat(selectedPH).toFixed(0))
                + "<br />" + 'Prescription Drug Spending: \$' + formatNumber(parseFloat(selectedRX).toFixed(0))
                + "<hr />" +
                "<b>" + 'Total Spending per Insured Member: \$' + formatNumber(parseFloat(selectedTotal).toFixed(0))
            );
            // tooltip().title().fontDecoration("underline");
            return tooltip.transition().duration(tooltipDuration)
                .style("visibility", "visible")
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        })
        // .on("mousemove", function () {
        //     return tooltip;
        // })
        .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
        })
        // Placeholder for on-click.
        .on('click', d => {
            // alert(d.properties.name);
            currentState = abbreviatedName[d.properties.name];
            drawBarChart(inputYear, abbreviatedName[d.properties.name])
        });


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
}

var legend = svg.selectAll(".legend")
    .data(heatmapColors.domain().slice())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
        return "translate(" + "-50," + i * 20 + ")";
    });

legendOffset = 0.95;

legend.append("rect")
    .attr("x", viewSize * legendOffset)
    .attr("y", 340)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", heatmapColors);

legend.append("text")
    .data(legendText)
    .attr("x", viewSize * (legendOffset + .025))
    .attr("y", 350)
    .attr("dy", ".35em")
    .text(function (d) {
        return d;
    });

svg.append("text")
    .attr("x", viewSize * (legendOffset - 0.05))
    .attr("y", 320)
    .attr("dy", ".35em")
    .style("font-weight", "bold")
    .text("Total Spending");
    

