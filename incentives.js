(function() {

// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/
var titlePlaceholder;
d3.bullet = function() {
	
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 0,
      JobsPromised = bulletJobsPromised,
    //  markers = bulletMarkers,
      JobsDelivered = bulletJobsDelivered,
	titles = bullettitles,
	subtitles = bulletsubtitles,
      width = $("body").width() - margin.left - margin.right,
      height = 30,
      tickFormat = null;
	titlePlaceholder = 110;
		

  // For each small multiple…
  function bullet(g) {
    g.each(function(d, i) {
      //var rangez = JobsPromised.call(this, d, i).slice().sort(d3.descending),
	var rangez = JobsPromised.call(this, d, i),
      //    markerz = JobsDelivered.call(this, d, i).slice().sort(d3.descending);
	//	markerz = markers.call(this, d, i),
		measurez = JobsDelivered.call(this, d, i).slice().sort(d3.descending),
		titlez = titles.call(this, d, i),
		subtitlez = subtitles.call(this, d, i),
	//	measurez = JobsDelivered.call(this, d, i),
          g = d3.select(this);
      var x1 = d3.scale.linear()
          .domain([0, Math.max(rangez/*, markerz*/, measurez[0])])
          .range(reverse ? [width, titlePlaceholder] : [titlePlaceholder, width]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());
      // Stash the new scale.
      this.__chart__ = x1;

      // Derive width-scales from the x-scales.
      var w0 = bulletWidth(x0),
          w1 = bulletWidth(x1);

      // Update the range rects.
      var range = g.selectAll("rect.range")
          .data([rangez]);
      range.enter().append("rect")
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", w0)
          .attr("height", height)
          .attr("x", reverse ? x0 : titlePlaceholder)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : titlePlaceholder);

      range.transition()
          .duration(duration)
          .attr("x", reverse ? x1 : titlePlaceholder)
          .attr("width", w1)
          .attr("height", height);

      // Update the measure rects.
      var measure = g.selectAll("rect.measure")
          .data(measurez);
      measure.enter().append("rect")
          .attr("class", function(d, i) { return "measure s" + i; })
          .attr("width", w0)
          .attr("height", height / 3)
          .attr("x", reverse ? x0 : titlePlaceholder)
          .attr("y", height / 3)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : titlePlaceholder);

      measure.transition()
          .duration(duration)
          .attr("width", w1)
          .attr("height", height / 3)
          .attr("x", reverse ? x1 : titlePlaceholder)
          .attr("y", height / 3);

      // Update the marker lines.
    /*  var marker = g.selectAll("line.marker")
          .data([markerz]);
      marker.enter().append("line")
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6)
        .transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1);*/
/*
      marker.transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6);*/

      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(4);

      // Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(x1.ticks(4), function(d) {
            return this.textContent || format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("g")
          .attr("class", "tick")
          .attr("transform", bulletTranslate(x0))
          .style("opacity", 1e-6);

      tickEnter.append("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickEnter.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);

      // Transition the entering ticks to the new scale, x1.
      tickEnter.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      var tickUpdate = tick.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

      tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickUpdate.select("text")
          .attr("y", height * 7 / 6);

      // Transition the exiting ticks to the new scale, x1.
      tick.exit().transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1e-6)
          .remove();
		var texts=	g.selectAll("g.texts")
			.data([titlez])

		var textsEnter = texts.enter().append("g")
				.style("text-anchor", "end")
				.attr("class", "texts")
				.attr("transform", "translate("+(titlePlaceholder-2)+"," + height / 2 + ")");
				//.attr("class", "textanchor");
		textsEnter.append("text")
			.attr("class", "title")
			.text(d.Beneficiaries);	
		textsEnter.append("text")
			.attr("class", "subtitle")
			.attr("dy", "1em")
			.text(d.COUNTY);
    });
    d3.timer.flush();
  }

  // left, right, top, bottom
  bullet.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    reverse = orient == "right" || orient == "bottom";
    return bullet;
  };

  // JobsPromised (bad, satisfactory, good)
  bullet.JobsPromised = function(x) {
    if (!arguments.length) return JobsPromised;
    JobsPromised = x;
    return bullet;
  };
bullet.titles = function(x) {
    if (!arguments.length) return titles;
    titles = x;
    return bullet;
  };
bullet.subtitles = function(x) {
    if (!arguments.length) return subtitles;
    subtitles = x;
    return bullet;
  };
  // markers (previous, goal)
 /* bullet.markers = function(x) {
    if (!arguments.length) return markers;
    markers = x;
    return bullet;
  };*/

  // JobsDelivered (actual, forecast)
  bullet.JobsDelivered = function(x) {
    if (!arguments.length) return JobsDelivered;
    JobsDelivered = x;
    return bullet;
  };

  bullet.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bullet;
  };

  bullet.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bullet;
  };

  bullet.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bullet;
  };

  bullet.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return bullet;
  };

  return bullet;
};

function bulletJobsPromised(d) {
  return d.JobsPromised;
}
function bullettitles(d) {
  return d.Beneficiaries;
}
function bulletsubtitles(d) {
  return d.COUNTY;
}
/*function bulletMarkers(d) {
	
	d.markers = Math.round(d.JobsPromised*.7);
  return d.markers;
}*/

function bulletJobsDelivered(d) {
  return d.JobsDelivered2;
}

function bulletTranslate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

function bulletWidth(x) {
  var x0 = x(0);
  return function(d) {
    return Math.abs(x(d) - x0);
  };
}

})();