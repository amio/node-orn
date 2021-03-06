#! /usr/bin/env node

const fs = require('fs')
const vm = require('vm')
const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    'h': 'help',
    'v': 'version',
    'd': 'dry-run'
  }
})

const helpInfo = `
  Usage: orn <RegExp> <replacementString> [-d]

  Arguments:

    <pattern>          The pattern to be replaced, could be a String or RegExp.
    <replacement>      The String to be replace with, Arrow Function is supported.

  Options:

    -h, --help         Output usage information
    -v, --version      Output the version number
    -d, --dry-run      Show how the files will be renamed, but actually do nothing

  Examples:

    orn 720p 1080P                         # Replace "720p" with "1080P".
    orn /720p/i 1080P                      # Replace "720p" or "720P" with "1080P".
    orn '/(\\.js)$/i' '.min$1' -d           # Add ".min" to js files, in dry-run.
    orn '/\\S+mp3$/g' 'x=>x.toLowerCase()'  # Change mp3 filename to lowercase.
`

argv.help && exit('help')
argv.version && exit('version')
argv._.length === 0 && exit('help')
argv._.length === 1 && exit('missing-args')

/**
 *  MAIN
 */

const replacePattern = parseRegExp(argv._[0])
const replacement = parseReplaced(argv._[1])

fs.readdir('.', function (err, files) {
  if (err) exit('readdir-err')

  // Get files to renaming
  const renameTasks = files.map(filename => {
    try {
      const newname = filename.replace(replacePattern, replacement)
      return newname === filename ? undefined : [filename, newname]
    } catch (e) {
      exit('catched-err', e)
    }
  }).filter(item => item !== undefined)

  if (renameTasks.length === 0) exit('no-change', replacePattern)

  // Prepare visual formating
  const modeColor = argv.d ? 'yellow' : 'green'
  const maxNameLength = renameTasks.reduce(function (prev, curr) {
    return [
      Math.max(prev[0], curr[0].length),
      Math.max(prev[1], curr[1].length)
    ]
  }, [0, 0])

  argv.d && console.info(chalk[modeColor]('   -- Dry Run --'))

  // Do rename
  renameTasks.forEach(names => {
    if (!argv.d) fs.renameSync(names[0], names[1])
    printRenamedLine(names, maxNameLength, modeColor)
  })
})

const printRenamedLine = (() => {
  return function (names, maxLength, modeColor) {
    const color = chalk[modeColor]
    const arrowLengthy = new Array(maxLength[0]).join('-') + '--->'
    const arrow = maxLength[0] + maxLength[1] + 8 < process.stdout.columns
      ? color(arrowLengthy.substr(names[0].length))
      : color('\n >')
    console.log(color(' *'), names[0], arrow, chalk.bold(names[1]))
  }
})()

function parseRegExp (patternString) {
  const parts = patternString.match(/^\/(.+)\/([gimy]*)$/)

  if (parts) {
    return new RegExp(parts[1], parts[2])
  } else {
    // exit('invalid-reg')
    return patternString
  }
}

function parseReplaced (string) {
  const isArrowFn = /^\w+\s*=>/.test(string)
  return isArrowFn ? vm.runInNewContext(string) : string
}

function exit (status, info) {
  const exitStatus = {
    'help': [0, helpInfo],
    'version': [0, 'v' + require('./package.json').version],
    'no-change': [0, 'No file to rename'],
    'missing-args': [1, 'Missing args.'],
    'invalid-reg': [2, 'Invalid regular expression.'],
    'readdir-err': [3, 'Cannot read current directory.'],
    'catched-err': [100, info]
  }

  status && console.log(exitStatus[status][1])  // output message
  process.exit(status && exitStatus[status][0]) // exit with code
}
