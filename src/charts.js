const chartWidth = Math.round(window.innerWidth * 0.3),
    chartHeight = Math.round(window.innerHeight * 0.3);
const padWidth = Math.round(window.innerWidth * 0.05);
year = 2013;

state = "Washington";


var barChart = d3.select("#bar-chart")
    .style('padding', padWidth)
    .append("svg")
    .attr('width', chartWidth)
    .attr('height', chartHeight);

// barChart.append("rect")
//     .style('fill', 'blue')
//     .style('stroke', 'white')
//     .attr('width', chartWidth)
//     .attr('height', chartHeight);


function drawBarChart(year = '2013', state = null) {
    var {us, spending, statesWithId} = window.loaded;

    const currentStateData = spending.filter(d => d.state === state && d.yr === year);
    const currentUSData = spending.filter(d => d.state === "US" && d.yr === year);

    y = d3.scaleBand()
        .domain(currentStateData.map(d => d.hcci_hl_cat))
        .range([chartHeight, 0]); // Try flipping this to [0, height] and see the effect on the bars below.

    x = d3.scaleLinear()
        .domain([0, d3.max(currentStateData, d => d.spend_pm)])
        .range([0, width]);

    if (state != null) {
        barChart.append('g')
            .attr('id', 'bars')
            .selectAll('rect')
            .data(currentStateData)
            .enter().append('rect')
            .attr('x', 0)
            .attr('y', d => y(d.hcci_hl_cat))
            .attr('width', d => x(d.spend_pm))
            .attr('height', y.bandwidth())
            .style('fill', 'blue')
            .style('stroke', 'white');
    }

    barChart.append('g')
        .attr('id', 'totals')
        .selectAll('rect')
        .data(currentUSData)
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', d => y(d.hcci_hl_cat))
        .attr('width', d => x(d.spend_pm))
        .attr('height', y.bandwidth())
        .style('fill', '#dddddd')
        .style('opacity', 0.5)
        .style('stroke', 'white');

    // console.log(window.loaded);
}