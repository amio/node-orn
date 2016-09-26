#! /usr/bin/env node
'use strict'

const fs = require('fs')
const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    'h': 'help',
    'v': 'version',
    'd': 'dry-run'
  }
})

const helpInfo = `
  Usage: orn <RegExp> <replaceString> [-d]

  Options:

    -h, --help         Output usage information
    -v, --version      Output the version number
    -d, --dry-run      Show how the files will be renamed, but actually do nothing.

  Examples:

    orn /720p/i 1080P            # Replace "720p" with "1080P".
    orn '/(\.js)/i' '.min$1' -d   # Add ".min" to js/json files.
`

argv.help && exit('help')
argv.version && exit('version')
argv._.length < 2 && exit('missing-args')

/**
 *  MAIN
 */

const replacePattern = parseRegExp(argv._[0])
const replaceString = argv._[1]

fs.readdir('.', function (err, files) {
  if (err) exit('readdir-err')

  // Get files to renaming
  const renameTasks = files.map(filename => {
    const newname = filename.replace(replacePattern, replaceString)
    return newname === filename ? undefined : [filename, newname]
  }).filter(item => item !== undefined)

  if (renameTasks.length === 0) exit('no-match')

  // Prepare visual formating
  const modeColor = argv.d ? 'yellow' : 'green'
  const maxNameLength = renameTasks.reduce(function (prev, curr) {
    return Math.max(prev, curr[0].length, curr[1].length)
  }, 0)

  argv.d && console.info(chalk[modeColor]('   -- Dry Run --'))

  // Do rename
  renameTasks.forEach(names => {
    if (!argv.d) fs.renameSync(names[0], names[1])
    printRenamedLine(names, maxNameLength, modeColor)
  })
})

const printRenamedLine = (() => {
  return function (names, maxLength, modeColor) {
    const arrow = new Array(maxLength).join('-') + '-->'
    const color = chalk[modeColor]
    const line = [
      color(' * ') + names[0],
      color(arrow.substr(names[0].length)),
      chalk.bold(names[1])
    ].join(' ')
    console.log(line)
  }
})()

function parseRegExp (regstr) {
  const parts = regstr.match(/^\/(.+)\/([gimy]*)$/)

  if (parts) {
    return new RegExp(parts[1], parts[2])
  } else {
    exit('invalid-reg')
  }
}

function exit (status) {
  const exitStatus = {
    'help': [0, helpInfo],
    'version': [0, 'v' + require('./package.json').version],
    'no-match': [0, 'No matched files.'],
    'missing-args': [1, 'Missing args.'],
    'invalid-reg': [2, 'Invalid regular expression.'],
    'readdir-err': [3, 'Cannot read current directory.']
  }

  status && console.log(exitStatus[status][1])  // output message
  process.exit(status && exitStatus[status][0]) // exit with code
}
