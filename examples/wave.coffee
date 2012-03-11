{ RGB, HSV, Junc, Easing, AnimationFrameTicker } = mn.dsk
RPD = Math.PI / 180
RADIUS = 360
CENTER_X = 360
CENTER_Y = 360
LINE_WIDTH = 0.05
POINTS_LENGTH = 5
INTERPOLATE = 500

startAnimation = (point)->
  angle = Math.PI * 2 * Math.random()
  radius = RADIUS * Math.random()
  Junc.to(
    point, {
    #x: CENTER_X + radius * Math.cos angle
    y: CENTER_Y + radius * Math.sin angle
    }, 5000 + 5000 * Math.random(), Easing.easeInOutQuad
  ).complete(
    ->
      console.log 'complete!!'
      startAnimation point
  ).start()

canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'

f = 360 * RPD * Math.random()
t = f + 180 * RPD

from =
  x: CENTER_X - RADIUS
  y: CENTER_Y
to =
  x: CENTER_X + RADIUS
  y: CENTER_Y
context.strokeStyle = '#FF0000'

points = []
for i in [0...POINTS_LENGTH - 2] by 1
  angle = Math.PI * 2 * Math.random()
  radius = RADIUS * Math.random()
  points[i] =
  x: CENTER_X + radius * Math.cos angle
  y: CENTER_Y + radius * Math.sin angle
points.sort (a, b)->
  a.x - b.x
for point in points
  startAnimation point
points.unshift from
points.push to


AnimationFrameTicker.getInstance().addHandler((time)->
  canvas.width = canvas.width
  context.lineWidth = LINE_WIDTH
  hsv = new HSV 0, 1, 1
  len = (points.length - 2) * INTERPOLATE
  unit = 360 / len
  for point, i in points
    if points[i + 4]?
      p0 = point
      p1 = points[i + 1]
      p2 = points[i + 2]
      p3 = points[i + 3]
      p4 = points[i + 4]
      for j in [0..INTERPOLATE] by 1
        context.strokeStyle = hsv.toCSSString()

        pp0 =
          x: p0.x + (p1.x - p0.x) * j / INTERPOLATE
          y: p0.y + (p1.y - p0.y) * j / INTERPOLATE
        pp1 =
          x: p1.x + (p2.x - p1.x) * j / INTERPOLATE
          y: p1.y + (p2.y - p1.y) * j / INTERPOLATE
        pp2 =
          x: p2.x + (p3.x - p2.x) * j / INTERPOLATE
          y: p2.y + (p3.y - p2.y) * j / INTERPOLATE
        pp3 =
          x: p3.x + (p4.x - p3.x) * j / INTERPOLATE
          y: p3.y + (p4.y - p3.y) * j / INTERPOLATE
        ppp0 =
          x: pp0.x + (pp1.x - pp0.x) * j / INTERPOLATE
          y: pp0.y + (pp1.y - pp0.y) * j / INTERPOLATE
        ppp1 =
          x: pp1.x + (pp2.x - pp1.x) * j / INTERPOLATE
          y: pp1.y + (pp2.y - pp1.y) * j / INTERPOLATE
        ppp2 =
          x: pp2.x + (pp3.x - pp2.x) * j / INTERPOLATE
          y: pp2.y + (pp3.y - pp2.y) * j / INTERPOLATE
        pppp0 =
          x: ppp0.x + (ppp1.x - ppp0.x) * j / INTERPOLATE
          y: ppp0.y + (ppp1.y - ppp0.y) * j / INTERPOLATE
        pppp1 =
          x: ppp1.x + (ppp2.x - ppp1.x) * j / INTERPOLATE
          y: ppp1.y + (ppp2.y - ppp1.y) * j / INTERPOLATE

        context.beginPath()
        context.moveTo pppp0.x, pppp0.y
        context.lineTo pppp1.x, pppp1.y
        context.stroke()

        hsv.h += unit
    i += 2

)

