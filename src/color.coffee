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
      else if color instanceof HSV
        { h, s, v } = color
        while h < 0 then h += 360
        i = h / 60 % 6
        f = h / 60 - i
        p = v * (1 - s)
        q = v * (1 - f * s)
        r = v * (1 - (1 - f) * s)
        switch i
          when 0 then @r = v @g = t @b = p
          when 1 then @r = q @g = v @b = p
          when 2 then @r = p @g = v @b = t
          when 3 then @r = p @g = q @b = v
          when 4 then @r = t @g = p @b = v
          when 5 then @r = v @g = p @b = q
      else if typeof color is 'number'
        @r = color >> 16 & 0xff
        @g = color >> 8 & 0xff
        @b = color & 0xff
      else if typeof color is 'string'
        if $ = color.match /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/
          @r = parseInt($[0], 16) & 0xff
          @g = parseInt($[1], 16) & 0xff
          @b = parseInt($[2], 16) & 0xff
        else if $ = color.match /rgb\(([0-9]{1,3})[,\s]*([0-9]{1,3})[,\s]*([0-9]{1,3})\)/
          @r = parseInt($[0], 10) & 0xff
          @g = parseInt($[1], 10) & 0xff
          @b = parseInt($[2], 10) & 0xff
        else
          throw new TypeError 'invalid format'
      else
        throw new TypeError 'invalid type'
    else
      new RGB color

exports.HSV = class HSV

  constructor: (color)->
    if @ instanceof HSV
      if arguments.length is 3
        @h = arguments[0]
        @s = arguments[1]
        @v = arguments[2]
      else
        unless color instanceof RGB
          color = new RGB color
        { r, g, b } = color
        max = Math.max r, g, b
        min = Math.min r, g, b
        diff = max - min
        if r is max
          @h = 60 * (g - b) / diff
        else if g is max
          @h = 60 * (b - r) / diff + 120
        else
          @h = 60 * (r - g) / diff + 240
        if @h < 0 then @h += 360
        @s = diff / max
        @v = max / 255
    else
      new HSV color
