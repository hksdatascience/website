(function(){
  var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse,
      bisectDate = d3.bisector(function(d) { return d.date; }).left,
      formatValue = d3.format(",.2f"),
      formatCurrency = function(d) { return "$" + formatValue(d); };

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  var svg = d3.select("#chart-container-tesla").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("../data/Tesla_Stock.csv", function(data) {

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.close = +d.close;
    });

    data.sort(function(a, b) {
      return a.date - b.date;
    });

    x.domain([data[0].date, data[data.length - 1].date]);
    y.domain(d3.extent(data, function(d) { return d.close; }));

    //This code creates the x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    //This code creates the y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    //This code creates the actual line
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    //This code creates the mouseover display
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    //This code creates the little circle
    focus.append("circle")
        .attr("r", 4.5);

    //This code creates the text that goes outside the circle
    focus.append("text")
        .attr("x", 12)
        .attr("dy", ".35em");


    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
      focus.select("text").text(formatCurrency(d.close));
    }

    svg.append("text")
          .attr("x", 550)             
          .attr("y", 400)
          .attr("text-anchor", "middle")  
          .style("font-size", "30px") 
          .text("Tesla");
  });
})();
