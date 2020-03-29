var dataTime = d3.range(0, 5).map(function (d) {
    return new Date(2013 + d, 1, 1);
});

var existingYear = '2013';

function drawIfDifferent(year) {
    if (year === existingYear)
        return;

    existingYear = year;
    drawHeatMapWithYear(year);
}

var sliderTime = d3.sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(Math.round(width * 0.85))
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(2013, 1, 1))
    .on('onchange', val => {
        d3.select('p#value-time').text('Year: ' + d3.timeFormat('%Y')(val));
        var year = `${d3.timeFormat('%Y')(sliderTime.value())}`;
        drawIfDifferent(year);
        drawBarChart(year, currentState);
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', width)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text('Year: ' + d3.timeFormat('%Y')(sliderTime.value()));
inputYear = `${d3.timeFormat('%Y')(sliderTime.value())}`;