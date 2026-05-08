document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initTaskAccordion();

  fetch('assets/metrics.json')
    .then(function (response) { return response.json(); })
    .then(function (metrics) {
      initStatCounters(metrics.hero);
      initD3Timeline(metrics.timeline);
    })
    .catch(function () {
      initStatCounters();
      initD3Timeline();
    });
});


function initNavbar() {
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var visibleId = entry.target.id;
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + visibleId) {
          link.classList.add('active');
        }
      });
    });
  }, { threshold: 0.3 });

  sections.forEach(function (section) {
    observer.observe(section);
  });
}


function initStatCounters(heroMetrics) {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  var fallback = [22948, 87, 7];
  var values = fallback;

  if (heroMetrics) {
    values = [
      heroMetrics.listings_snapshot,
      heroMetrics.neighbourhoods,
      heroMetrics.years_overlap
    ];
  }

  var DURATION = 1800;

  counters.forEach(function (counter, index) {
    var target = values[index] !== undefined ? values[index] : parseInt(counter.getAttribute('data-target'), 10);
    counter.setAttribute('data-target', target);
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / DURATION, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}


function initTaskAccordion() {
  var taskCards = document.querySelectorAll('.task-card');

  taskCards.forEach(function (card) {
    var header = card.querySelector('.task-header');

    header.addEventListener('click', function () {
      var isOpen = card.classList.contains('open');
      taskCards.forEach(function (c) {
        c.classList.remove('open');
      });
      if (!isOpen) card.classList.add('open');
    });
  });
}


function initD3Timeline(timelineMetrics) {
  var fallbackTimeline = [
    { period: '2018', airbnb_index: 100.0, rent_index: 100.0, review_count: 40507, active_listings: 1991, rent_mid: 10.57 },
    { period: '2019', airbnb_index: 140.6, rent_index: 103.9, review_count: 56948, active_listings: 2712, rent_mid: 10.99 },
    { period: '2020', airbnb_index: 45.6, rent_index: 105.9, review_count: 18486, active_listings: 2437, rent_mid: 11.20 },
    { period: '2021', airbnb_index: 98.7, rent_index: 107.0, review_count: 39974, active_listings: 3344, rent_mid: 11.31 },
    { period: '2022', airbnb_index: 273.2, rent_index: 113.9, review_count: 110657, active_listings: 5649, rent_mid: 12.04 },
    { period: '2023', airbnb_index: 443.2, rent_index: 124.2, review_count: 179511, active_listings: 8604, rent_mid: 13.13 },
    { period: '2024', airbnb_index: 603.1, rent_index: 135.9, review_count: 244309, active_listings: 12796, rent_mid: 14.37 }
  ];

  var series = Array.isArray(timelineMetrics) && timelineMetrics.length ? timelineMetrics : fallbackTimeline;
  var timePoints = series.map(function (d) { return d.period; });
  var airbnbIndex = series.map(function (d) { return d.airbnb_index; });
  var rentIndex = series.map(function (d) { return d.rent_index; });
  var reviewCounts = series.map(function (d) { return d.review_count; });
  var rentLevels = series.map(function (d) { return d.rent_mid; });

  var annotations = [
    {
      period: '2020',
      label: 'COVID-19',
      title: 'COVID-19 Lockdown (2020)',
      text: "Italy's national lockdown pushed review activity sharply downward while official rents moved much more slowly. The contrast shows how sensitive short-term tourism demand is to disruption."
    },
    {
      period: '2022',
      label: 'Rebound',
      title: 'Post-Pandemic Rebound (2022)',
      text: 'Review activity accelerated well beyond the 2018 baseline in 2022, while the OMI rent index rose more gradually. The two markets recover together, but not at the same pace.'
    },
    {
      period: '2024',
      label: 'Peak',
      title: 'Latest Overlap Year (2024)',
      text: 'By 2024 both series reach their highest level in the overlapping period. The page uses that year as the latest defensible comparison point because the OMI overlap currently stops there.'
    }
  ];

  var container = document.getElementById('d3-timeline');
  if (!container) return;

  container.innerHTML = '';
  d3.selectAll('.d3-tooltip').remove();

  var margin = { top: 40, right: 40, bottom: 70, left: 58 };
  var totalWidth = container.clientWidth || 800;
  var totalHeight = 390;
  var width = totalWidth - margin.left - margin.right;
  var height = totalHeight - margin.top - margin.bottom;

  var svg = d3.select('#d3-timeline')
    .append('svg')
      .attr('width', totalWidth)
      .attr('height', totalHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Annotated timeline of Airbnb review activity and OMI rent index in Milan from 2018 to 2024');

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.scaleBand()
    .domain(timePoints)
    .range([0, width])
    .padding(0.12);

  var xMid = function (d) { return x(d) + x.bandwidth() / 2; };
  var maxIndex = d3.max(airbnbIndex.concat(rentIndex));
  var y = d3.scaleLinear()
    .domain([0, maxIndex * 1.08])
    .range([height, 0]);

  g.append('g')
    .attr('class', 'grid-lines')
    .call(
      d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat('')
        .ticks(6)
    )
    .call(function (sel) {
      sel.select('.domain').remove();
      sel.selectAll('line')
        .attr('stroke', '#e0dbd3')
        .attr('stroke-dasharray', '3,4');
    });

  var xAxisGroup = g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  xAxisGroup.selectAll('text')
    .attr('dy', '1.2em')
    .style('font-size', '0.75rem')
    .style('fill', '#888');

  xAxisGroup.select('.domain').attr('stroke', '#ccc');
  xAxisGroup.selectAll('line').attr('stroke', '#ccc');

  var yAxisGroup = g.append('g')
    .call(d3.axisLeft(y).ticks(6));

  yAxisGroup.selectAll('text')
    .style('font-size', '0.75rem')
    .style('fill', '#888');

  yAxisGroup.select('.domain').attr('stroke', '#ccc');
  yAxisGroup.selectAll('line').attr('stroke', '#ccc');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -42)
    .attr('text-anchor', 'middle')
    .style('font-size', '0.75rem')
    .style('fill', '#888')
    .text('Index (2018 = 100)');

  var lineGenerator = d3.line()
    .x(function (d, i) { return xMid(timePoints[i]); })
    .y(function (d) { return y(d); })
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(airbnbIndex)
    .attr('fill', 'none')
    .attr('stroke', '#FF5A5F')
    .attr('stroke-width', 2.7)
    .attr('d', lineGenerator);

  g.append('path')
    .datum(rentIndex)
    .attr('fill', 'none')
    .attr('stroke', '#F4B82D')
    .attr('stroke-width', 2.7)
    .attr('d', lineGenerator);

  var markerGroup = g.append('g').attr('class', 'annotation-markers');

  annotations.forEach(function (ann) {
    var cx = xMid(ann.period);
    if (!Number.isFinite(cx)) return;

    markerGroup.append('line')
      .attr('x1', cx).attr('x2', cx)
      .attr('y1', height).attr('y2', 0)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    markerGroup.append('circle')
      .attr('cx', cx)
      .attr('cy', height + 28)
      .attr('r', 7)
      .attr('fill', '#1A5E3F')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('click', function () {
        showAnnotationPanel(ann);
      });

    markerGroup.append('text')
      .attr('x', cx)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '0.65rem')
      .style('fill', '#1A5E3F')
      .style('cursor', 'pointer')
      .text(ann.label)
      .on('click', function () {
        showAnnotationPanel(ann);
      });
  });

  var legend = g.append('g')
    .attr('transform', 'translate(' + (width - 190) + ', 0)');

  legend.append('rect')
    .attr('x', 0).attr('y', 0)
    .attr('width', 14).attr('height', 4)
    .attr('rx', 2)
    .attr('fill', '#FF5A5F');

  legend.append('text')
    .attr('x', 20).attr('y', 4)
    .style('font-size', '0.78rem')
    .style('fill', '#555')
    .text('Airbnb review activity index');

  legend.append('rect')
    .attr('x', 0).attr('y', 16)
    .attr('width', 14).attr('height', 4)
    .attr('rx', 2)
    .attr('fill', '#F4B82D');

  legend.append('text')
    .attr('x', 20).attr('y', 20)
    .style('font-size', '0.78rem')
    .style('fill', '#555')
    .text('OMI rent index');

  var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'd3-tooltip');

  var crosshair = g.append('line')
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,3')
    .style('opacity', 0);

  g.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent')
    .on('mousemove', function (event) {
      var mouseX = d3.pointer(event)[0];
      var nearestPeriod = null;
      var nearestDist = Infinity;

      timePoints.forEach(function (period) {
        var dist = Math.abs(xMid(period) - mouseX);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestPeriod = period;
        }
      });

      if (!nearestPeriod) return;

      var i = timePoints.indexOf(nearestPeriod);
      var cx = xMid(nearestPeriod);

      crosshair
        .attr('x1', cx).attr('x2', cx)
        .style('opacity', 1);

      tooltip
        .style('opacity', 1)
        .html(
          '<strong>' + nearestPeriod + '</strong><br>' +
          '<span style="color:#FF5A5F">&#9632;</span> Airbnb index: ' + airbnbIndex[i] + '<br>' +
          '<span style="color:#F4B82D">&#9632;</span> Rent index: ' + rentIndex[i] + '<br>' +
          'Reviews: ' + reviewCounts[i].toLocaleString() + '<br>' +
          'OMI midpoint rent: ' + rentLevels[i].toFixed(2) + ' €/m²'
        )
        .style('left', (event.pageX + 14) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseleave', function () {
      crosshair.style('opacity', 0);
      tooltip.style('opacity', 0);
    });
}


function showAnnotationPanel(annotation) {
  var panel = document.getElementById('annotation-panel');
  var titleEl = document.getElementById('annotation-title');
  var textEl = document.getElementById('annotation-text');
  var closeBtn = document.getElementById('annotation-close');

  titleEl.textContent = annotation.title;
  textEl.textContent = annotation.text;
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  closeBtn.onclick = function () {
    panel.classList.add('hidden');
  };
}
