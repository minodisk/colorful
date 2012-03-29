###
makefile.coffee v0.1.0

Usage
$ coffee makefile.coffee

Function
1. Detect change of source file.
2. Compile CoffeeScript to JavaScript.
3. Run test.
###

fs = require 'fs'
path = require 'path'
{spawn} = require 'child_process'
coffee = require 'coffee-script'
{parser, uglify} = require 'uglify-js'
{Junc} = require 'junc'

SRC_DIR = 'src'
DST_DIR = 'lib'
TEST_DIR = 'test'
R_IF_BROWSER = /#if BROWSER([\s\S]*?)(#else[\s\S]*?)?#endif/g
requested = false

startWatch = ->
  for dir in [SRC_DIR, TEST_DIR]
    fs.watch dir, (event, filename)->
      unless requested
        requested = true
        setTimeout (->
          requested = false
          startCompile()
        ), 1000

timeStamp = ->
  date = new Date()
  "#{padLeft date.getHours()}:#{padLeft date.getMinutes()}:#{padLeft date.getSeconds()}"

padLeft = (num, length = 2, pad = '0')->
  str = num.toString 10
  while str.length < length
    str = pad + str
  str

startCompile = ->
  Junc.serial(
    Junc.func(->
      console.log "#{timeStamp()} Start compiling ..."
      fs.readdir SRC_DIR, @next
    )
    Junc.func((err, files)->
      if err?
        console.log err
      else
        @next files
    )
    Junc.each(
      Junc.serial(
        Junc.func((file)->
          @local.basename = path.basename file, path.extname(file)
          fs.readFile path.join(SRC_DIR, file), 'utf8', @next
        )
        Junc.func((err, code)->
          if err?
            @skip()
          else
            node = coffee.compile(
              code.replace R_IF_BROWSER, (matched, $1, $2, offset, source)->
                if $2? then $2 else ''
            )
            browser = coffee.compile(
              code.replace R_IF_BROWSER, (matched, $1, $2, offset, source)->
                if $1? then $1 else ''
            )
            parsed = parser.parse browser
            parsed = uglify.ast_mangle parsed
            parsed = uglify.ast_squeeze parsed
            uglified = uglify.gen_code parsed
            @next [
              { path: "node/#{@local.basename}.js", code: node }
              { path: "browser/#{@local.basename}.js", code: browser }
              { path: "browser/#{@local.basename}.min.js", code: uglified }
            ]
        )
        Junc.each(
          Junc.func((file)->
            fs.writeFile path.join(DST_DIR, file.path), file.code, @next
          )
        )
      )
    )
    Junc.func(->
      console.log "#{timeStamp()} Complete compiling!"
      @next()
    )
  )
  .complete(test)
  .start()

test = ->
  console.log "#{timeStamp()} Start testing ..."
  nodeunit = spawn 'nodeunit', [TEST_DIR]
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