
var parseDate = d3.time.format("%-m/%d/%y").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;
var formatValue = d3.format(",.2f");


d3.csv('./../data/investment-data.csv', function loadCallback(error, data) {
    data.forEach(function(d) { // convert strings to numbers
        d.Investment = +d.Investment;
        d.date = +parseDate(d.date);
    });
    makeVis(data);
});


var makeVis = function(data) {
  // Common pattern for defining vis size and margins
  var margin = { top: 20, right: 20, bottom: 30, left: 60 },
      width  = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  // Add the visualization svg canvas to the vis-container <div>
  var canvas = d3.select("#chart-container-investments").append("svg")
      .attr("width",  width  + margin.left + margin.right)
      .attr("height", height + margin.top  + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.sort(function(a, b) {
    return a.date - b.date;
  });

  // Define our scales
  var colorScale = d3.scale.category10();

//  var xScale = d3.time.scale()
//      .range([0, width])
//      .domain([d3.min(data, function(c) { return d3.min(c.values, function(v) { return v.date; }); }),
//              d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.date; }); })
//              ]);


  var xScale = d3.time.scale()
      .domain([data[0].date, data[data.length - 1].date])
      .range([0, width]);

      //.domain([ d3.min(data, function(d) { return d.Date; }) - 1,
      //          d3.max(data, function(d) { return d.Date; }) + 1 ])

  var yScale = d3.scale.linear()
      .domain([ d3.min(data, function(d) { return d.Investment; }) - 1,
                d3.max(data, function(d) { return d.Investment; }) + 1 ])
      .range([height, 0]); // flip order because y-axis origin is upper LEFT

  // Define our axes
  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

  // Add x-axis to the canvas
  canvas.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")") // move axis to the bottom of the canvas
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width) // x-offset from the xAxis, move label all the way to the right
      .attr("y", -6)    // y-offset from the xAxis, moves text UPWARD!
      .style("text-anchor", "end") // right-justify text
      .text("Date");

  // Add y-axis to the canvas
  canvas.append("g")
      .attr("class", "y axis") // .orient('left') took care of axis positioning for us
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)") // although axis is rotated, text is not
      .attr("y", 15) // y-offset from yAxis, moves text to the RIGHT because it's rotated, and positive y is DOWN
      .style("text-anchor", "end")
      .text("Investment (in Millions $)");


  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  var tooltip = d3.select("#chart-container-investments").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
      var color = colorScale(d.Technology);
      var html  = d.Company + "<br/>" +
                  "<span style='color:" + color + ";'>" + d.Techology + "</span><br/>" +
                  "<b>" + d.Date + "</b> Date, <b/>" + d.Investment + "</b> Technology";

      tooltip.html(html)
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
        .transition()
          .duration(200) // ms
          .style("opacity", .9) // started as 0!

  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
      tooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!
  };

  // Add data points!
  canvas.selectAll(".dot")
    .data(data)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 5.5) // radius size, could map to another data dimension
    .attr("cx", function(d) { return xScale( d.date ); })     // x position
    .attr("cy", function(d) { return yScale( d.Investment ); })  // y position
    .style("fill", function(d) { return colorScale(d.Technology); })
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);
};