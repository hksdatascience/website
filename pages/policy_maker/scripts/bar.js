var innerHtml = $('#canvas-svg').html();

$('#canvas-svg').html(innerHtml);

var loadingSelectAll = true;

function drawChart(chartData, currentFilters) {
  $('#canvas-svg').html(innerHtml);
  
  var seriesDataMap = {};
  
  var COLOR_COUNT = 5;
  var colors = [];
  
  var colorIndex = 0;
  for (var i = 0; i < Object.keys(chartData[0]).length; i++) {
    if (config.yAxis.indexOf(Object.keys(chartData[0])[i]) !== -1) {
      var color = config["color" + ((colorIndex % COLOR_COUNT) + 1)];
      colors.push(color);
      seriesDataMap[Object.keys(chartData[0])[i]] = {
        color: color,
        name: Object.keys(chartData[0])[i],
        data: []
      };
      colorIndex++;
    }
  }
  
  var yAxisTypeMap = {};
  var yAxisType = "";
  
  var count = 0;
  chartData.forEach(function(d) {
    for (var i = 0; i < Object.keys(d).length; i++) {
      if (config.yAxis.indexOf(Object.keys(d)[i]) !== -1) {
        var yAxis = Object.keys(d)[i];
        if (typeof(d[yAxis]) === 'string' && d[yAxis].indexOf("$") !== -1) {
          yAxisTypeMap[yAxis] = "$";
          yAxisType = "$";
        } else {
          yAxisTypeMap[yAxis] = "";
        }
        if (typeof(d[yAxis]) === 'string' && d[yAxis]) {
          seriesDataMap[yAxis].data.push({x: count,
            y: +d[yAxis].replace("$", "").replace(/,/g, "")});
        } else {
          seriesDataMap[yAxis].data.push({x: count,
            y: +d[yAxis]
          });
        }
      }
    }
    count++;
  });
  
  var seriesData = [];
  for (var k in seriesDataMap) {
    var darray = seriesDataMap[k].data;
    seriesData.push({
      color: seriesDataMap[k].color,
      name: seriesDataMap[k].name,
      data: darray
    })
  }
  
  var margin = {top: 20, left: 20, bottom: 20, right: 20};
  var width = config.width, height = config.height;
  
  // adjust height
  if (config.title !== '') {
    $("#canvas-svg .title").show();
    $("#canvas-svg .title").html(config.title);
    height -= $("#canvas-svg .title").height() - 10;
  }
  
  var graph = new Rickshaw.Graph( {
  	element: $('#canvas-svg').find('.chart-area')[0],
  	width: width - margin.left - margin.right,
  	height: height - margin.top - margin.bottom,
  	min: "auto",
  	renderer: 'bar',
  	series: seriesData
  } );
  
  graph.render();
  
  var commaFormat = d3.format("0,000");
  
  var hoverDetail = new Rickshaw.Graph.HoverDetail( {
  	graph: graph,
  	formatter: function(series, x, y) {
  	  var content;
  	  if (yAxisTypeMap[series.name] === "$") {
  		  content = series.name + ": $" + commaFormat(y);
  	  } else {
  	    content = series.name + ": " + commaFormat(y);
  	  }
  		return content;
  	}
  } );
  
  var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  	graph: graph
  } );
  
  var axes = new Rickshaw.Graph.Axis.Time( {
  	graph: graph
  } );
  
  function yFormat(n) {
    if (yAxisType === "$") {
      return Rickshaw.Fixtures.Number.formatKMBT(n);
    } else {
      return Rickshaw.Fixtures.Number.formatKMBT(n);
    }
  }
  
  var yAxis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      orientation: 'left',
      tickFormat: yFormat,
      element: $('#canvas-svg').find('.y_axis')[0]
  });
  yAxis.render();
  
  var format = function(n) {
    if (chartData[n]) {
      var axisLabel = chartData[n][config.xAxis].toString();
      if (axisLabel && axisLabel.length < 12) {
        return axisLabel;
      } else {
        return axisLabel.substring(0, 12) + ' ...';
      }
    } else {
      return "";
    }
  }
  
  var xAxis = new Rickshaw.Graph.Axis.X( {
  	graph: graph,
  	orientation: 'bottom',
  	element: $('#canvas-svg').find('.x_axis')[0],
  	pixelsPerTick: 100,
  	tickFormat: format
  } );
  xAxis.render();
  
  axes.render();
  
  // append label
  
  var xAxisBBox = d3.select("#canvas-svg")
        .select(".x_axis")
        .select('g.x_ticks_d3').select('path.domain').node().getBBox();
  
  d3.select("#canvas-svg").select(".x_axis").append("div")
      .attr("class", "xAxisLabel")
      .style("width", (xAxisBBox.width) + "px")
      .style("top", (25) + "px")
      .text(config.xAxisLabel);
  
  d3.select("#canvas-svg").select(".y_axis").append("div")
      .attr("class", "yAxisLabel")
      .html(config.yAxisLabel);
  
  // fix x_axis svg width
  var x_axis_svg = d3.select("#canvas-svg").select(".x_axis").select("svg");
  x_axis_svg.attr("width", x_axis_svg.select("g.x_ticks_d3").node().getBBox().width + 40);
  
  // fix up title
  $("#canvas-svg .title").width($("#canvas-svg .chart_container").width());
  
  // display filter
  if (config.filter) {
    var filterValues = [];
    for (var i = 0; i < data.length; i++) {
      if (filterValues.indexOf(data[i][config.filter]) === -1) {
        filterValues.push(data[i][config.filter]);
      }
    }
    
    $('#canvas-svg .filter').show();
    
    for (var i = 0; i < filterValues.length; i++) {
      var selStr = "selected='selected'";
      if (currentFilters && currentFilters.indexOf(filterValues[i]) === -1 &&
          currentFilters.length !== filterValues.length) {
        selStr = "";
      }
      $('#canvas-svg .multiselect').append($("<option value='" + filterValues[i]
          + "' " + selStr + ">" + filterValues[i] + "</option>"));
    }
    
    $('#canvas-svg .multiselect').multiselect({
      enableFiltering: true,
      filterBehavior: 'value',
      enableCaseInsensitiveFiltering: true,
      includeSelectAllOption: true,
      templates: {
        filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
        filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="fa fa-times"></i></button></span>'
      },
      onSelectAll: function() {
        if (!loadingSelectAll) {
          var selectedOptions = $('#canvas-svg .multiselect option:selected');
          var selectedValues = [];
          for (var i = 0; i < selectedOptions.length; i++) {
            selectedValues.push($(selectedOptions[i]).attr("value"));
          }
          
          var filData = [];
          for (var i = 0; i < data.length; i++) {
            if (selectedValues.indexOf(data[i][config.filter]) !== -1) {
              filData.push(data[i]);
            }
          }
          
          if (selectedValues.length === 0) {
            filData = data;
          }
          
          if (selectedValues.length !== currentFilters.length) {
            drawChart(filData, selectedValues);
          }
        } else {
          loadingSelectAll = false;
        }
      },
      onChange: function(option, checked, select) {
        var selectedOptions = $('#canvas-svg .multiselect option:selected');
        var selectedValues = [];
        for (var i = 0; i < selectedOptions.length; i++) {
          selectedValues.push($(selectedOptions[i]).attr("value"));
        }
        
        var filData = [];
        for (var i = 0; i < data.length; i++) {
          if (selectedValues.indexOf(data[i][config.filter]) !== -1) {
            filData.push(data[i]);
          }
        }
        
        if (selectedValues.length === 0) {
          filData = data;
        }
        
        drawChart(filData, selectedValues);
      }
    });
    
    $('#canvas-svg .btn-group button.multiselect').addClass('btn-xs');
  }
  
  if (config.showLegend) {
    // show legends
    var lsvg = d3.select("#canvas-svg .legend").append("svg");
    
    var lsvgGroup = lsvg.append("g")
      .attr("class", "legendOrdinal");
    
    var ordinal = d3.scale.ordinal()
      .domain(Object.keys(seriesDataMap))
      .range(colors);
    
    var legendOrdinal = d3.legend.color()
      .shapePadding(10)
      .orient('vertical')
      .labelAlign('left')
      .scale(ordinal);
    
    lsvg.select("#canvas-svg .legendOrdinal")
      .call(legendOrdinal);
    
    // adjust svg size
    lsvg.attr("width", lsvgGroup.node().getBBox().width + 10);
    lsvg.attr("height", lsvgGroup.node().getBBox().height + 10);
  }
}
var config = {
  width: 600,
  height: 500,
  color1: "#0f608b",
  xAxisLabel: "Reasons",
  yAxisLabel: "Numbers",
  xAxis: "Reasons",
  yAxis: "Numbers",
  title: "Motor Vehicles is the Largest Reason Cause Death"
}

d3.csv('../data/bar.csv',function(data){
  drawChart(data);
});