var formatDateIntoYear = d3.timeFormat("%Y");

var startDate = new Date("2013"),
    endDate = new Date("2017");

var margin = {top:50, right:120, bottom:0, left:130},
    width = 900 -margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;

existingYear = null;

gfyOr2013 = val => val.getFullYear() == '2012' ? '2013' : val.getFullYear();

function drawIfDifferent(year) {
    if (year === existingYear)
        return;

    existingYear = year;
    console.log('drawing year', year)
    drawHeatMapWithYear(year);
}

var slider = d3.sliderHorizontal()
    .min(startDate)
    .max(endDate)
    .step(1000*60*60*24*365)
    .tickFormat(gfyOr2013)
    .ticks(5)
    .width(width)
    .displayValue(false)
    .on('onchange', val => {
        var year = val.getFullYear();
        var nextYear = year + 1;
        drawIfDifferent(nextYear);
    });
 
  d3.select('#slider')
    .append('svg')
    .attr('width', '100%')
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(slider);
