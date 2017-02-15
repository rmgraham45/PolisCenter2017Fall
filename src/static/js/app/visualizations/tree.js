//************************************************************
// initialize Global Variables and call methods to plot visual
//************************************************************

var tooltip = d3.select("body").append("div"); // declare the tooltip div
var color = ['#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#9b59b6'],
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  pad = 20,
  nest = d3.nest()
  .key(function (d) {
    return d.name;
  })
  .key(function (d) {
    return d.data2;
  })
  .rollup(function (d) {
    return d3.sum(d, function (d) {
      return d.data1;
    });
  });

function ZoomableTreeMap() {
  //This is to get width and height from parentdiv.So graph will be placed inside parent div
  var width = document.getElementById("visualization").offsetWidth - margin.left - margin.right,
    height = document.getElementById("visualization").offsetHeight - margin.top - margin.bottom,
    x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([0, height]),
    root,
    node;
  //************************************************************
  // Create treemap layout 
  //************************************************************

  var treemap = d3.treemap()
    .paddingInner(0)
    .round(true)
    .size([width, height]);
  d3.xml("data/religiontree_tree.xml", function (data) {
    data = [].map.call(data.querySelectorAll("data"), function (religion) {
      return {
        name: religion.getAttribute("label"),
        data1: +religion.getAttribute("data1"),
        data2: +religion.getAttribute("data2")
      };
    });
    var max = d3.max(data, function (d) {
      return d.data2
    });
    var legendData = getLegendData(max, 5);
    node = root = data;
    var root = d3.hierarchy({
        values: nest.entries(data)
      }, function (d) {
        return d.values;
      })
      .sum(function (d) {
        return d.value;
      }).sort(function (a, b) {
        return b.value - a.value;
      });

    treemap(root);
    d3.select("#visualization")
      .selectAll(".node").remove();

    var node = d3.select("#visualization")
      .selectAll(".node")
      .data(root.leaves())
      .enter().append("div")
      .attr("class", "node")
      .style("left", function (d) {
        return d.x0 + "px";
      })
      .style("top", function (d) {
        return d.y0 + "px";
      })
      .style("width", function (d) {
        return d.x1 - d.x0 + "px";
      })
      .style("height", function (d) {
        return d.y1 - d.y0 + "px";
      })
      .style("background", function (d) {
        return color[(Math.round(d.parent.data.values[0].key / (max / 5)))];
      })
      .on("mouseover", function (d) {
        tooltip.attr("class", "tooltip");
        tooltip.style("left", d3.event.pageX + 10 + "px");
        tooltip.style("top", d3.event.pageY - 25 + "px");
        tooltip.style("display", "inline-block");
        tooltip.html("<div class='tooltip-title'>" + d.parent.data.key +
          "</div>" + "<div class='tooltip-count'> Size :  " + d.value + " % color : " + d.parent.data.values[0].key + "</div>");
      })
      .on("mouseout", function (d) {
        tooltip.style("display", "none");
      });


    node.append("div")
      .attr("class", "node-value")
      .style("", "node-value")
      .text(function (d) {
        return d.parent.data.key
      });
    //************************************************************
    // Add Legend on bottom side
    //************************************************************
    d3.select("#legend-div")
      .select("svg").remove();
    var legendTextPad = 100,
      rectWidth = 20,
      rectHeight = 20;

    var legendSVG = d3.select("#legend-div").append("svg")
      .attr("transform", function (d, i) {
        return "translate(" + 0 + "," + 0 + ")"; // place each legend on the bottom
      });

    var legendG = legendSVG.selectAll(".legend")
      .data(legendData)
      .enter().append("g")
      .attr("transform", function (d, i) {
        return "translate(" + (i * legendTextPad) + "," + 10 + ")"; // place each legend on the bottom
      })
      .attr("class", "legend")


    legendG.append("rect") // make a matching color rect
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("fill", function (d, i) {
        return color[i];
      });
    legendG.append("text") // add the text
      .text(function (d) {
        return "<" + d;
      })
      .style("font-size", 12)
      .attr("y", rectHeight / 1.5)
      .attr("x", rectWidth);





    function type(d) {
      d.data1 = +d.data1;
      return d;
    }
  });

}

ZoomableTreeMap();

window.onresize = function () {
  ZoomableTreeMap();
};

function getLegendData(max, length) {
  var legendData = [];

  for (var i = 1; i <= length; i++) {
    legendData.push(i * (max / length));
  }
  return legendData;

}