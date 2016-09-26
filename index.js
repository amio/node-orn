#! /usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const minimist = require('minimist')

const helpInfo = `
  Usage: orn <RegExp> <replaceString> [-d]

  Options:

    -h, --help         Output usage information
    -v, --version      Output the version number
    -d, --dry-run      Show how the files will be renamed, but actually do nothing.

  Examples:

    orn /720p/i 1080P            # Replace "720p" with "1080P"
    orn '/(\.js)/i' '.min$1' -d   # Add ".min" to js/json files.
`

const argv = minimist(process.argv.slice(2), {
  alias: {
    'h': 'help',
    'v': 'version',
    'd': 'dry-run'
  }
})

argv.help && exit('help')
argv.version && exit('version')
argv._.length < 2 && exit('missing-args')

/**
 * Prepare args & opts
 */

/**
 *  MAIN
 */
const replacePattern = parseRegExp(argv._[0])
const replaceString = argv._[1]

fs.readdir('.', function (err, files) {
  if (err) exit('readdir-err')

  // Visual formating output
  const modeColor = argv.d ? 'yellow' : 'green'
  const maxNameLength = files.reduce(function (prev, curr) {
    return prev > curr.length ? prev : curr.length
  }, 0)
  const splash = new Array(maxNameLength).join('-') + '---->'
  if (argv.d) console.log(chalk[modeColor]('  -- Dry Run --'))

  // Renaming
  var noModified = true
  files.forEach(function (file) {
    var newName = file.replace(replacePattern, replaceString)
    if (newName !== file) {
      if (!argv.d) fs.renameSync(file, newName)

      console.log(
        chalk[modeColor]('*'),
        file,
        chalk[modeColor](splash.substr(file.length)),
        chalk.bold(newName)
      )

      noModified = false
    }
  })

  if (noModified) console.log('  Nothing to do.')

  exit()
})

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
    'missing-args': [1, 'Missing args.'],
    'invalid-reg': [2, 'Invalid regular expression.'],
    'readdir-err': [3, 'Cannot read current directory.']
  }

  status && console.log(exitStatus[status][1])  // output message
  process.exit(status && exitStatus[status][0]) // exit with code
}
