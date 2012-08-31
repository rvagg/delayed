/*****************************************************************
  * Delayed: A collection of setTimeout-related function wranglers
  * Copyright (c) Rod Vagg (@rvagg) 2012
  * https://github.com/rvagg/traversty
  * License: MIT
  */

!(function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define === 'function' && define.amd) define(name, definition)
  else this[name] = definition()
}('delayed', function () {

  var context      = this
    , old          = context.delayed
    , deferSeconds = 0.001

    , slice = function (arr, i) {
        return Array.prototype.slice.call(arr, i)
      }

    , delay = function (fn, seconds) {
        var args = slice(arguments, 2)
        return setTimeout(function() {
          fn.apply(fn, args)
        }, seconds * 1000)
      }

    , defer = function (fn) {
        return delay.apply(null, [ fn, deferSeconds ].concat(slice(arguments, 1)))
      }

    , delayed = function (fn, seconds) {
        var args = slice(arguments, 2)
        return function () {
          return delay.apply(null, [ fn, seconds ].concat(args).concat(slice(arguments)))
        }
      }

    , deferred = function (fn) {
        return delayed.apply(null, [ fn, deferSeconds ].concat(slice(arguments, 1)))
      }

    , noConflict = function () {
        context.delayed = old
        return this
      }


  return {
      delay      : delay
    , defer      : defer
    , delayed    : delayed
    , deferred   : deferred
    , noConflict : noConflict
  }

}));