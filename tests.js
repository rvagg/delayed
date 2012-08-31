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

  , 'delayed()': {
        'no-arg 100ms': function (done) {
          var spy = this.spy()

          D.delayed(spy, 0.1)()

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

          D.delayed(spy, 0.01, 'foo', 'bar')('bang', 'boo')

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args, [ 'foo', 'bar', 'bang', 'boo' ])
            done()
          }, 20)
        }

      , 'multiple calls, curried': function (done) {
          var spy = this.spy()
            , fn = D.delayed(spy, 0.01, 'spicy')

          fn('foo', 'bar')

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args, [ 'spicy', 'foo', 'bar' ])
            fn('boom', 'bang')

            setTimeout(function () {
              assert.equals(spy.callCount, 2)
              assert.equals(spy.secondCall.args, [ 'spicy', 'boom', 'bang' ])
              done()
            }, 20)
          }, 20)
        }
    }

  , 'deferred()': {
        'no-arg': function (done) {
          var spy = this.spy()

          D.deferred(spy)()

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args.length, 0)
            done()
          }, 5)
        }

      , 'curried arguments': function (done) {
          var spy = this.spy()

          D.deferred(spy, 'foo', 'bar')('bang', 'boo')

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args, [ 'foo', 'bar', 'bang', 'boo' ])
            done()
          }, 5)
        }

      , 'multiple calls, curried': function (done) {
          var spy = this.spy()
            , fn = D.deferred(spy, 'spicy')

          fn('foo', 'bar')

          assert.equals(spy.callCount, 0)

          setTimeout(function () {
            assert.equals(spy.callCount, 1)
            assert.equals(spy.firstCall.args, [ 'spicy', 'foo', 'bar' ])
            fn('boom', 'bang')

            setTimeout(function () {
              assert.equals(spy.callCount, 2)
              assert.equals(spy.secondCall.args, [ 'spicy', 'boom', 'bang' ])
              done()
            }, 5)
          }, 5)
        }
    }
})