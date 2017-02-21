//************************************************************
// initialize Global Variables and call methods to plot visual
//************************************************************

var tooltip = d3.select("body").append("div"); // declare the tooltip div
var color = d3.scaleOrdinal(d3.schemeCategory10),
	margin = {
		top: 0,
		right: 10,
		bottom: 0,
		left: 0
	},
	pad = 20;
var width = document.getElementById("visualization").offsetWidth - margin.left - margin.right,
	height = document.getElementById("visualization").offsetHeight - margin.top - margin.bottom,
	projection = d3.geoAlbersUsa(),
	path = d3.geoPath()
	.projection(projection),
	tooltip = d3.select("body").append("div");;

var svg = d3.select("#visualization").append("svg")
	.attr("width", width)
	.attr("height", height - pad);

var state_hash = {
	"Alabama": "AL",
	"Alaska": "AK",
	"American Samoa": "AS",
	"Arizona": "AZ",
	"Arkansas": "AR",
	"California": "CA",
	"Colorado": "CO",
	"Connecticut": "CT",
	"Delaware": "DE",
	"District Of Columbia": "DC",
	"Federated States Of Micronesia": "FM",
	"Florida": "FL",
	"Georgia": "GA",
	"Guam": "GU",
	"Hawaii": "HI",
	"Idaho": "ID",
	"Illinois": "IL",
	"Indiana": "IN",
	"Iowa": "IA",
	"Kansas": "KS",
	"Kentucky": "KY",
	"Louisiana": "LA",
	"Maine": "ME",
	"Marshall Islands": "MH",
	"Maryland": "MD",
	"Massachusetts": "MA",
	"Michigan": "MI",
	"Minnesota": "MN",
	"Mississippi": "MS",
	"Missouri": "MO",
	"Montana": "MT",
	"Nebraska": "NE",
	"Nevada": "NV",
	"New Hampshire": "NH",
	"New Jersey": "NJ",
	"New Mexico": "NM",
	"New York": "NY",
	"North Carolina": "NC",
	"North Dakota": "ND",
	"Northern Mariana Islands": "MP",
	"Ohio": "OH",
	"Oklahoma": "OK",
	"Oregon": "OR",
	"Palau": "PW",
	"Pennsylvania": "PA",
	"Puerto Rico": "PR",
	"Rhode Island": "RI",
	"South Carolina": "SC",
	"South Dakota": "SD",
	"Tennessee": "TN",
	"Texas": "TX",
	"Utah": "UT",
	"Vermont": "VT",
	"Virgin Islands": "VI",
	"Virginia": "VA",
	"Washington": "WA",
	"West Virginia": "WV",
	"Wisconsin": "WI",
	"Wyoming": "WY"
};


d3.json("data/dmd.json", function (error, data) {
	var stateData = mapStateData(data);
	d3.json("data/us.json", function (error, json) {

		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", function (d, i) {

				var pathData = stateData[state_hash[d.properties.name]];
				if (pathData) {
					pathData.sort(function (x, y) {
						return d3.ascending(y["@value"], x["@value"]);
					});
					return color(pathData[0]["@coloRank"]);
				}
				return "#fff";
			})
			.style("stroke-width", "1")
			.on("click", function (d) {
				drawDonut(stateData[state_hash[d.properties.name]]);
			})
			.on("mouseover", function (d) {
				tooltip.attr("class", "tooltip");
				tooltip.style("left", d3.event.pageX + 10 + "px");
				tooltip.style("top", d3.event.pageY - 25 + "px");
				tooltip.style("display", "inline-block");
				var str = stateData[state_hash[d.properties.name]][0];

				tooltip.html("<div class='tooltip-count'>" + str["@toolTip"].substr(0, str["@toolTip"].lastIndexOf(" - ")) + " " + Math.round(str["@value"] * 100, 2) + "%" + "</div>");
			})
			.on("mouseout", function (d) {
				tooltip.style("display", "none");
			})
	});
});

function mapStateData(data) {
	var stateData = {};
	for (var i in data.geography) {
		stateData[data.geography[i]["@key"]] = data.geography[i].data;
	}
	return stateData;
}

function drawDonut(data) {
	var width = document.getElementById("donut").offsetWidth - margin.left - margin.right,
		height = document.getElementById("donut").offsetHeight - margin.top - margin.bottom,
		radius = height / 2 - margin.top;
	d3.select("#donut svg").remove();
	var svg = d3.select("#donut").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + (radius + margin.left) + "," + height / 2 + ")");
	//************************************************************
	// Donut chart D3 config
	//************************************************************

	var arc = d3.arc()
		.innerRadius(0)
		.outerRadius(radius);

	var pie = d3.pie().sort(null)
		.value(function (d) {

			return d["@value"];
		}).padAngle(0);;



	//************************************************************
	// Add SVG and draw donut chart using config
	//************************************************************

	var tooltip2 = d3.select("body").append("div"); // declare the tooltip div
	var donut = svg.selectAll("path")
		.data(pie(data))
		.enter()

	donut.append("path")
		.attr('d', arc)
		.on("mouseover", function (d) {
			tooltip2.attr("class", "tooltip");
			tooltip2.style("left", d3.event.pageX + 10 + "px");
			tooltip2.style("top", d3.event.pageY - 25 + "px");
			tooltip2.style("display", "inline-block");
			tooltip2.html("<div class='tooltip-value'>" + d.data["@toolTip"].substr(d.data["@toolTip"].indexOf(' - ') + 2, d.data["@toolTip"].lastIndexOf(" - ") - 5) + Math.round(d.data["@value"] * 100, 2) + "%" + "</div>");
		})
		.on("mouseout", function (d) {
			tooltip2.style("display", "none");
		})
		.attr("fill", function (d, i) {
			return color(i);
		})
	//.transition()
	//.ease("exp")
	//.duration(1000)
	//.attrTween("d", tweenPie);

	//************************************************************
	// Add Text on arc of circle 
	//************************************************************
	donut.append("text")
		.attr("transform", function (d) {
			return "translate(" + arc.centroid(d) + ")";
		})
		// .transition()
		//.delay(1200)
		.attr("transform", function (d) {
			return "translate(" + arc.centroid(d) + ")";
		})
		.attr("dy", ".35em")
		.attr("dx", "-1em")
		.text(function (d) {
			if (d.data.value > 3) return d.data.value + " %";
		});

	function tweenPie(b) {
		var i = d3.interpolate({
			startAngle: 1.1 * Math.PI,
			endAngle: 1.1 * Math.PI
		}, b);
		return function (t) {
			return arc(i(t));
		};
	}

	//************************************************************
	// Add Legend on right side
	//************************************************************

	var legendTextPad = 15;
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
			return color(i);
		});
	legendG.append("text") // add the text
		.text(function (d) {
			return d["@toolTip"].substr(d["@toolTip"].indexOf(' - ') + 2, d["@toolTip"].lastIndexOf(" - ") - 5) + Math.round(d["@value"] * 100, 2) + "%";
		})
		.style("font-size", 12)
		.attr("y", legendTextPad / 1.5)
		.attr("x", legendTextPad + pad / 5);



}