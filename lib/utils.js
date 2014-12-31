var _ = require('underscore')
  , chai = require('chai')
  , chaiStats = require('chai-stats')
chai.use(chaiStats)

// Generate one audio block, compare it with `expected` and calls `done(err)`
exports.expectSamples = function(onContext, expected, done) {
  var channelCount = expected.length
    , frameCount = expected[0].length
    , context = new OfflineAudioContext(channelCount, frameCount, 44100)
  onContext(context)
  context.oncomplete = function(event) {
    var ch, actual = []
    for (ch = 0; ch < channelCount; ch++)
      actual.push(_.toArray(event.renderedBuffer.getChannelData(ch)))
    try { assertBlocksEqual(actual, expected) } catch(err) { done(err) }
    done()
  }
  context.startRendering()
}

// Compare blocks `actual` and `expected`, throw a chai.AssertionError if they
// are not approximately equal.
var assertBlocksEqual = exports.assertBlocksEqual = function(actual, expected) {
  var ch, channelCount = expected.length
  for (ch = 0; ch < channelCount; ch++) {  
    actual[ch] = _.toArray(actual[ch])
    expected[ch] = _.toArray(expected[ch])
  }
  for (ch = 0; ch < channelCount; ch++) {
    try {
      chai.assert.deepAlmostEqual(
        _.toArray(actual[ch]),
        _.toArray(expected[ch])
      , 4)
    } catch (err) {
      if (err instanceof chai.AssertionError) {
        throw (new chai.AssertionError('\ngot      : ' + _blockToStr(actual)
          + '\nexpected : ' + _blockToStr(expected)))
      } else throw err
    }
  }
}

var _blockToStr = function(block) {
  var frameCount = block[0].length
  return block.map(function(arr) {
    if (frameCount < 10) {
      return JSON.stringify(arr.map(function(v) { return round(v, 6) }))
    } else {
      return (
        JSON.stringify(arr.slice(0, 5).map(function(v) { return round(v, 6) })).slice(0, -1)
        + '  ....  ' + JSON.stringify(arr.slice(-5).map(function(v) { return round(v, 6) })).slice(1))
    }
  }).join('   ')
}

// Makes one audio block of shape `[channelCount, frameCount]`, and populates it
// with `generator`. 
exports.makeBlock = function(channelCount, frameCount, generator) {
  var block = [], ch
  for (ch = 0; ch < channelCount; ch++) {
    block.push(_.range(frameCount).map(function(i) {
      if (_.isNumber(generator[ch])) return generator[ch]
      else return generator[ch](ch, i)
    }))
  }
  return block
}

var round = exports.round = function(num, dec) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
}