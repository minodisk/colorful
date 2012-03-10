{ RGB, HSV } = mn.dsk
canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'
hsv = new HSV h, 1, 1
context.lineWidth = 1
for h in [0...360]
  hsv.h = h
  rgb = RGB hsv
  context.strokeStyle = hsv.toCSSString()
  context.beginPath()
  context.moveTo h + 0.5, 0
  context.lineTo h + 0.5, 90
  context.stroke()
context.font = '36px sans-serif bold'
context.textAlign = 'right'
context.fillStyle = '#ffffff'
context.fillText 'ColorJS', 360, 90
