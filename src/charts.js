const chartWidth = Math.round(window.innerWidth * 0.3),
    chartHeight = Math.round(window.innerHeight * 0.3);
const padWidth = Math.round(window.innerWidth * 0.05);

const margin = ({top: 10, right: 10, bottom: 20, left: 40});
var barChart = d3.select("#bar-chart")
    .style('padding', padWidth)
    .append("svg")
    .attr('width', chartWidth)
    .attr('height', chartHeight);

barChart.append('g').attr('id', 'totals');
barChart.append('g').attr('id', 'bars');
barChart.append('g').attr('id', 'totals-lines');
barChart.append('g').attr('id', 'x-axis');
barChart.append('g').attr('id', 'y-axis');

barColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
    "#bcbd22", "#17becf"];

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
        .domain(currentUSData.map(d => d.hcci_hl_cat))
        .range([chartHeight - margin.bottom, margin.top])
        .paddingInner(0.2);

    x = d3.scaleLinear()
        .domain([0, d3.max(spending, d => +d.spend_pm)])
        .range([margin.left, chartWidth - margin.right]);

    if (state != null) {
        console.log(currentStateData);
        barChart.select('#bars')
            .selectAll('rect')
            .data(currentStateData)
            .join('rect')
            .transition().duration(slideDuration)
            .attr('x', x(0))
            .attr('y', d => y(d.hcci_hl_cat))
            .attr('width', d => x(d.spend_pm) - x(0))
            .attr('height', y.bandwidth())
            .style('fill', barColors[0])
            .style('stroke', 'white');
    }

    barChart.select('#totals')
        .selectAll('rect')
        .data(currentUSData)
        .join('rect')
        .transition().duration(slideDuration)
        .attr('x', x(0))
        .attr('y', d => y(d.hcci_hl_cat))
        .attr('width', d => x(d.spend_pm) - x(0))
        .attr('height', y.bandwidth())
        .style('fill', '#dddddd')
        .style('opacity', 0.5)
        .style('stroke', 'white');

    barChart.select('#totals-lines')
        .selectAll('line')
        .data(currentUSData)
        .join('line')
        .transition().duration(slideDuration)
        .attr('x1', d => x(d.spend_pm))
        .attr('y1', d => y(d.hcci_hl_cat))
        .attr('x2', d => x(d.spend_pm))
        .attr('y2', d => y(d.hcci_hl_cat) + y.bandwidth())
        .style('stroke', '#1C1C1C')
        .style('stroke-width', '3px')
        .style('stroke-linecap', 'round');

    barChart.select('#x-axis')
        .attr('transform', `translate(0, ${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(x));

    barChart.select('#y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))

    // console.log(window.loaded);
}