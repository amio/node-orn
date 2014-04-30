#! /usr/bin/env node

var fs = require('fs');
var opts = require('nopt')({
  'test': Boolean
});

fs.readdir('.', function (err, files) {

  err && exit('readdir-err');
  
  opts.test && console.log('TEST mode:');

  try {
    var partsRegex = /^\/([^/]+)\/([gimy]*)$/;
    var parts = opts.argv.remain[0].match(partsRegex);
    var renameReg = new RegExp(parts[1], parts[2]);
  } catch (err) {
    exit('invalid-regex');
  }

  files.forEach(function (file) {
    var newName = file.replace(renameReg, opts.argv.remain[1]);
    if (newName != file) {
      var spaces = file.length < 38 ? new Array(38 - file.length).join('-') + '>' : '';
      console.log('>', file, spaces, newName);
      !opts.test && fs.renameSync(file, newName);
    }
  });

  exit();

});

function exit(status) {
  status || (status = 0);

  var exitStatus = {
    '0': [0],
    'invalid-regex': [1, 'Invalid Regex.'],
    'readdir-err': [2, 'Cannot read dir.']
  };

  status && console.log(exitStatus[status][1]);
  process.exit(exitStatus[status][0]);
}
