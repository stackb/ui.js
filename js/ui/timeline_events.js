/**
 * @fileoverview 
 * @suppress {reportUnknownTypes} 
 */
goog.module('js.ui.TimelineEvents');

const TimelineEventSource = goog.require('js.ui.TimelineEventSource');

/**
 * @template T
 * @implements {TimelineEventSource<T>}
 */
class TimelineEvents {

  constructor() {

    /** @private @type {!Map<T,{id:string,event:T,date:!Date,year:number,color:string}>} */ 
    this.map_ = new Map();

    /** @private @type {!Array<T>} */ 
    this.events_ = [];
  }

  /**
   * @return {number}
   */
  getSize() {
    return this.events_.length;
  }
  
  /**
   * @param {T} event
   * @param {number} year
   * @param {!Date} date
   * @param {string} color
   * @param {?string=} opt_id
   */
  addEvent(event, year, date, color, opt_id) {
    const entry = {
      year: year,
      date: date,
      color: color,
      event: event,
      id: opt_id || String(this.getSize()),
    };
    this.map_.set(event, entry);
    this.events_.push(event);
  }
  
  /**
   * @return {!Array<T>}
   */
  getEvents() {
    return this.events_;
  }
  
  /**
   * @param {T} event
   * @override
   */
  getEventId(event) {
    return this.map_.get(event).id;
  }
  
  /**
   * @param {T} event
   * @override
   */
  getEventDate(event) {
    return this.map_.get(event).date;
  }
  
  /**
   * @param {T} event
   * @override
   */
  getEventYear(event) {
    return this.map_.get(event).year;
  }

  /**
   * @param {T} event
   * @override
   */
  getEventColor(event) {
    return this.map_.get(event).color;
  }

  /**
   * @override
   */
  setEventROI(min, max) {
  }
  
}

exports = TimelineEvents;
