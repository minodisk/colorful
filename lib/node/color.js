(function() {
  var HSV, RGB;

  exports.RGB = RGB = (function() {

    function RGB(color) {
      var $, b, f, g, h, i, p, q, r, s, t, v;
      if (this instanceof RGB) {
        if (arguments.length === 3) {
          this.r = arguments[0];
          this.g = arguments[1];
          this.b = arguments[2];
        } else if (typeof color === 'number') {
          this.r = color >> 16 & 0xff;
          this.g = color >> 8 & 0xff;
          this.b = color & 0xff;
        } else if (typeof color === 'string') {
          if ($ = color.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/)) {
            this.r = parseInt($[1], 16) & 0xff;
            this.g = parseInt($[2], 16) & 0xff;
            this.b = parseInt($[3], 16) & 0xff;
          } else if ($ = color.match(/rgb\(([0-9]{1,3})[,\s]*([0-9]{1,3})[,\s]*([0-9]{1,3})\)/)) {
            this.r = parseInt($[1], 10) & 0xff;
            this.g = parseInt($[2], 10) & 0xff;
            this.b = parseInt($[3], 10) & 0xff;
          } else {
            throw new TypeError('invalid format');
          }
        } else {
          throw new TypeError('invalid type');
        }
      } else {
        if (color instanceof HSV) {
          h = color.h, s = color.s, v = color.v;
          while (h < 0) {
            h += 360;
          }
          i = (h / 60 >> 0) % 6;
          f = h / 60 - i;
          v *= 255;
          p = v * (1 - s);
          q = v * (1 - f * s);
          t = v * (1 - (1 - f) * s);
          switch (i) {
            case 0:
              r = v;
              g = t;
              b = p;
              break;
            case 1:
              r = q;
              g = v;
              b = p;
              break;
            case 2:
              r = p;
              g = v;
              b = t;
              break;
            case 3:
              r = p;
              g = q;
              b = v;
              break;
            case 4:
              r = t;
              g = p;
              b = v;
              break;
            case 5:
              r = v;
              g = p;
              b = q;
          }
          return new RGB(Math.round(r), Math.round(g), Math.round(b));
        } else {
          throw new TypeError('cannot cast');
        }
      }
    }

    RGB.prototype.toCSSString = function() {
      var str;
      str = this.toNumber().toString(16);
      while (str.length < 6) {
        str = "0" + str;
      }
      return "#" + str;
    };

    RGB.prototype.toNumber = function() {
      return this.r << 16 | this.g << 8 | this.b;
    };

    return RGB;

  })();

  exports.HSV = HSV = (function() {

    HSV._rgb2hsv = function(rgb) {
      var b, diff, g, h, max, min, r, s, v;
      r = rgb.r, g = rgb.g, b = rgb.b;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      diff = max - min;
      if (r === max) {
        h = 60 * (g - b) / diff;
      } else if (g === max) {
        h = 60 * (b - r) / diff + 120;
      } else {
        h = 60 * (r - g) / diff + 240;
      }
      if (h < 0) h += 360;
      s = diff / max;
      v = max / 255;
      return {
        h: h,
        s: s,
        v: v
      };
    };

    function HSV(color) {
      var hsv, _ref;
      if (this instanceof HSV) {
        if (arguments.length === 3) {
          this.h = arguments[0];
          this.s = arguments[1];
          this.v = arguments[2];
        } else {
          color = new RGB(color);
          _ref = HSV._rgb2hsv(color), this.h = _ref.h, this.s = _ref.s, this.v = _ref.v;
        }
      } else {
        if (color instanceof RGB) {
          hsv = HSV._rgb2hsv(color);
          return new HSV(hsv.h, hsv.s, hsv.v);
        } else {
          throw new TypeError('cannot cast');
        }
      }
    }

    HSV.prototype.toCSSString = function() {
      return RGB(this).toCSSString();
    };

    HSV.prototype.toNumber = function() {
      return RGB(this).toNumber();
    };

    return HSV;

  })();

}).call(this);
