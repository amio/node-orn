const path = require('path')
const assert = require('assert')
const execFile = require('child_process').execFile

const pkg = require('../package.json')
const binPath = path.join(__dirname, '../', pkg.bin.orn)

describe('bin', function () {

  it('should return the version', function (cb) {
    const cp = execFile('node', [binPath, '--version'])
    const expected = pkg.version

    cp.stdout.on('data', function (data) {
      assert.equal(data.replace(/\r\n|\n/g, ''), expected)
      cb()
    })
  })

})
