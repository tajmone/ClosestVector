(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Closest = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
   * Return closest Number/Vector2/Vector3/VectorN from a given list
   * uses caching for faster response. Has the ability to return every match
   * only once.
   */
var Closest = function () {
  /**
   * Creates an instance of Closest.
   * @param {Array}     list    Elements of reference can be an Array of Numbers
   *                            or Array's with an equal length
   * @param {Boolean}   unique  If set to true, every entry from `list`
   *                            can be returned only once
   *                            unit clearCache() is called
   */
  function Closest(list, unique) {
    _classCallCheck(this, Closest);

    // creates a copy of list
    this.list = Array.from(list);

    this.dimensions = Closest.getDimensions(list[0]);

    this.unique = unique;

    // sets the adequate diff method based on the depth of the vectors
    this.diff = this.dimensions > 1 ? Closest.nDimensionalDiff(this.dimensions) : Closest.oneDimensionalDiff;
    // console.log(this.diff)
    // inits the cache and previouslyReturnedIndexes properties
    this.clearCache(false);
  }

  /**
   * determines if the items in the list are simple numbers or arrays
   * @static
   * @param     {Number|Array} item
   * @return    {Number}       number of dimensions (1 being a simple number,
   *                           everything above is an array)
   */


  _createClass(Closest, [{
    key: 'clearCache',


    /**
     Public method to rest cached value / result paris
     * especially if set to unique (return every match only once)
     * you may want to reset the previously returned indexes
     * @param {Boolean} indexOnly if you are using "unique" mode only the returned
     *                            indexes are cleared by default
     */
    value: function clearCache() {
      var indexOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.unique;

      if (!indexOnly) {
        this.cache = {};
      }
      this.previouslyReturnedIndexes = [];
    }

    /**
     * gets the closes Number/VectorN
     * @param {Number|Array} val reference number or array
     * @return {Object|Null} closes match within lists containing
     *                      {
     *                         closest:   {Number|Array} closest entry from list
     *                         index:     {Number}       index within list
     *                         distance:  {Number}       Distance within the
     *                                                   coordinate system
     *                      }
     */

  }, {
    key: 'get',
    value: function get(val) {
      var minDistance = Infinity;
      var index = 0;
      var closest = this.list[index];

      // is there a better way to do this? If "val" is only a number, it seams
      // like a big overhead to JSON stringify it every-time, I don't see an other
      // way when val is an array thought. Other than something like
      // cache[val[0]][val[1]][val[3]] or whatever
      var valUID = JSON.stringify(val);

      // returns previously found match
      if (!this.unique && this.cache.hasOwnProperty(valUID)) {
        return this.cache[valUID];
      }

      // if set to return every value in the list only once
      // and being out of entries in the list
      if (this.unique && this.previouslyReturnedIndexes.length === this.list.length) {
        return null;
      }

      for (var i = 0; i < this.list.length; i++) {
        // skip if set to unique and value was returned previously
        if (!(this.unique && this.previouslyReturnedIndexes.indexOf(i) > -1)) {
          var distance = this.diff(val, this.list[i]);
          if (distance < minDistance) {
            minDistance = distance;
            index = i;
            closest = this.list[i];
          }
        }
      }

      // save previously returned indexes if set to unique mode,
      if (this.unique) {
        this.previouslyReturnedIndexes.push(index);
      }

      // return and save in cache
      return this.cache[valUID] = { closest: closest, index: index };
    }
  }], [{
    key: 'getDimensions',
    value: function getDimensions(item) {
      return typeof item == 'number' ? 1 : item.length;
    }

    /**
     * diff function for simple numbers
     * @static
     * @param     {Number} val1
     * @param     {Number} val2
     * @return    {Number} Abstract difference between two numbers
     */

  }, {
    key: 'oneDimensionalDiff',
    value: function oneDimensionalDiff(val1, val2) {
      return Math.abs(val1 - val2);
    }

    /**
     * diff function for array's of N numbers
     * @static
     * @param     {Number} dimensions number of dimensions of your vector
     * @return    {Function} returns the adequate diff function
     *                       Euclidean distance
     *                       (https://en.wikipedia.org/wiki/Euclidean_distance)
     */

  }, {
    key: 'nDimensionalDiff',
    value: function nDimensionalDiff(dimensions) {
      if (dimensions == 2) {
        return function (val1, val2) {
          return Math.pow(val1[0] - val2[0], 2) + Math.pow(val1[1] - val2[1], 2);
        };
      } else if (dimensions == 3) {
        return function (val1, val2) {
          return Math.pow(val1[0] - val2[0], 2) + Math.pow(val1[1] - val2[1], 2) + Math.pow(val1[2] - val2[2], 2);
        };
      } else {
        // elegant but slow solution
        return function (val1, val2) {
          return val1.reduce(function (acc, val, i) {
            return Math.pow(val - val2[i], 2) + acc;
          }, 0);
        };
      }
    }
  }]);

  return Closest;
}();

return Closest;

})));
