//************************************************************
// Initialize Global Variables and call methods to plot visualiization 
//************************************************************


//margin variable is used to give margin to the svg element.USing this you can design relative position code
var margin = { top: 20, right: 10, bottom: 100, left: 60 }, pad = 20,

	//This is to get width and height from parentdiv.So graph will be placed inside parent div
	width = document.getElementById("visualization").offsetWidth - margin.left - margin.right,
	height = document.getElementById("visualization").offsetHeight - margin.top - margin.bottom,
	radius = height / 2 - margin.top;
var svg = d3.select("#visualization").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	"translate(" + (radius + margin.left) + "," + height / 2 + ")");

//************************************************************
// Donut chart D3 config
//************************************************************

var arc = d3.svg.arc()
	.innerRadius(0)
	.outerRadius(radius);

var pie = d3.layout.pie().sort(null)
	.value(function (d) {
		return d.data1;
	}).padAngle(0);;
d3.xml("data/religiontree.xml", function (error, data) {
	if (error) { throw error; alert("Unable to load XML file") };
	console.log(data);

	// Convert the XML document to an array of objects.
	// Note that querySelectorAll returns a NodeList, not a proper Array,
	// so we must use map.call to invoke array methods.
	data = [].map.call(data.querySelectorAll("data"), function (region) {
		return {
			label: region.getAttribute("label"),
			data1: +region.getAttribute("data1"),
			color: region.getAttribute("color")
		};
	});
	console.log(data)

	//************************************************************
	// Add SVG and draw donut chart using config
	//************************************************************

	var tooltip = d3.select("body").append("div");// declare the tooltip div
	console.log(data);
	var donut = svg.selectAll("path")
		.data(pie(data))
		.enter();

	donut.append("path")
		.on("mouseover", function (d) {
			tooltip.attr("class", "tooltip");
			tooltip.style("left", d3.event.pageX + 10 + "px");
			tooltip.style("top", d3.event.pageY - 25 + "px");
			tooltip.style("display", "inline-block");
			tooltip.html("<div class='tooltip-title'>" + d.data.label
				+ "</div>" + "<div class='tooltip-count'>  " + d.data.data1 + "</div>");
		})
		.on("mouseout", function (d) {
			tooltip.style("display", "none");
		})
		.attr("fill", function (d, i) { return "#" + d.data.color.substring(2, 8); })
		.transition()
		.ease("exp")
		.duration(1000)
		.attrTween("d", tweenPie);

	//************************************************************
	// Add Text on arc of circle and
	// at bottom show total no of books count
	//************************************************************
	donut.append("text")
		.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
		.transition()
		.delay(1200)
		.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.attr("dx", "-1em")
		.text(function (d) { if (d.data.data1 > 3) return d.data.data1 + " %"; });

	function tweenPie(b) {
		var i = d3.interpolate({ startAngle: 1.1 * Math.PI, endAngle: 1.1 * Math.PI }, b);
		return function (t) { return arc(i(t)); };
	}

	//************************************************************
	// Add Legend on right side
	//************************************************************

	var legendTextPad = 25;
	var legendG = svg.selectAll(".legend")
		.data(data)
		.enter().append("g")
		.attr("transform", function (d, i) {
			return "translate(" + (radius + pad) + "," + ((i * 35) - height / 2.5 - pad) + ")"; // place each legend on the right 
		})
		.attr("class", "legend");

	legendG.append("rect") // make a matching color rect
		.attr("width", legendTextPad)
		.attr("height", legendTextPad)
		.attr("fill", function (d, i) {
			return "#" + d.color.substring(2, 8);
		});
	legendG.append("text") // add the text
		.text(function (d) {
			return d.label + " (" + d.data1 + "%  ) ";
		})
		.style("font-size", 12)
		.attr("y", legendTextPad / 1.5)
		.attr("x", legendTextPad + pad / 5);


});


