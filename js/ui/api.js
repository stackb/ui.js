/**
 * @fileoverview
 * suppress {reportUnknownTypes}
 */
goog.module('js.ui.Api');

const EventTarget = goog.require('goog.events.EventTarget');
const GrpcTransport = goog.require('grpc.Transport');
const GrpcTransportXhr = goog.require('grpc.transport.Xhr');
const Promise_ = goog.require('goog.Promise');
const BzlApi = goog.require('proto.js.ui.Api');

let api = null;

class Api extends EventTarget {

  static getInstance() {
    return api;
  }

  /**
   */
  constructor() {
    super();

    /** @private @type {!goog.promise.Resolver<!js.ui.Api>} */
    this.ready_ = Promise_.withResolver();

    // /** @public @type {!proto.js.ui.api.Config} */
    // this.config = config;

    api = this;

    /** @protected @type {!GrpcApi} */
    this.api = new GrpcApi();
    //this.transport = new GrpcTransportTesting();

    /** @private @type {!UserApi} */
    this.userApi_ = new UserApi(this.transport);
  }

  /**
   * @return {!UserApi}
   */
  getUserApi() {
    return this.userApi_;
  }

  /**
   * Get a promise that resolves when the socket connects.
   *
   * @return {!Promise_<!js.ui.Api>}
   */
  ready() {
    return this.ready_.promise;
  }

  /** @param {string} message */
  notifyError(message) {
    //this.dispatchEvent(new ApiEvent('ERROR', this, message));
  }

}

exports = Api;
