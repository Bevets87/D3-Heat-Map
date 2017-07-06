(function(d3) {
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  var getDataSet = function(url, cb, dimensions){
    d3.json(url, function(data){
      cb(data, dimensions)
    })
  }

  var drawSVG = function(dataset, dimensions){
    // get data
    const baseTemp = dataset.baseTemperature
    const data = dataset.monthlyVariance

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
    // make svg
    const w = dimensions.width
    const h = dimensions.height
    const paddingLeft = dimensions.left
    const paddingRight = dimensions.right
    const paddingTop = dimensions.top
    const paddingBottom = dimensions.bottom

      d3.select('#app').selectAll("*").remove();
    const svg = d3.select('#app')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h)
    // add tooltip
    const div = d3.select('#app').append('div')
                   .attr('class', 'tooltip')
                   .style('opacity', 0);

    // make y-axis of months
    const minMonth = d3.min(data, d => d.month)
    const maxMonth = d3.max(data, d => d.month)
    const yScale = d3.scaleLinear()
                     .domain([maxMonth + 1.1, 0.5])
                     .range([h - paddingBottom, paddingTop ])
    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickFormat(d => months[d - 1])
                    .ticks(12)
    // make x-axis of years
    const minYear = d3.min(data, d => d.year)
    const maxYear = d3.max(data, d => d.year)

    const xScale = d3.scaleLinear()
                     .domain([minYear, maxYear])
                     .range([paddingLeft, w - paddingRight])

    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .tickFormat(d => d)
                    .ticks(10)
    // append x and y axis
                     svg.append('g')
                      .attr('transform', 'translate('+ paddingLeft +',0)')
                      .call(yAxis)

                     svg.append('g')
                      .attr('transform', 'translate(0,' + yScale(maxMonth + 1.1) + ')')
                      .call(xAxis)
 // make data points rectangles and fill color will correspond to color scale
    const minVar = d3.min(data, d => d.variance)
    const maxVar = d3.max(data, d => d.variance)

    const colorScale = d3.scaleQuantile()
                       .domain([minVar + baseTemp, maxVar + baseTemp])
                       .range(colors);

                     svg.selectAll('rect')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('x', d => xScale(d.year))
                        .attr('y', d => yScale(d.month))
                        .attr('rx', 0)
                        .attr('ry', 0)
                        .attr('height', '28px')
                        .attr('width', '10px')
                        .style('fill', d => colorScale(d.variance + baseTemp))
                        .on('mouseover', function(d) {
                        div.transition()
                           .duration(300)
                           .style('opacity', 0.7)
                       div.html('<h2>' + months[d.month - 1] + ',' + d.year + '</h2><h5>' + d.variance + baseTemp +'℃</h5><h6>' + d.variance + ' ℃</h6>')
                       .style('left', (d3.event.pageX) + 'px')
                       .style('top', (d3.event.pageY - 50) + 'px');
                      })
                        .on('mouseout', function(d) {
                        div.transition()
                        .duration(200)
                        .style('opacity', 0);
                       });

  // add labels to axis
                  svg.append('text')
                        .attr('text-anchor', 'middle')
                        .attr('transform', 'translate('+ (w/2) +','+(h-(paddingBottom/3))+')')
                        .style('font-size','18px')
                        .text('years');
   }

   window.addEventListener('orientationchange', function () {
     if (screen.orientation.angle === 90) {
       getDataSet(url, drawSVG, {width: 600, height: 400, top: 40, bottom: 80, right: 30, left: 50})
     } else {
       getDataSet(url, drawSVG, {width: 350, height: 350, top: 20, bottom: 50, right: 30, left: 30})
    }
  })

  window.addEventListener('load', function () {
    if (this.innerWidth < 600) {
      getDataSet(url, drawSVG, {width: 400, height: 400, top: 20, bottom: 50, right: 30, left: 30})
    } else if (this.innerWidth < 1000 && this.innerWidth >= 600) {
      getDataSet(url, drawSVG, {width: 600, height: 400, top: 40, bottom: 80, right: 30, left: 70})
    } else {
      getDataSet(url, drawSVG, {width: 1000, height: 500, top: 50, bottom: 95, right: 50, left: 70})
    }
  })
  window.addEventListener('resize', function () {
    if (this.innerWidth < 600) {
      getDataSet(url, drawSVG, {width: 400, height: 400, top: 20, bottom: 50, right: 30, left: 30})
    }  else if (this.innerWidth < 1000 && this.innerWidth >= 600) {
      getDataSet(url, drawSVG, {width: 600, height: 400, top: 40, bottom: 80, right: 30, left: 70})
    } else {
      getDataSet(url, drawSVG, {width: 1000, height: 500, top: 50, bottom: 95, right: 50, left: 70})
    }
  })

}(d3))
