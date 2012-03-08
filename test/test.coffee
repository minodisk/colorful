{ RGB, HSV } = require '../lib/node/color'

module.exports =

  'RGB':

    'constructor': (test)->
      c = { r: 0xa2, g: 0xfa, b: 0x3c }
      test.deepEqual new RGB(c.r, c.g, c.b), c, 'r, g, b number'
      test.deepEqual new RGB(0xa2fa3c), c, 'hex number'
      test.deepEqual new RGB('#a2fa3c'), c, 'hex string'
      test.deepEqual new RGB('rgb(162, 250, 60)'), c, 'css string'
      test.done()

    'cast HSV to RGB': (test)->
      test.deepEqual RGB(new HSV(87.78947368421052, 0.76, 0.9803921568627451)), new RGB(0xa2, 0xfa, 0x3c)
      test.done()

    'toCSSString': (test)->
      test.strictEqual new RGB(0xa2fa3c).toCSSString(), '#a2fa3c'
      test.done()

    'toNumber': (test)->
      test.strictEqual new RGB(0xa2fa3c).toNumber(), 0xa2fa3c
      test.done()

  'HSV':

    'constructor': (test)->
      c = { h: 87.78947368421052, s: 0.76, v: 0.9803921568627451 }
      test.deepEqual new HSV(c.h, c.s, c.v), c, 'h, s, v number'
      test.deepEqual new HSV(0xa2fa3c), c, 'hex number'
      test.deepEqual new HSV('#a2fa3c'), c, 'hex string'
      test.deepEqual new HSV('rgb(162, 250, 60)'), c, 'css string'
      test.done()

    'cast RGB to HSV': (test)->
      test.deepEqual HSV(new RGB(0xa2, 0xfa, 0x3c)), new HSV(87.78947368421052, 0.76, 0.9803921568627451)
      test.done()

    'toCSSString': (test)->
      test.strictEqual new HSV(87.78947368421052, 0.76, 0.9803921568627451).toCSSString(), '#a2fa3c'
      test.done()

    'toNumber': (test)->
      test.strictEqual new HSV(87.78947368421052, 0.76, 0.9803921568627451).toNumber(), 0xa2fa3c
      test.done()
