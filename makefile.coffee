###
Installation of CoffeeScript
$ npm install -g coffee-script

Usage
$ coffee makefile.coffee

Function
1. Detect change of source file.
2. Compile CoffeeScript to JavaScript.
3. Run test.
###

fs = require 'fs'
path = require 'path'
Flow = require 'nestableflow'
coffee = require 'coffee-script'
uglifyjs = require 'uglify-js'
jsp = uglifyjs.parser
pro = uglifyjs.uglify
{ spawn } = require 'child_process'

requested = false

startWatch = ->
  for dir in ['src', 'test']
    fs.watch dir, onChange

onChange = (event, filename)->
  unless requested
    requested = true
    setTimeout (->
      requested = false
      startCompile()
    ), 1000

timeStamp = ->
  date = new Date()
  "#{ padLeft date.getHours() }:#{ padLeft date.getMinutes() }:#{ padLeft date.getSeconds() }"

padLeft = (num, length = 2, pad = '0')->
  str = num.toString 10
  while str.length < length
    str = pad + str
  str

startCompile = ->
  node = ''
  browser = ''
  flow = Flow.serial(
    (flow)->
      console.log "#{timeStamp()} Start compiling ..."
      flow.next()
    , (flow)->
      fs.readFile 'src/color.coffee', 'utf8', flow.next
    , (flow, code)->
      node = coffee.compile code.replace(/#if BROWSER([\s\S]*?)(#else[\s\S]*?)?#endif/g, (matched, $1, $2, offset, source)->
          if $2? then $2 else ''
      )
      browser = coffee.compile code.replace(/#if BROWSER([\s\S]*?)(#else[\s\S]*?)?#endif/g, (matched, $1, $2, offset, source)->
          if $1? then $1 else ''
      )
      flow.next()
    , Flow.parallel(
      (flow)->
        fs.writeFile "lib/node/color.js", node, flow.next
      , (flow)->
        fs.writeFile "lib/browser/color.js", browser, flow.next
      , (flow)->
        ast = jsp.parse browser
        ast = pro.ast_mangle ast
        ast = pro.ast_squeeze ast
        uglified = pro.gen_code ast
        #          beautify    : true
        #          indent_start: 0
        #          indent_level: 2
        fs.writeFile "lib/browser/color.min.js", uglified, flow.next
    )
    , (flow)->
      console.log "#{ timeStamp() } Complete compiling!"
      flow.next()
  )
  flow.onError = (err)->
    console.log "Error: #{ err }"
  flow.onComplete = test
  flow.start()

test = ->
  console.log "#{timeStamp()} Start testing ..."
  nodeunit = spawn 'nodeunit', ['test']
  nodeunit.stderr.setEncoding 'utf8'
  nodeunit.stderr.on 'data', (data)->
    console.log data.replace(/\s*$/, '')
  nodeunit.stdout.setEncoding 'utf8'
  nodeunit.stdout.on 'data', (data)->
    console.log data.replace(/\s*$/, '')
  nodeunit.on 'exit', (code)->
    console.log "#{timeStamp()} Complete testing!"

startWatch()
startCompile()
