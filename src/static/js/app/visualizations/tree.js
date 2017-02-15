//* ***********************************************************
// initialize Global Variables and call methods to plot visual
//* ***********************************************************
function visualizeTree(url) {
 
var tooltip = d3.select("body").append("div");// declare the tooltip div
var color =['#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#9b59b6'],
margin = {top: 0, right: 10, bottom: 0, left: 0},pad =20,nest = d3.nest()
	    	.key(function(d) { return d.name; })
	   	.key(function(d) { return d.data2; })
		.key(function(d) { return d.color; })
    		.rollup(function(d) { return d3.sum(d, function(d) { return d.data1; }); });

function ZoomableTreeMap() {
//This is to get width and height from parentdiv.So graph will be placed inside parent div
    	var  width = document.getElementById("visualization").offsetWidth - margin.left - margin.right,
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
               		.round(false)
                	.size([width, height]);
        d3.xml(url, function (data) {
		data = [].map.call(data.querySelectorAll("data"), function(religion) {
 			return {
    				  name: religion.getAttribute("label"),
     				  data1: +religion.getAttribute("data1"),
     				  data2: +religion.getAttribute("data2"),
				  color: religion.getAttribute("color")
    				};
  		});
	var max =d3.max(data,function(d){return d.data2});
	var legendData = getLegendData(max,5);
    	node = root = data;
  	var root = d3.hierarchy({values: nest.entries(data)}, function(d) { return d.values; })
      		      .sum(function(d) { return d.value; }).sort(function(a, b) { return b.value - a.value; });
	
	treemap(root);
	d3.select("#visualization")
    	  .selectAll(".node").remove();

  	var node = d3.select("#visualization")
    		     .selectAll(".node")
   		     .data(root.leaves())
    		     .enter().append("div")
                     .attr("class", "node")
                     .style("left", function(d) { return d.x0 + "px"; })
                     .style("top", function(d) { return d.y0 + "px"; })
                     .style("width", function(d) { return d.x1 - d.x0 + "px"; })
                     .style("height", function(d) { return d.y1 - d.y0 + "px"; })
		    .style("background", function(d) { console.log(d); return "#"+d.parent.data.values[0].key.substring(2,8); })
		     .on("mouseover", function(d){
         	  	tooltip.attr("class", "tooltip");
         	  	tooltip.style("left", d3.event.pageX+10+"px");
         	 	tooltip.style("top", d3.event.pageY-25+"px");
        	 	tooltip.style("display", "inline-block");
        	 	tooltip.html("<div class='tooltip-title'>"+d.parent.parent.data.key
           			+"</div>" +"<div class='tooltip-count'> Size :  "+d.value+" % color : "+d.parent.data.key+"</div>");})
     		     .on("mouseout", function(d){
       			tooltip.style("display", "none");
		     });

  
            node.append("div")
                .attr("class", "node-value")
                .style("", "node-value")
                .text(function(d) { return d.parent.parent.data.key });


	function type(d) {
  		d.data1 = +d.data1;
  		return d;
		}
	});

    }

ZoomableTreeMap();

window.onresize = function() {
    ZoomableTreeMap();
};

function getLegendData(max,length){
var legendData = [];

for(var i=1;i<=length;i++) {
legendData.push(i*(max/length));
}
return legendData;

}

}

// init Tree Map with placeholder url 
url = 'https://in-polis-app28.ads.iu.edu/daarws/GetTreeMapData.aspx?';
let geog,
  rcvi,
  DominantReligion,
  dy,
  glid,
  dy2,
  rcvi2,
  NumberofClusters,
  ColorScheme,
  DenomFamily,
  DenomFamily2,
  // FromPie,
  parameters;

parameters = {
  geog: 'COUNTRY',
  rcvi: '4',
  DominantReligion: '2',
  dy: '2010',
  glid: '011',
  dy2: '2010',
  rcvi2: '3',
  NumberofClusters: '5',
  ColorScheme: 'Reds',
  DenomFamily: '25',
  DenomFamily2: '25',
  // FromPie: 'true', // Not needed here
};
parameters = $.param(parameters);

visualizeTree(url + parameters);
