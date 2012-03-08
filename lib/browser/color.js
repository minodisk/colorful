(function() {
  var HSV, RGB, exports;

  if (typeof window !== "undefined" && window !== null) {
    if (window.mn == null) window.mn = {};
    if (window.mn.dsk == null) window.mn.dsk = {};
    exports = window.mn.dsk;
  }

  exports.RGB = RGB = (function() {

    function RGB(color) {
      var $, f, h, i, p, q, r, s, v;
      if (this instanceof RGB) {
        if (arguments.length === 3) {
          this.r = arguments[0];
          this.g = arguments[1];
          this.b = arguments[2];
        } else if (color instanceof HSV) {
          h = color.h, s = color.s, v = color.v;
          while (h < 0) {
            h += 360;
          }
          i = h / 60 % 6;
          f = h / 60 - i;
          p = v * (1 - s);
          q = v * (1 - f * s);
          r = v * (1 - (1 - f) * s);
          switch (i) {
            case 0:
              this.r = v(this.g = t(this.b = p));
              break;
            case 1:
              this.r = q(this.g = v(this.b = p));
              break;
            case 2:
              this.r = p(this.g = v(this.b = t));
              break;
            case 3:
              this.r = p(this.g = q(this.b = v));
              break;
            case 4:
              this.r = t(this.g = p(this.b = v));
              break;
            case 5:
              this.r = v(this.g = p(this.b = q));
          }
        } else if (typeof color === 'number') {
          this.r = color >> 16 & 0xff;
          this.g = color >> 8 & 0xff;
          this.b = color & 0xff;
        } else if (typeof color === 'string') {
          if ($ = color.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/)) {
            this.r = parseInt($[0], 16) & 0xff;
            this.g = parseInt($[1], 16) & 0xff;
            this.b = parseInt($[2], 16) & 0xff;
          } else if ($ = color.match(/rgb\(([0-9]{1,3})[,\s]*([0-9]{1,3})[,\s]*([0-9]{1,3})\)/)) {
            this.r = parseInt($[0], 10) & 0xff;
            this.g = parseInt($[1], 10) & 0xff;
            this.b = parseInt($[2], 10) & 0xff;
          } else {
            throw new TypeError('invalid format');
          }
        } else {
          throw new TypeError('invalid type');
        }
      } else {
        new RGB(color);
      }
    }

    return RGB;

  })();

  exports.HSV = HSV = (function() {

    function HSV(color) {
      var b, diff, g, max, min, r;
      if (this instanceof HSV) {
        if (arguments.length === 3) {
          this.h = arguments[0];
          this.s = arguments[1];
          this.v = arguments[2];
        } else {
          if (!(color instanceof RGB)) color = new RGB(color);
          r = color.r, g = color.g, b = color.b;
          max = Math.max(r, g, b);
          min = Math.min(r, g, b);
          diff = max - min;
          if (r === max) {
            this.h = 60 * (g - b) / diff;
          } else if (g === max) {
            this.h = 60 * (b - r) / diff + 120;
          } else {
            this.h = 60 * (r - g) / diff + 240;
          }
          if (this.h < 0) this.h += 360;
          this.s = diff / max;
          this.v = max / 255;
        }
      } else {
        new HSV(color);
      }
    }

    return HSV;

  })();

}).call(this);
