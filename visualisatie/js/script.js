function makeChart(data1, data2, axmin = -1, axmax = -1, aymin = 0, aymax = -1)
{

	node = document.getElementById('vis');
	while (node.hasChildNodes())
	{
    	node.removeChild(node.lastChild);
	}

	d3.csv("data.csv", function(data)
	{
		var vis = d3.select("svg")
		margin = {top: 20, right: 20, bottom: 20, left: 100},
		width = 960,
		height = 500

		var dataset = data.map(function(d) { return [ +d["imdb_score"], +d["budget"], +d["gross"], +d["critic_reviews"], +d["user_reviews"] ]; })

		if (axmin === -1)
		{
			axmin = d3.min(dataset)[0];
		}

		if (axmax === -1)
		{
			axmax = d3.max(dataset)[0];
		}

		if (aymax === -1 && data2 == 'gross')
		{
			aymax = 300000000;
		}

		if (aymax === -1 && data2 == 'user_reviews')
		{
			aymax = 4000;
			var reviews = true;
		}

		var xScale = d3.scaleLinear().range([margin.left, width - margin.right]).domain([axmin, axmax]);
		var yScale = d3.scaleLinear().range([height - margin.top, margin.bottom]).domain([aymin, aymax]);

		var xAxis = d3.axisBottom().scale(xScale);
		var yAxis = d3.axisLeft().scale(yScale);

		if (reviews == true)
		{
			var y2Scale = d3.scaleLinear().range([height - margin.top, margin.bottom]).domain([aymin, aymax/10]);
			var y2Axis = d3.axisRight().scale(y2Scale);
			vis.append("svg:g").attr("class","axis").attr("transform", "translate(" + (width - margin.right) + ",0)").call(y2Axis);
		}

		vis.append("svg:g").attr("class","axis").attr("transform", "translate(0," + (height - margin.bottom) + ")").call(xAxis);
		vis.append("svg:g").attr("class","axis").attr("transform", "translate(" + (margin.left) + ",0)").call(yAxis);

		var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

		if (reviews == true)
		{
			var lineGen = d3.line()
			.x(function(d) { return xScale(d.imdb_score);})
			.y(function(d) { return y2Scale(d[data1]);});
		}
		else
		{
			var lineGen = d3.line()
			.x(function(d) { return xScale(d.imdb_score);})
			.y(function(d) { return yScale(d[data1]);});
		}

		vis.append('svg:path').attr('d', lineGen(data)).attr('stroke', '#e15759').attr('stroke-width', 2).attr('fill', 'none');

		if (reviews == true)
		{
			vis.selectAll("dot")
			.data(data)
			.enter().append("circle")
			.attr("r", 3)
			.attr('fill', '#e15759')
			.attr("cx", function(d) { return xScale(d.imdb_score); })
			.attr("cy", function(d) { return y2Scale(d[data1]); })
			.on("mouseover", function(d) {
			div.transition()
			.duration(100)
			.style("opacity", 1);
			div .html('Score: ' + d.imdb_score + "<br/>" + data1 + ": " + d[data1])
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
			div.transition()
			.duration(500)
			.style("opacity", 0);
			});
		}
		else
		{
			vis.selectAll("dot")
			.data(data)
			.enter().append("circle")
			.attr("r", 3)
			.attr('fill', '#e15759')
			.attr("cx", function(d) { return xScale(d.imdb_score); })
			.attr("cy", function(d) { return yScale(d[data1]); })
			.on("mouseover", function(d) {
			div.transition()
			.duration(100)
			.style("opacity", 1);
			div .html('Score: ' + d.imdb_score + "<br/>" + data1 + ": " + d[data1])
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
			div.transition()
			.duration(500)
			.style("opacity", 0);
			});
		}

		var lineGen = d3.line()
		.x(function(d) { return xScale(d.imdb_score);})
		.y(function(d) { return yScale(d[data2]);});

		vis.append('svg:path').attr('d', lineGen(data)).attr('stroke', '#76b7b2').attr('stroke-width', 2).attr('fill', 'none');

		vis.selectAll("dot")
		.data(data)
		.enter().append("circle")
		.attr("r", 3)
		.attr('fill', '#76b7b2')
		.attr("cx", function(d) { return xScale(d.imdb_score); })
		.attr("cy", function(d) { return yScale(d[data2]); })
		.on("mouseover", function(d) {
		div.transition()
		.duration(100)
		.style("opacity", 1);
		div .html('Score: ' + d.imdb_score + "<br/>" + data2 +": " + d[data2])
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		div.transition()
		.duration(500)
		.style("opacity", 0);
		});

	});
}

function test2()
{
	var svg = d3.select("svg"),
	margin = {top: 20, right: 20, bottom: 30, left: 100},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleLinear().rangeRound([0, width]);
	var y = d3.scaleLinear().rangeRound([height, 0]);

	var line = d3.line()
		.x(function(d) { return x(d.imdb_score); })
		.y(function(d) { return y(d.gross); });

	d3.csv("data.csv", function(data) {
		var dataset = data.map(function(d) { return [ +d["imdb_score"], +d["gross"] ]; });

		x.domain(d3.extent(data, function(d) { return d.imdb_score; }));
		y.domain(d3.extent(data, function(d) { return d.gross; }));

		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y))

		g.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
	})
}