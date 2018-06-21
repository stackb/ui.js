goog.module('stack.ui.Injector');

/**
 * Primitive stringly-typed dependency "injector" (or rather, a provider).
 */
class Injector {

  /**
   * Create a new injector.
   */
  constructor() {

    /** @const @private @type {!Map<string,!function(!Injector, ...*):!Object>} */
    this.factories_ = new Map();

    /** @const @private @type {!Map<string,?Object>} */
    this.objects_ = new Map();
    
  }

  /**
   * Set an instance of a particular singleton.
   * @param {string} name
   * @param {!function(!Injector, ...*):!Object} factory
   */
  setFactory(name, factory) {
    if (this.factories_.get(name)) {
      throw new Error("Already defined: " + name);
    }
    this.factories_.set(name, factory);
  }

  /**
   * Set an instance of a particular singleton.
   * @param {string} name
   * @param {!Object} obj
   */
  setInstance(name, obj) {
    if (this.objects_.get(name)) {
      throw new Error("Already defined: " + name);
    }
    this.objects_.set(name, obj);
  }
  
  /**
   * Get a new instance of a particular stringly-named class.
   * @param {string} name
   * @param {...*} args
   * @return {?Object}
   */
  newInstance(name, args) {
    const factory = this.factories_.get(name);
    if (!factory) {
      return null;
    }
    return factory(this, args);
  }

  /**
   * Get a new instance of a particular stringly-named class.
   * @param {string} name
   * @return {?Object}
   */
  getInstance(name) {
    return this.objects_.get(name);
  }
  
}

exports = Injector;
