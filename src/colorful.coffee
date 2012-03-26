#if BROWSER
if window?
  unless window.mn? then window.mn = {}
  unless window.mn.dsk? then window.mn.dsk = {}
  exports = window.mn.dsk
#endif

exports.RGB = class RGB

  constructor: (color)->
    if @ instanceof RGB
      if arguments.length is 3
        @r = arguments[0]
        @g = arguments[1]
        @b = arguments[2]
      else if typeof color is 'number'
        @r = color >> 16 & 0xff
        @g = color >> 8 & 0xff
        @b = color & 0xff
      else if typeof color is 'string'
        if $ = color.match /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/
          @r = parseInt($[1], 16) & 0xff
          @g = parseInt($[2], 16) & 0xff
          @b = parseInt($[3], 16) & 0xff
        else if $ = color.match /rgb\(([0-9]{1,3})[,\s]*([0-9]{1,3})[,\s]*([0-9]{1,3})\)/
          @r = parseInt($[1], 10) & 0xff
          @g = parseInt($[2], 10) & 0xff
          @b = parseInt($[3], 10) & 0xff
        else
          throw new TypeError 'invalid format'
      else
        throw new TypeError 'invalid type'
    else
      if color instanceof HSV
        { h, s, v } = color
        while h < 0 then h += 360
        i = (h / 60 >> 0) % 6
        f = h / 60 - i
        v *= 255
        p = v * (1 - s)
        q = v * (1 - f * s)
        t = v * (1 - (1 - f) * s)
        switch i
          when 0
            r = v
            g = t
            b = p
          when 1
            r = q
            g = v
            b = p
          when 2
            r = p
            g = v
            b = t
          when 3
            r = p
            g = q
            b = v
          when 4
            r = t
            g = p
            b = v
          when 5
            r = v
            g = p
            b = q
        return new RGB Math.round(r), Math.round(g), Math.round(b)
      else
        throw new TypeError 'cannot cast'

  toCSSString: ->
    str = @toNumber().toString(16)
    while str.length < 6
      str = "0#{str}"
    "##{str}"

  toNumber: ->
    @r << 16 | @g << 8 | @b

exports.HSV = class HSV

  @_rgb2hsv: (rgb)->
    { r, g, b } = rgb
    max = Math.max r, g, b
    min = Math.min r, g, b
    diff = max - min
    if r is max
      h = 60 * (g - b) / diff
    else if g is max
      h = 60 * (b - r) / diff + 120
    else
      h = 60 * (r - g) / diff + 240
    if h < 0 then h += 360
    s = diff / max
    v = max / 255
    { h, s, v }

  constructor: (color)->
    if @ instanceof HSV
      if arguments.length is 3
        @h = arguments[0]
        @s = arguments[1]
        @v = arguments[2]
      else
        color = new RGB color
        { @h, @s, @v } = HSV._rgb2hsv color
    else
      if color instanceof RGB
        hsv = HSV._rgb2hsv color
        return new HSV hsv.h, hsv.s, hsv.v
      else
        throw new TypeError 'cannot cast'

  toCSSString: ->
    RGB(@).toCSSString()

  toNumber: ->
    RGB(@).toNumber()
