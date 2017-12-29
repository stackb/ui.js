/**
 * A component for rendering lines in an svg thing.
 * 
 * @fileoverview 
 * suppress {reportUnknownTypes|checkTypes|undefinedVars} 
 */
goog.module('bzl.ui.Timeline');

const Box =goog.require('goog.math.Box');
const Component = goog.require('goog.ui.Component');
const TimelineEventSource = goog.require('bzl.ui.TimelineEventSource');
const asserts = goog.require('goog.asserts');
const strings = goog.require('goog.string');

class Timeline extends Component {

  /**
   * UI for d3 chart experimentation.  Assumes that the d3 library has
   * already been loaded by the app.
   *
   * @param {number=} width
   */
  constructor(width) {
    super();

    /** @protected @type {number|undefined} */
    this.width = width;

    /** @protected @type {!goog.math.Box} */
    this.margin = new goog.math.Box(0, 0, 5, 0);

    /** @protected @type {?bzl.ui.TimelineEventSource} */
    this.source = null;

    /** @protected @type {?Array<!Object>} */
    this.sourceData = null;

  }


  /**
   * @param {number} width
   */
  setWidth(width) {
    this.width = width;
    
    d3.select(this.select('v'))
      .attr('width', width + this.margin.left + this.margin.right);

    if (this.source && this.sourceData) {
      this.update(this.source, this.sourceData);
    }
    
  }

  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();

    // var margin = { 'top': 0, 'right': 0, 'bottom': 5, 'left': 0 };
    var margin = this.margin;
    var line_height = 26;
    var height = line_height * 1;
    // var height = line_height * 2;
    
    var x = d3.time.scale();
    var y = d3.scale.ordinal();
    
    //this.width = this.width || this.getContainerSize().width - margin.left - margin.right;
    
    // Create SVG canvas
    var svg = this.svg = d3.select(this.getElement())
        .append('svg')
        .attr('id', this.id('v'))
    //.attr('fill', 'rgba(0,0,0,0.3)')
        .attr('width', 0)
        .attr('height', 0);
    
    // .attr('width', width + margin.left + margin.right)
    // .attr('height', height + margin.top + margin.bottom);
    
    // var bar_x = function(d) { return x(d) + margin.left; };
    // var bar_y = function(d, i) { return (i * height) + 3; };

    var rect = svg.append('rect')
        .attr('id', this.id('r'))
        .attr('class', 'tl_bar')
    //.attr('stroke', 'rgba(0,0,0,0.10)')
        .attr('fill', 'white')
    //.attr('rx', 4)
    //.attr('ry', 4)
        .attr('x', margin.left)
        .attr('y', margin.top);
    
    // var focus = svg.append('g')
    //       .attr('class', 'focus')
    //       .attr('transform', 'translate(' + margin.left + ',' +
    //       margin.top + ')');
    
    var bar = svg.append('g')
        .attr('class', 'tl_bar')
        .attr('transform', 'translate(' + margin.left + ',' +
              margin.top + ')');
    
    var context = svg.append('g')
        .attr('class', 'tl_context')
        .attr('transform', 'translate(' + margin.left + ',' +
              margin.top + ')');
    
    // Need interface for the input data function to get the date, year,
    // and color of an event
    

    // var dt_get = function(event) { return event.Date.value.toDate(); };
    // var yr_get = function(event) { return event.Date.value.year(); };
    // var color = function(event) { return event.type.getColor() || 'grey'; };
    
  }
  

  /** @public @type {function(!bzl.ui.TimelineEventSource,
   * !Array<!Object>):undefined} */
  update(source, data) {

    this.source = source;
    this.sourceData = data;

    var x_min = 0;
    var width = this.width;
    var x_max = this.width;
    var brush = null;

    var dt_get = (event) => this.source.getEventDate(event);
    var yr_get = (event) => this.source.getEventYear(event);
    var color = (event) => this.source.getEventColor(event) || 'grey';
        
    svg.attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    rect.attr('width', width).attr('height', height);
    
    if (brush) {
      // self.debug('clearing brushed');
      d3.select('.tl_brush').call(brush.clear());
      $('.extent').remove();
    }

    var dt_min = null;
    var dt_max = null;
    
    // Setup data
    var yr_min = d3.min(data, yr_get);
    var yr_max = d3.max(data, yr_get);
    
    if (!yr_min) {
      yr_min = 2015;
      yr_max = 2015;
    }

    var d_min = d3.min(data, dt_get);
    var d_max = d3.max(data, dt_get);

    var m_min = moment(d_min);
    var m_max = moment(d_max);

    var l_min = null;
    var l_max = null;
    var l_scale = null;

    var days = m_max.diff(m_min, 'days');
    var granularity = null;
    if (days <= 7) {
      granularity = 'week';
      l_min = m_min.format('ddd MMM Do YYYY');
      l_max = m_max.format('ddd MMM Do YYYY');
    } else if (days <= 31) {
      granularity = 'month';
      l_min = m_min.format('MMM YYYY');
      l_max = m_max.format('MMM YYYY');
    } else {
      granularity = 'year';
      l_min = m_min.format('MMM YYYY');
      l_max = m_max.format('MMM YYYY');
    }

    var mf_min = m_min.startOf(granularity);
    var mf_max = m_max.endOf(granularity);
    
    dt_min = mf_min.toDate();
    dt_max = mf_max.toDate();

    var mf_dur = moment.duration(mf_max.diff(mf_min));
    l_scale = mf_dur.humanize();
    if (goog.string.endsWith(l_scale, 's')) {
      l_scale = l_scale.slice(0, -1);
    }
    l_scale += ' span';
    
    switch (granularity) {
    case 'week':
      l_min = mf_min.format('MMM Do YYYY');
      l_max = mf_max.format('MMM Do YYYY');
      break;
    case 'month':
    case 'year':
      l_min = mf_min.format('MMM YYYY');
      l_max = mf_max.format('MMM YYYY');
      break;
    }
    
    goog.asserts.assertNumber(yr_min, 'yr_min must be a number');
    goog.asserts.assertNumber(yr_max, 'yr_max must be a number');
    
    x.domain([dt_min, dt_max]).rangeRound([x_min, x_max]);
    
    y.domain(data.map(function(d) { return self.source.getEventId(d); }))
      .rangeRoundBands([0, height], .1);
    
    // self.dir(y, 'y-scale');
    
    brush = d3.svg.brush().x(x).on('brush', function() {
      var extent = brush.extent();
      // self.dir(extent, 'extent');
      var dateMax = extent[1];
      var dateMin = extent[0];
      // self.debug('dateMin: ' + dateMin);
      // self.debug('dateMax: ' + dateMax);
      self.source.setEventROI(dateMin, dateMax);
    });
    
    context.selectAll('.tl_brush').remove();
    
    context.append('g')
      .attr('class', 'tl_brush')
      .call(brush)
      .selectAll('rect')
      .attr('y', 0)
      .attr('height', line_height + 0);
    //.attr('height', line_height + 4);

    // ================================================================

    var mo_x = function(d) { return x(d) + margin.left; };
    // var mo_y = function(d) { return margin.top - 2; };
    // var mo_y = function(d) { return margin.top - 2; };
    var mo_range = d3.time.months(dt_min, dt_max);
    // var mo_range = d3.time.months(dy_first, dy_last);
    var mo_select = bar.selectAll('.tl_month').data(mo_range);
    
    // self.dir(mo_range, 'mo_range');
    // self.dir(mo_select, 'mo_select');
    var mo_tick_ht = 3;
    
    // Create Month ticklines
    mo_select.enter()
      .append('rect')
      .attr('class', 'tl_month')
      .attr('x', mo_x)
    //.attr('y', (margin.top + line_height))
    //.attr('y', (margin.top + line_height - mo_tick_ht))
      .attr('y', (margin.top))
      .attr('width', 1)
      .attr('height', mo_tick_ht)
      .attr('fill', '#eee');

    // Update the x-value of any changes
    mo_select.attr('x', mo_x);

    // Remove dead ones.
    mo_select.exit().remove();
    
    // ================================================================

    var yr_x = function(d) { return x(new Date(d, 0, 0)) + margin.left; };
    // var yr_y = function(d) { return margin.top - 4; };
    var yr_range = d3.range(yr_min, yr_max + 2);
    var yr_select = bar.selectAll('.tl_year').data(yr_range);

    // self.dir(yr_range, 'yr_range');
    // self.dir(yr_select, 'yr_select');

    var yr_tick_ht = 6;

    // Create year ticklines
    yr_select.enter()
      .append('rect')
      .attr('id', self.id('rect'))
      .attr('class', 'tl_year')
      .attr('x', yr_x)
    //.attr('y', (margin.top + line_height - yr_tick_ht))
      .attr('y', (margin.top))
      .attr('width', 1)
      .attr('height', yr_tick_ht)
      .attr('fill', '#bbb');
    
    // Update x-values of any that have changed
    yr_select.attr('x', yr_x);
    
    // Kill dead ones
    yr_select.exit().remove();

    // if (yr_select) return;
    // ================================================================
    
    var evt_key = function(d) { /* self.firebug(d, 'evt_key: '+d.id()); */
      return self.source.getEventId(d);
    };
    
    var evt_x = function(d) {
      // console.log('date ' + d + ' maps to x = ' + x(dt_get(d)));
      return x(dt_get(d)) + margin.left;
    };
    
    //var evt_click = function(d, i) {
      // self.dir(d3.select(this), 'You clicked on '+dt_get(data[i]));
    //};

    var evt_select = bar.selectAll('.tl_event').data(data, evt_key);

    // self.dir(evt_select, 'evt_select');

    evt_select.enter()
      .append('rect')
      .attr('class', 'tl_event')
      .attr('x', evt_x)
      .attr('y', margin.top)
      .attr('width', 2)
      .attr('height', line_height)
      .attr('fill', color);
    //.on('click', evt_click);
    
    evt_select.attr('x', evt_x);
    // evt_select.exit().remove();
    
    evt_select.exit().transition().duration(1000).style('opacity', 0).remove();
    
    // ================================================================
    
    // var min_select = svg.selectAll('.tl_minlabel').data([yr_min]);
    var min_select = bar.selectAll('.tl_minlabel').data([dt_min]);
    
    var dy = 5;
    // self.dir(min_select, 'min_select');
    
    min_select.enter()
      .append('text')
      .attr('class', 'tl_minlabel')
      .attr('x', margin.left + 3)
      .attr('y', (line_height / 2))
    //.attr('dx', -3)
      .attr('dy', dy)
    //.attr('dy', '2em')
      .attr('text-anchor', 'start')
      .style('opacity', '0.4')
    //.text(String);
      .text(l_min);
    
    min_select.text(l_min);
    // min_select.text(String);
    min_select.exit().transition().duration(500).style('opacity', 1).remove();
    
    var max_select = bar.selectAll('.tl_maxlabel').data([dt_max]);
    
    // var max_select = svg.selectAll('.tl_maxlabel').data([
    // yr_range[yr_range.length - 1] ]);
    // self.dir(max_select, 'max_select');
    
    max_select.enter()
      .append('text')
      .attr('class', 'tl_maxlabel')
      .attr('x', margin.left + width - 5)
      .attr('y', (line_height / 2))
    //.attr('dx', +5)
      .attr('dy', dy)
    //.attr('dy', '2em')
      .style('opacity', '0.4')
      .attr('text-anchor', 'end')
    //.text(String);
      .text(l_max);
    // max_select.text(String);
    max_select.text(l_max);
    max_select.exit().remove();

    var mid_select = bar.selectAll('.tl_midlabel').data([dt_max]);

    mid_select.enter()
      .append('text')
      .attr('class', 'tl_midlabel')
      .attr('x', margin.left + (width / 2))
      .attr('y', (line_height / 2))
    //.attr('y', (line_height / 2) + margin.bottom)
    //.attr('dx', +5)
    //.attr('dy', '2em')
      .attr('dy', dy)
      .attr('text-anchor', 'center')
      .style('opacity', '0.4')
      .style('font-style', 'italic')
    //.text(String);
      .text(l_scale);
    // mid_select.text(String);
    mid_select.text(l_scale);
    mid_select.exit().remove();

  }
  
  
  
}



/**
 * Implementing classes should be able to produce a list of events and
 * fetch the date, year, and color for an individual event object.
 * @interface
 * @template T
 */
bzl.ui.TimelineEventSource = function() {};


/**
 * Get a unique id for the event.
 * @param {T} event
 * @return {string}
 */
bzl.ui.TimelineEventSource.prototype.getEventId = function(event) {};


/**
 * Get the event date (timestamp when it occurred)
 * @param {T} event
 * @return {?Date}
 */
bzl.ui.TimelineEventSource.prototype.getEventDate = function(event) {};


/**
 * Get the event year
 * @param {T} event
 * @return {?number}
 */
bzl.ui.TimelineEventSource.prototype.getEventYear = function(event) {};


/**
 * Get the event color
 * @param {T} event
 * @return {string}
 */
bzl.ui.TimelineEventSource.prototype.getEventColor = function(event) {};


// /**
//  * Get the set of events
//  * @return {!Array<T>} events
//  */
// bzl.ui.TimelineEventSource.prototype.getEvents = function() {};



/**
 * Callback upon user interaction to focus the region of interest to
 * events between the min and max dates.
 * @param {!Date} min
 * @param {!Date} max
 */
bzl.ui.TimelineEventSource.prototype.setEventROI = function(min, max) {};
