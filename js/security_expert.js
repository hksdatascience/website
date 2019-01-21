var WIDTH = 600, HEIGHT = 200;

var ROW_HEIGHT = 25, LABEL_WIDTH = 50, MARGIN_TOP = 25;

var sizeFn = absoluteSize;

var entries = null;

var buttons = d3.select("#canvas-svg").append("div").style("margin-bottom", "10px");

var showCounts = buttons.append("span").attr("class", "btn btn-primary").text("Counts").on("click", function() {

    showCounts.classed("btn-primary", true);
    sizeFn = absoluteSize;
    render();
});


var svg = d3.select("#canvas-svg").append("svg").attr({
    width: WIDTH + 20,
    height: HEIGHT
});

var maleScale = d3.scale.linear(), femaleScale = d3.scale.linear(), maleAxis = d3.svg.axis().orient("top").tickSize(-HEIGHT, 0, 0).scale(maleScale), femaleAxis = d3.svg.axis().orient("top").tickSize(-HEIGHT, 0, 0).scale(femaleScale), maleAxisG = svg.append("g").attr("class", "axis").attr("transform", "translate(" + (LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2) + "," + (MARGIN_TOP - 1) + ")"), femaleAxisG = svg.append("g").attr("class", "axis").attr("transform", "translate(" + (LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2) + "," + (MARGIN_TOP - 1) + ")");

svg.append("text").text("SAFETY").attr({
    "y": MARGIN_TOP - 10,
    "dx": 2
});

svg.append("text").text("Human_Drives").attr({
    x: LABEL_WIDTH,
    y: MARGIN_TOP + 14,
    fill: "#1f77b4"
});

svg.append("text").text("AVs").attr({
    x: WIDTH,
    y: MARGIN_TOP + 14,
    fill: "#ff7f0e",
    "text-anchor": "end"
});

var COLNAMES = [ "Timestamp", "1 type", "2 safety"];
var GENDER = COLNAMES[1], AGE = COLNAMES[2];

var drawD3Document = function(data) {
    data = cleanup(data);
    var nest = d3.nest().key(function(d) {
        return d[AGE];
        // year = d[SINCE].split('/')[1]
        // if (!year) return 'N/A'
        // else if(year.length == 2) { year = '20' + year }
        // else if(year.length != 4) { return '?' }
        // return year
    }).rollup(function(d) {
        return d.length;
    }).sortKeys(function(a, b) {
        return d3.ascending(parseInt(a), parseInt(b));
    }).key(function(d) {
        return d[GENDER];
    }).rollup(function(d) {
        return d.length;
    });
    entries = nest.entries(data).map(function(d) {
        output = {
            label: d.key
        };
        for (var i = 0; i < d.values.length; i++) {
            output[d.values[i].key] = d.values[i].values;
        }
        output.Human_Drive = output.Human_Drive || 0;
        output.AV = output.AV || 0;

        return output;
    });

    render();
};

function render() {
    var row = svg.selectAll("g.row").data(entries);
    row.enter().append("g").classed("row", true).attr({
        transform: function(d, i) {
            return "translate(" + (LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2) + "," + (MARGIN_TOP + i * ROW_HEIGHT) + ")";
        }
    }).call(function(row) {
        row.append("text").attr({
            "dx": 10,
            "class": "label",
            fill: "#333",
            transform: " translate(" + (-(WIDTH - LABEL_WIDTH) / 2 - LABEL_WIDTH) + "," + ROW_HEIGHT + ") scale(1)"
        });
        row.append("rect").attr({
            "class": "Human_Drive",
            fill: "#1f77b4",
            height: ROW_HEIGHT - .30
        });
        row.append("rect").attr({
            "class": "AV",
            fill: "#ff7f0e",
            height: ROW_HEIGHT - .30
        });
    }).call(sizeFn, entries);
    row.select(".label").text(function(d) {
        return d.label;
    });
    row.transition().call(sizeFn, entries);
    maleAxisG.transition().call(maleAxis);
    femaleAxisG.transition().call(femaleAxis);
}


function absoluteSize(row, entries) {
    var max = d3.max(entries, function(d) {
        return Math.max(d.AV, d.Human_Drive);
    });
    femaleScale.domain([ 0, max ]).range([ 0, (WIDTH - LABEL_WIDTH) / 2 ]);
    maleScale.domain([ 0, max ]).range([ 0, -(WIDTH - LABEL_WIDTH) / 2 ]);
    femaleAxis.ticks(10).tickFormat(null);
    maleAxis.ticks(10).tickFormat(null);
    row.select(".Human_Drive").attr({
        width: function(d) {
            return maleScale(0) - maleScale(d.Human_Drive);
        },
        x: function(d) {
            return maleScale(d.Human_Drive);
        }
    });
    row.select(".AV").attr({
        width: function(d) {
            return femaleScale(d.AV) - femaleScale(0);
        },
        x: function(d) {
            return femaleScale(0);
        }
    });
}

function cleanup(data) {
    data = data.filter(function(d) {
        var gender = d[GENDER];
        var age = d[AGE];
        return (gender == "Human_Drive" || gender == "AV") && parseInt(age).toString() == age;
    });
    //data.forEach(function(d) {});
    return data;
}
var credits = d3.select("#canvas-svg").append("div").style('width', WIDTH + 40 + 'px');

credits.append("div").html('Source: <a href="http://www.visualisingdata.com/index.php/2013/03/1578-responses-to-the-first-data-visualisation-census/">Data Visualization Census 2013</a>');

d3.csv("../data/security_expert.csv")
    .get(function(error, data) {
        drawD3Document(data)
});