/*global delayed:true, buster:true, D:true */

if (typeof process != 'undefined' && typeof module != 'undefined' && typeof require != 'undefined') {
  // Node
  delayed = 'success'
  delayed = require('./delayed')

  buster = require('buster')
}

D = delayed.noConflict()

buster.testCase('Delayed', {

    'noConflict': function () {
      assert.equals(delayed, 'success')
      assert(D)
      assert.isFunction(D.delayed)
    }

  , 'delay()': {
        'no-arg 100ms': function (done) {
          var spy = this.spy()

          D.delay(spy, 0.1)

          assert.equals(spy.callCount, 0)

          setTimeout(function () { assert.equals(spy.callCount, 0) }, 50)
          setTimeout(function () { assert.equals(spy.callCount, 0) }, 75)
          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args.length, 0)
            done()
          }, 110)
        }

      , 'curried arguments': function (done) {
          var spy = this.spy()

          D.delay(spy, 0.01, 'foo', 'bar')

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args, [ 'foo', 'bar' ])
            done()
          }, 20)
        }

      , 'cancelable': function (done) {
          var spy = this.spy()
            , timeout = D.delay(spy, 0.1)

          assert.equals(spy.callCount, 0)
          clearTimeout(timeout)

          setTimeout(function () {
            assert.equals(spy.callCount, 0)
            done()
          }, 20)
        }
    }

  , 'defer()': {
        'no-arg': function (done) {
          var spy = this.spy()

          D.defer(spy)

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args.length, 0)
            done()
          }, 5)
        }

      , 'curried arguments': function (done) {
          var spy = this.spy()

          D.defer(spy, 'foo', 'bar')

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args, [ 'foo', 'bar' ])
            done()
          }, 5)
        }

      , 'cancelable': function (done) {
          var spy = this.spy()
            , timeout = D.defer(spy)

          assert.equals(spy.callCount, 0)
          clearTimeout(timeout)

          setTimeout(function () {
            assert.equals(spy.callCount, 0)
            done()
          }, 5)
        }
    }
})