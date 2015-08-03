const path = require('path')
const assert = require('assert')
const execFile = require('child_process').execFile

const pkg = require('../package.json')
const binPath = path.join(__dirname, '../', pkg.bin.orn)

describe('bin', function () {

  it('should exit with status 1 if regex is invalid', function (cb) {
    const nodeArgs = [binPath, '/wrong-regex/format', '-d']
    const cp = execFile('node', nodeArgs, function(error, stdout, stderr,go){
      assert.strictEqual(error && error.code, 1)
      cb()
    })
  })

  it('should return the version', function (cb) {
    const cp = execFile('node', [binPath, '--version'])
    const expected = pkg.version

    cp.stdout.on('data', function (data) {
      assert.equal(data.replace(/\r\n|\n/g, ''), expected)
      cb()
    })
  })

})
