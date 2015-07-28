#! /usr/bin/env node

const fs = require('fs')
const program = require('commander')
const colors = require('colors')
const pkgJson = require('./package.json')

/**
 * Prepare args & opts
 */
program
  .version(pkgJson.version)
  .usage('[-d] \'/<pattern>/<replaceString>/\'')
  .option('-d, --dry-run', 'Dry run.')

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
  exit()
}

/**
 *
 */
const opts = program.opts()

fs.readdir('.', function (err, files) {

  err && exit('readdir-err')

  var partsReg = /^\/([^/]+)\/([^/]*)\/([gimy]*)$/
  var parts, pattern

  try {
    parts = program.args[0].match(partsReg)
    pattern = new RegExp(parts[1], parts[3])
  } catch (err) {
    exit('invalid-regex')
  }

  opts.dryRun && console.log('  -- Dry Run --'.yellow)

  var maxLength = 0
  files.forEach(function (file) {
    file.length > maxLength && (maxLength = file.length)
  })
  maxLength += 3
  var splash = new Array(maxLength).join('-') + '-->'
  var status = opts.dryRun ? 'yellow' : 'green'

  var modified = 0
  files.forEach(function (file) {
    var newName = file.replace(pattern, parts[2])
    if (newName !== file) {
      modified++
      !opts.dryRun && fs.renameSync(file, newName)
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
