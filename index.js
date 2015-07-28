#! /usr/bin/env node

var fs = require('fs')
var opts = require('nopt')({
  'dry-run': Boolean
}, {
  'd': ['--dry-run']
})

fs.readdir('.', function (err, files) {

  err && exit('readdir-err')

  var partsReg = /^\/([^/]+)\/([^/]*)\/([gimy]*)$/
  var parts, pattern

  try {
    parts = opts.argv.remain[0].match(partsReg)
    pattern = new RegExp(parts[1], parts[3])
  } catch (err) {
    exit('invalid-regex')
  }

  opts['dry-run'] && console.log('  -- Dry Run --'.yellow)

  var maxLength = 0
  files.forEach(function (file) {
    file.length > maxLength && (maxLength = file.length)
  })
  maxLength += 3
  var splash = new Array(maxLength).join('-') + '-->'
  var status = opts['dry-run'] ? 'yellow' : 'green'

  var modified = 0
  files.forEach(function (file) {
    var newName = file.replace(pattern, parts[2])
    if (newName !== file) {
      modified++
      !opts['dry-run'] && fs.renameSync(file, newName)
      console.log('*'[status], file, splash.substr(file.length - maxLength)[status], newName.bold)
    }
  })

  if (modified === 0) {
    console.log('  Nothing to do.')
  }

  exit()

})

function exit(status) {
  status || (status = 0)

  var exitStatus = {
    '0': [0],
    'invalid-regex': [1, 'Invalid Regex.'],
    'readdir-err': [2, 'Cannot read dir.']
  }

  status && console.log(exitStatus[status][1])
  process.exit(exitStatus[status][0])
}
