#! /usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const program = require('commander')
const pkgJson = require('./package.json')

/**
 * Prepare args & opts
 */
program
  .version(pkgJson.version)
  .usage('[-d] \'/<pattern>/<replaceString>/\'')
  .option('-d, --dry-run', 'Show how the files will be renamed, but actually do nothing.')

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
  exit()
}

/**
 *  MAIN
 */
const opts = program.opts()

fs.readdir('.', function (err, files) {

  if (err) exit('readdir-err')

  // Prepare the patterns
  const partsReg = /^\/([^/]+)\/([^/]*)\/([gimy]*)$/
  const parts = program.args[0].match(partsReg)
  if (!parts || parts.length !== 4) exit('invalid-format')

  const replacePattern = new RegExp(parts[1], parts[3])

  // Visual formating output
  const modeColor = opts.dryRun ? 'yellow' : 'green'
  const maxNameLength = files.reduce(function (prev, curr) {
    return prev > curr.length ? prev : curr.length
  }, 0)
  const splash = new Array(maxNameLength).join('-') + '---->'
  if (opts.dryRun) console.log(chalk[modeColor]('  -- Dry Run --'))

  // Renaming
  var noModified = true
  files.forEach(function (file) {
    var newName = file.replace(replacePattern, parts[2])
    if (newName !== file) {

      if (!opts.dryRun) fs.renameSync(file, newName)

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

function exit(status) {
  if (!status) status = 0

  var exitStatus = {
    '0': [0],
    'invalid-format': [1, 'Invalid pattern or replaceString. Try "orn --help".'],
    'readdir-err': [2, 'Cannot read directory.'],
  }

  if (status) console.log(exitStatus[status][1])
  process.exit(exitStatus[status][0])
}
