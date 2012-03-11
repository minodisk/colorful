{ RGB, HSV } = mn.dsk
RPD = Math.PI / 180
RADIUS = 180
CENTER_X = 180
CENTER_Y = 180
UNIT_ANGLE = Math.PI * 2 / 360
UNIT_ANGLE_HALF = UNIT_ANGLE / 2 + 0.3 * RPD

canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'
hsv = new HSV h, 1, 1
for h in [0...360]
  hsv.h = h
  context.fillStyle = hsv.toCSSString()
  context.beginPath()
  start = -(h * RPD - UNIT_ANGLE_HALF)
  end = -(h * RPD + UNIT_ANGLE_HALF)
  context.moveTo CENTER_X, CENTER_Y
  context.lineTo CENTER_X + RADIUS * Math.cos(start), CENTER_Y + RADIUS * Math.sin(start)
  context.arc CENTER_X, CENTER_Y, RADIUS, start, end, true
  context.closePath()
  context.fill()
