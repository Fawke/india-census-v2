
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};


var margin = {top: 20, right: 20, bottom: 400, left: 100},
    width = 1160 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Number of People: </strong> <span style='color:red'>" + d.totalPop + "</span>";
      })

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.call(tip);

d3.json("../../outPutFiles/eduCategWise.json", function(error, data) {
  if (error) throw error;
  // alert(data);
  // alert("sadasd");
  var xDomain = data.map(function(d) { return d.eduCateg; });

  xDomain = xDomain.move(xDomain.indexOf('0-6'),0);
  x.domain(xDomain);
  y.domain([0, d3.max(data, function(d) {  return d.totalPop; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) {
              return "rotate(-65)"
              });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total Literate Population");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.eduCateg); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.totalPop); })
      .attr("height", function(d) { return height - y(d.totalPop); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

});

function type(d) {
  d.frequency = +d.frequency;
  return d;
}
