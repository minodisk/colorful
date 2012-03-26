# ColorfulJS

Color space converter, supports RGB and HSV.

## Installation (Node.js)

    $ npm install color-js

## Load Module (browser)

    <script type="text/javascript" src="color.js"></script>

## API Documentation

### RGB

* **new RGB(r, g, b)** - Constructor.
* **new RGB(hex)** - Constructor.
* **new RGB(css)** - Constructor.
* **RGB(hsv)** - Cast type from `HSV` to `RGB`.
* **toCSSString()** - Create CSS String (like '#ff0000').
* **toNumber()** - Create color Number (like 0xff0000).
* **r** - Red (0-255)
* **g** - Green (0-255)
* **b** - Blue (0-255)

### HSV

* **new HSV(h, s, v)** - Constructor.
* **new HSV(hex)** - Constructor.
* **new HSV(css)** - Constructor.
* **HSV(rgb)** - Cast type from `RGB` to `HSV`.
* **toCSSString()** - Create CSS String (like '#ff0000').
* **toNumber()** - Create color Number (like 0xff0000).
* **h** - Hue (0-360)
* **s** - Saturation (0.0-1.0)
* **v** - Value (0.0-1.0)

## Usage

### Node.js

    var color = require('color-js');
    var RGB = color.RGB;
    var HSV = color.HSV;


### Browser

    var RGB = mn.dsk.RGB;
    var HSV = mn.dsk.HSV;

## Examples

[ColorfulJS Examples](http://minodisk.github.com/colorful-js/examples/)
